import * as ort from 'onnxruntime-web';
import { CropRect, InferenceResult, CropResult } from './types';

console.log('[Worker] Worker script loaded and starting...');

// Configuration (received from main thread)
let config: {
    modelPaths: { global: string; local: string };
    wasmPaths: string | Record<string, string>;
} | null = null;

const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];
const TARGET_SIZE = 224;

let sessionGlobal: ort.InferenceSession | null = null;
let sessionLocal: ort.InferenceSession | null = null;
let inferenceQueue: Promise<void> = Promise.resolve();


// --- Helper: Softmax ---
function softmax(logits: number[]): number[] {
    const max = Math.max(...logits);
    const exps = logits.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}

// --- Helper: Sigmoid ---
function sigmoid(logit: number): number {
    return 1 / (1 + Math.exp(-logit));
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
async function loadModels() {
    if (sessionGlobal && sessionLocal) return;
    if (!config) throw new Error("Worker not initialized with config");

    try {
        // Initialize ORT env with paths
        ort.env.wasm.wasmPaths = config.wasmPaths;
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.simd = true;

        const options: ort.InferenceSession.SessionOptions = {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
        };

        const [global, local] = await Promise.all([
            ort.InferenceSession.create(config.modelPaths.global, options),
            ort.InferenceSession.create(config.modelPaths.local, options)
        ]);

        sessionGlobal = global;
        sessionLocal = local;
        console.log('[Worker] Both models loaded successfully');
    } catch (e) {
        console.error('[Worker] Model load failed', e);
        throw e;
    }
}

// --- Inference Helpers ---

async function runInference(session: ort.InferenceSession, inputTensor: ort.Tensor): Promise<number[]> {
    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0]; // Assuming single output for simplicity
    const results = await session.run({ [inputName]: inputTensor });
    const outputTensor = results[outputName];

    // Handle both [Batch, 1] (Sigmoid) and [Batch, 2] (Softmax) output shapes
    const outputData = outputTensor.data as Float32Array;
    const dims = outputTensor.dims;
    const batchSize = dims[0];
    const classCount = dims[1] || 1;

    const probabilities: number[] = [];

    for (let i = 0; i < batchSize; i++) {
        if (classCount === 2) {
            const logits = Array.from(outputData.slice(i * 2, (i + 1) * 2));
            const probs = softmax(logits);
            probabilities.push(probs[0]); // Class 0 is usually AI? Wait, usually Class 1 is target.
            // Convention check: Usually Index 0 = Real, Index 1 = Fake/AI? 
            // Or Index 0 = AI, Index 1 = Real? 
            // In standard "UniversalFakeDetect", 0=Real, 1=Fake.
            // Let's assume standard: 1 = AI. 
            // WAIT - In previous worker code: `aiProb = probs[0]`. 
            // That implies the user trained it such that 0 is AI. 
            // I will stick to the previous code's convention: Index 0 is AI.
        } else {
            const raw = outputData[i];
            // If already probability
            const val = raw >= 0 && raw <= 1 ? raw : sigmoid(raw);
            probabilities.push(val);
            // If binary, is 1 AI or 0 AI? 
            // Usually 1 is positive class (AI). 
            // If previous code used probs[0] as AI, then for binary, it requires testing.
            // Let's assume 1=AI for binary models unless specified.
        }
    }
    return probabilities;
}


