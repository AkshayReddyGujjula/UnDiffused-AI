import * as ort from 'onnxruntime-web';
import { CropRect, InferenceResult, CropResult } from './types';

console.log('[Worker] Worker script loaded and starting...');

// Configuration (received from main thread)
let config: {
    modelPath: string;
    wasmPaths: string | Record<string, string>;
} | null = null;

const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];
const TARGET_SIZE = 224;

let session: ort.InferenceSession | null = null;
let inferenceQueue: Promise<void> = Promise.resolve();



// --- Helper: Softmax ---
function softmax(logits: number[]): number[] {
    const max = Math.max(...logits);
    const exps = logits.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}

// --- Helper: Batch Tensors ---
function batchTensors(tensors: ort.Tensor[]): ort.Tensor {
    if (tensors.length === 0) throw new Error("No tensors to batch");
    const batchSize = tensors.length;
    const channels = 3;
    const height = 224;
    const width = 224;
    const singleTensorSize = channels * height * width;
    const batchedData = new Float32Array(batchSize * singleTensorSize);
    tensors.forEach((tensor, i) => {
        batchedData.set(tensor.data as Float32Array, i * singleTensorSize);
    });
    const tensor = new ort.Tensor('float32', batchedData, [batchSize, channels, height, width]);
    // DEBUG: Log tensor shape
    console.log('[Worker] Batch Tensor Shape:', tensor.dims);
    return tensor;
}

// --- Helper: Extract Crop to Tensor (Worker Version) ---
function extractCropToTensor(
    sourceBitmap: ImageBitmap, // Using ImageBitmap in worker
    crop: CropRect
): ort.Tensor {
    const canvas = new OffscreenCanvas(TARGET_SIZE, TARGET_SIZE);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Failed to get context");

    ctx.drawImage(
        sourceBitmap,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, TARGET_SIZE, TARGET_SIZE
    );

    const imgData = ctx.getImageData(0, 0, TARGET_SIZE, TARGET_SIZE);
    const { data } = imgData;
    const float32Data = new Float32Array(3 * TARGET_SIZE * TARGET_SIZE);

    for (let i = 0; i < TARGET_SIZE * TARGET_SIZE; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        float32Data[i] = (r / 255.0 - MEAN[0]) / STD[0];
        float32Data[i + TARGET_SIZE * TARGET_SIZE] = (g / 255.0 - MEAN[1]) / STD[1];
        float32Data[i + 2 * TARGET_SIZE * TARGET_SIZE] = (b / 255.0 - MEAN[2]) / STD[2];
    }

    return new ort.Tensor('float32', float32Data, [1, 3, TARGET_SIZE, TARGET_SIZE]);
}

// --- Model Loader ---
async function loadModel() {
    if (session) return session;
    if (!config) throw new Error("Worker not initialized with config");

    try {
        // Initialize ORT env with paths
        ort.env.wasm.wasmPaths = config.wasmPaths;
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.simd = true;

        session = await ort.InferenceSession.create(config.modelPath, {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
        });
        console.log('[Worker] Model loaded');
        return session;
    } catch (e) {
        console.error('[Worker] Model load failed', e);
        throw e;
    }
}

