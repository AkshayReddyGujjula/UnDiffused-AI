import { generateGridCrops, generateDeepScanTiles } from './crops';
import { InferenceResult, CropRect } from './types';
import Worker from './worker?worker&inline';

const workerInitPayload = {
    modelPath: chrome.runtime.getURL('models/model_quantized.onnx'),
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

    // 1. Generate Crops (Main Thread - fast)
    const crops: CropRect[] = mode === 'deep'
        ? generateDeepScanTiles(width, height)
        : generateGridCrops(width, height);

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
