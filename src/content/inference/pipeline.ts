import { generateGridCrops, generateDeepScanTiles, getAdaptiveCrops } from './crops';
import { computeQualityMap } from './saliency';
import { InferenceResult, CropRect } from './types';
import Worker from './worker?worker&inline';

const TIMEOUT_DEFAULT_MS = 30_000;
const TIMEOUT_DEEP_MS = 120_000;

const workerInitPayload = {
    modelPaths: {
        global:     chrome.runtime.getURL('models/model_global_quantized.onnx'),
        local:      chrome.runtime.getURL('models/model_local_quantized.onnx'),
        globalMeta: chrome.runtime.getURL('models/model_global_meta.json'),
        localMeta:  chrome.runtime.getURL('models/model_local_meta.json'),
        fusion:     chrome.runtime.getURL('models/fusion_v2.json'),
    },
    wasmPaths: {
        'ort-wasm.wasm':              chrome.runtime.getURL('wasm/ort-wasm.wasm'),
        'ort-wasm-simd.wasm':         chrome.runtime.getURL('wasm/ort-wasm-simd.wasm'),
        'ort-wasm-threaded.wasm':     chrome.runtime.getURL('wasm/ort-wasm-threaded.wasm'),
        'ort-wasm-simd-threaded.wasm':chrome.runtime.getURL('wasm/ort-wasm-simd-threaded.wasm'),
    },
};

let worker = new Worker();

const pendingRequests = new Map<string, {
    resolve: (res: InferenceResult) => void;
    reject: (err: Error) => void;
    onProgress?: (processed: number, total: number) => void;
}>();

const rejectAllPending = (reason: string): void => {
    for (const req of pendingRequests.values()) req.reject(new Error(reason));
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
            console.error('[Pipeline] Worker error:', error);
            request.reject(new Error(error));
            pendingRequests.delete(id);
        } else if (type === 'progress') {
            request.onProgress?.(processed, total);
        }
    };

    worker.onerror = (e) => {
        console.error('[Pipeline] Worker crash:', e);
        rejectAllPending('Worker crashed or failed to start');
    };
};

const initWorker = (): void => {
    worker.postMessage({ type: 'init', payload: workerInitPayload });
};

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

export async function runMultiCropInference(
    bitmap: ImageBitmap,
    mode: 'default' | 'deep',
    onProgress?: (processed: number, total: number) => void
): Promise<InferenceResult> {
    const width = bitmap.width;
    const height = bitmap.height;

    let crops: CropRect[] = [];
    let heatmapData: Float32Array | undefined;

    if (mode === 'deep') {
        crops = generateDeepScanTiles(width, height);
    } else {
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);

        const qualityMap = computeQualityMap(imageData);
        heatmapData = qualityMap;
        crops = getAdaptiveCrops(width, height, qualityMap, 10);

        if (crops.length === 0) {
            console.warn('[Pipeline] Adaptive cropping failed, falling back to grid');
            crops = generateGridCrops(width, height);
        }
    }

    if (crops.length === 0) throw new Error('No valid crops generated');

    const id = crypto.randomUUID();
    const timeoutMs = mode === 'deep' ? TIMEOUT_DEEP_MS : TIMEOUT_DEFAULT_MS;

    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            if (pendingRequests.has(id)) {
                pendingRequests.delete(id);
                reject(new Error(`Inference timed out after ${timeoutMs / 1000}s`));
            }
        }, timeoutMs);

        pendingRequests.set(id, {
            resolve: (res) => {
                clearTimeout(timeoutId);
                if (heatmapData) {
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
            onProgress,
        });

        worker.postMessage({ id, action: 'inference', bitmap, crops, mode }, [bitmap]);
    });
}