// --- Message Handler ---
async function processMessage(e: MessageEvent): Promise<void> {
    const { id, action, type, payload } = e.data;

    // Handle Initialization
    if (type === 'init') {
        try {
            config = payload;
            console.log('[Worker] Initialized with config:', config);
            // Pre-load model?
            await loadModel();
            self.postMessage({ type: 'init_complete' });
        } catch (err: any) {
            console.error('[Worker] Init failed:', err);
            // We can't reply with an ID here easily if it wasn't passed, but usually init is fire-and-forget or handled separately.
        }
        return;
    }

    if (action === 'inference') {
        const { bitmap, crops } = e.data;
        try {
            if (!config) throw new Error("Worker not initialized");

            await loadModel();
            if (!session) throw new Error("Session not initialized");

            const cropResults: CropResult[] = [];
            const BATCH_SIZE = 8;
            const REPORT_INTERVAL = 1; // Report progress every batch for smoothness

            for (let i = 0; i < crops.length; i += BATCH_SIZE) {
                const batchCrops = crops.slice(i, i + BATCH_SIZE);

                // Process batch
                const tensors = batchCrops.map((crop: CropRect) => extractCropToTensor(bitmap, crop));
                const batchInput = batchTensors(tensors);

                // Run inference using runtime-discovered input/output names
                const inputName = session.inputNames[0];
                const outputName = session.outputNames[0];
                const results = await session.run({ [inputName]: batchInput });
                const outputTensor = results[outputName];

                if (!outputTensor) throw new Error(`Missing output tensor: ${outputName}`);

                const outputData = outputTensor.data as Float32Array;
                const classCount = outputTensor.dims[1] ?? 1;

                if (classCount !== 1 && classCount !== 2) {
                    throw new Error(`Unsupported output class count: ${classCount}`);
                }

                // Parse model output as either binary logits/probability (1 output)
                // or two-class logits (2 outputs).
                for (let j = 0; j < batchCrops.length; j++) {
                    let aiProb = 0;
                    let realProb = 0;

                    if (classCount === 2) {
                        const cropLogits = Array.from(outputData.slice(j * 2, (j + 1) * 2));
                        const probs = softmax(cropLogits);
                        aiProb = probs[0];
                        realProb = probs[1];
                    } else {
                        const raw = outputData[j];
                        // If already in [0,1], treat as probability; otherwise treat as logit.
                        aiProb = raw >= 0 && raw <= 1 ? raw : 1 / (1 + Math.exp(-raw));
                        realProb = 1 - aiProb;
                    }

                    cropResults.push({
                        rect: batchCrops[j],
                        aiProb,
                        realProb
                    });
                }

                // Batch Progress Reporting
                const processed = Math.min(i + BATCH_SIZE, crops.length);
                // Only report if enough progress made or finished
                if (processed % REPORT_INTERVAL === 0 || processed === crops.length) {
                    self.postMessage({
                        id,
                        type: 'progress',
                        processed,
                        total: crops.length
                    });
                }

                // Yield to allow message posting
                await new Promise(r => setTimeout(r, 0));
            }

            // Aggregate Results
            // FIX: Use 2nd highest probability to filter out single-crop outliers (false positives)
            // If we have enough crops (>=4), discard the single highest score.
            const sortedCrops = [...cropResults].sort((a, b) => b.aiProb - a.aiProb);

            let finalAiProb = 0;
            if (sortedCrops.length >= 4) {
                // Take 2nd highest (robust against 1 outlier)
                finalAiProb = sortedCrops[1].aiProb;
            } else if (sortedCrops.length > 0) {
                // Fallback to max for small inputs
                finalAiProb = sortedCrops[0].aiProb;
            }

            const isAI = finalAiProb > 0.5;
            // Confidence = distance from 0.5, scaled to 0-100%
            const confidence = Math.round(isAI ? finalAiProb * 100 : (1 - finalAiProb) * 100);

            const result: InferenceResult = {
                isAI,
                confidence,
                aiProbability: finalAiProb,
                realProbability: 1 - finalAiProb,
                inferenceTime: 0,
                cropResults,
                totalCrops: crops.length
            };

            // Send Result
            self.postMessage({ id, type: 'result', data: result });

            // Close bitmap to free memory
            bitmap.close();

        } catch (error: any) {
            console.error('[Worker] Inference error:', error);
            self.postMessage({ id, type: 'error', error: error.message });
            if (bitmap) bitmap.close();
        }
    }
}

self.onmessage = (e: MessageEvent) => {
    inferenceQueue = inferenceQueue
        .then(() => processMessage(e))
        .catch((err) => {
            console.error('[Worker] Queue failure:', err);
        });
};
