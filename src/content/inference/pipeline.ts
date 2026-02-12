import { generateDefaultCrops, generateDeepScanTiles } from './crops';
import { InferenceResult, CropRect } from './types';
import Worker from './worker?worker&inline';

// Instantiate the worker once
const worker = new Worker();

// Initialize the worker with config
worker.postMessage({
    type: 'init',
    payload: {
        modelPath: chrome.runtime.getURL('models/model_quantized.onnx'),
        wasmPaths: chrome.runtime.getURL('wasm/')
    }
});

// Map to store pending requests: ID -> { resolve, reject, onProgress }
const pendingRequests = new Map<string, {
    resolve: (res: InferenceResult) => void;
    reject: (err: Error) => void;
    onProgress?: (processed: number, total: number) => void;
}>();

// Listen for worker messages
// Listen for worker messages
worker.onmessage = (e: MessageEvent) => {
    // console.log('[Pipeline] Received message:', e.data.type);
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
    // Try to reject all pending requests if worker crashes
    for (const req of pendingRequests.values()) {
        req.reject(new Error("Worker crashed or failed to start"));
    }
    pendingRequests.clear();
};

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
        : generateDefaultCrops(width, height);

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