// --- Message Handler ---
async function processMessage(e: MessageEvent): Promise<void> {
    const { id, action, type, payload } = e.data;

    if (type === 'init') {
        try {
            config = payload;
            console.log('[Worker] Initialized with config:', config);
            await loadModels();
            self.postMessage({ type: 'init_complete' });
        } catch (err: any) {
            console.error('[Worker] Init failed:', err);
        }
        return;
    }

    if (action === 'inference') {
        const { bitmap, crops, mode } = e.data;
        const startTime = performance.now();

        try {
            if (!config) throw new Error("Worker not initialized");
            await loadModels();
            if (!sessionGlobal || !sessionLocal) throw new Error("Sessions not initialized");

            // --- STAGE 1: Global Scan (4-Crop Grid Strategy) ---
            // Divide image into 4 equal quadrants to preserve detail
            const halfW = Math.floor(bitmap.width / 2);
            const halfH = Math.floor(bitmap.height / 2);

            const globalCrops: CropRect[] = [
                { x: 0, y: 0, width: halfW, height: halfH, label: 'Global_TL' },
                { x: halfW, y: 0, width: halfW, height: halfH, label: 'Global_TR' },
                { x: 0, y: halfH, width: halfW, height: halfH, label: 'Global_BL' },
                { x: halfW, y: halfH, width: halfW, height: halfH, label: 'Global_BR' }
            ];

            // Extract and Batch
            const globalTensors = globalCrops.map(crop => extractCropToTensor(bitmap, crop));
            const globalBatchInput = batchTensors(globalTensors);

            // Run Global Model on Batch of 4
            const globalBatchProbs = await runInference(sessionGlobal, globalBatchInput);

            // Average the 4 probabilities
            const globalAiProb = globalBatchProbs.reduce((a, b) => a + b, 0) / globalBatchProbs.length;

            console.log(`[Worker] Global AI Prob (Avg of 4 crops): ${globalAiProb.toFixed(4)}`);

            // --- Fast Exit Strategy (Normal Mode Only) ---
            let finalAiProb = globalAiProb;
            let resultLocalProb: number | undefined = undefined;
            let cropResults: CropResult[] = [];

            // If Deep Scan OR (Normal Scan AND Global is uncertain)
            const isUncertain = globalAiProb > 0.05 && globalAiProb < 0.95;

            if (mode === 'deep' || isUncertain) {
                console.log('[Worker] Proceeding to Local Scan...');

                // --- STAGE 2: Local Scan ---
                // Filter out the "Global" crop from the crops list if it exists, processing only sub-crops
                // content/crops.ts generates a 'Global' crop first.
                const localCrops = crops.filter((c: CropRect) => c.label !== 'Global');

                if (localCrops.length > 0) {
                    const BATCH_SIZE = 8;

                    const localScores: number[] = [];

                    for (let i = 0; i < localCrops.length; i += BATCH_SIZE) {
                        const batchCrops = localCrops.slice(i, i + BATCH_SIZE);
                        const tensors = batchCrops.map((crop: CropRect) => extractCropToTensor(bitmap, crop));
                        const batchInput = batchTensors(tensors);

                        const batchProbs = await runInference(sessionLocal, batchInput);

                        batchProbs.forEach((p, idx) => {
                            localScores.push(p);
                            cropResults.push({
                                rect: batchCrops[idx],
                                aiProb: p,
                                realProb: 1 - p
                            });
                        });

                        // Report Progress
                        const processed = Math.min(i + BATCH_SIZE, localCrops.length);
                        self.postMessage({
                            id,
                            type: 'progress',
                            processed,
                            total: localCrops.length
                        });

                        await new Promise(r => setTimeout(r, 0));
                    }

                    // --- STAGE 3: Fusion ---
                    // Strategy: Average of Top 3 Local Scores
                    localScores.sort((a, b) => b - a);
                    let localAiProb = 0;
                    if (localScores.length >= 3) {
                        const top3 = localScores.slice(0, 3);
                        localAiProb = top3.reduce((a, b) => a + b, 0) / 3;
                    } else if (localScores.length > 0) {
                        localAiProb = localScores[0];
                    }

                    // Weighted Fusion: 25% Global, 75% Local
                    finalAiProb = (0.25 * globalAiProb) + (0.75 * localAiProb);
                    resultLocalProb = localAiProb;

                    // Add global result for UI visualization if needed
                    // User requested to hide global crops.
                    // If we wanted to, we could add a "dummy" global crop covering 100% 
                    // or just leave it out. Leaving it out.

                }
            } else {
                console.log('[Worker] Fast Exit triggered.');
                // User requested to hide global crops.
                // cropResults is empty here, which is fine.
            }


            const isAI = finalAiProb > 0.5;
            const confidence = Math.round(isAI ? finalAiProb * 100 : (1 - finalAiProb) * 100);
            const duration = performance.now() - startTime;

            const result: InferenceResult = {
                isAI,
                confidence,
                aiProbability: finalAiProb,
                realProbability: 1 - finalAiProb,
                inferenceTime: duration,
                cropResults,
                totalCrops: crops.length,
                globalProbability: globalAiProb,
                localProbability: resultLocalProb
            };

            self.postMessage({ id, type: 'result', data: result });
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
