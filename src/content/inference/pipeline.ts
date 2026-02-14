import { generateGridCrops, generateDeepScanTiles, getAdaptiveCrops } from './crops';
import { computeQualityMap } from './saliency';
import { InferenceResult, CropRect } from './types';
import Worker from './worker?worker&inline';

const workerInitPayload = {
    modelPaths: {
        global: chrome.runtime.getURL('models/model_global_quantized.onnx'),
        local: chrome.runtime.getURL('models/model_local_quantized.onnx'),
    },
    wasmPaths: {
        'ort-wasm.wasm': chrome.runtime.getURL('wasm/ort-wasm.wasm'),
        'ort-wasm-simd.wasm': chrome.runtime.getURL('wasm/ort-wasm-simd.wasm'),
        'ort-wasm-threaded.wasm': chrome.runtime.getURL('wasm/ort-wasm-threaded.wasm'),
        'ort-wasm-simd-threaded.wasm': chrome.runtime.getURL('wasm/ort-wasm-simd-threaded.wasm'),
    }
};

let worker = new Worker();

// Map to store pending requests: ID -> { resolve, reject, onProgress }
const pendingRequests = new Map<string, {
    resolve: (res: InferenceResult) => void;
    reject: (err: Error) => void;
    onProgress?: (processed: number, total: number) => void;
}>();

const rejectAllPending = (reason: string): void => {
    for (const req of pendingRequests.values()) {
        req.reject(new Error(reason));
    }
    pendingRequests.clear();
};

const attachWorkerHandlers = (): void => {
    worker.onmessage = (e: MessageEvent) => {
        const { id, type, data, error, processed, total } = e.data;
        const request = pendingRequests.get(id);
        if (!request) return;

        if (type === 'result') {
            console.log('[Pipeline] Inference complete');
            request.resolve(data);
            pendingRequests.delete(id);
        } else if (type === 'error') {
            console.error('[Pipeline] Worker reported error:', error);
            request.reject(new Error(error));
            pendingRequests.delete(id);
        } else if (type === 'progress') {
            if (request.onProgress) {
                request.onProgress(processed, total);
            }
        }
    };

    worker.onerror = (e) => {
        console.error('[Pipeline] Worker Error Event:', e);
        rejectAllPending('Worker crashed or failed to start');
    };
};

const initWorker = (): void => {
    worker.postMessage({
        type: 'init',
        payload: workerInitPayload
    });
}



attachWorkerHandlers();
initWorker();

const recreateWorker = (): void => {
    worker.terminate();
    worker = new Worker();
    attachWorkerHandlers();
    initWorker();
};

export function cancelAllInferences(reason = 'Inference cancelled'): void {
    rejectAllPending(reason);
    recreateWorker();
}

/**
 * Runs inference on the provided ImageBitmap using the Web Worker.
 * WARN: The bitmap is TRANSFERRED to the worker and will be unusable here after calling this.
 */
export async function runMultiCropInference(
    bitmap: ImageBitmap,
    mode: 'default' | 'deep',
    onProgress?: (processed: number, total: number) => void
): Promise<InferenceResult> {
    const width = bitmap.width;
    const height = bitmap.height;

    // 1. Generate Crops (Main Thread)
    let crops: CropRect[] = [];
    let heatmapData: Float32Array | undefined;

    if (mode === 'deep') {
        crops = generateDeepScanTiles(width, height);
    } else {
        // --- Adaptive Subject-Aware Cropping ---

        // 1. Extract Pixel Data
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);

        // 2. Compute Saliency/Quality Map
        const qualityMap = computeQualityMap(imageData);
        heatmapData = qualityMap; // Store for valid visualization

        // 3. Generate Adaptive Crops
        crops = getAdaptiveCrops(width, height, qualityMap, 9);

        // Fallback: If we somehow got 0 crops (shouldn't happen with fallback logic in getAdaptiveCrops), use grid
        if (crops.length === 0) {
            console.warn('[Pipeline] Adaptive cropping failed, falling back to grid');
            crops = generateGridCrops(width, height);
        }
    }

    if (crops.length === 0) throw new Error("No valid crops generated");

    // 2. Prepare Request
    const id = crypto.randomUUID();

    return new Promise((resolve, reject) => {
        // Set timeout to prevent infinite hanging
        const timeoutId = setTimeout(() => {
            if (pendingRequests.has(id)) {
                pendingRequests.delete(id);
                reject(new Error("Inference timed out after 30s"));
            }
        }, 30000);

        pendingRequests.set(id, {
            resolve: (res) => {
                clearTimeout(timeoutId);
                // Attach the computed heatmap data to the result
                if (heatmapData) {
                    // Convert Float32Array to number[] for compatibility if needed, 
                    // or change the type definition. For now assuming number[] or compatible.
                    // The UI expects number[] or typed array. The type says number[].
                    // Let's convert to regular array to be safe with messaging/types
                    res.heatmapData = Array.from(heatmapData);
                    res.heatmapWidth = width;
                    res.heatmapHeight = height;
                }
                resolve(res);
            },
            reject: (err) => {
                clearTimeout(timeoutId);
                reject(err);
            },
            onProgress
        });

        // 3. Send to Worker (Transfer bitmap)
        worker.postMessage({
            id,
            action: 'inference',
            bitmap,
            crops,
            mode
        }, [bitmap]); // Transferable
    });
}
