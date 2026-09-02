import * as ort from 'onnxruntime-web';
import { CropRect, InferenceResult, CropResult } from './types';
import {
    MODEL_CONTRACTS,
    MODEL_CALIBRATION,
    ModelContract,
    assertModelContract,
    logitsToDistributions,
    toAiProbability,
} from './contract';

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

        // Assert the tensor contract before anything is allowed to run. A
        // mismatch here is a hard failure: the alternative is what shipped
        // previously, which was to guess and render the guess as a percentage.
        assertModelContract(global, MODEL_CONTRACTS.global);
        assertModelContract(local, MODEL_CONTRACTS.local);

        sessionGlobal = global;
        sessionLocal = local;
        console.log('[Worker] Both models loaded and contracts verified');
        if (!MODEL_CALIBRATION.calibrated) {
            console.warn(
                '[Worker] Models are UNCALIBRATED. Measured AUROC ' +
                `${MODEL_CALIBRATION.measuredAuroc} on ${MODEL_CALIBRATION.benchmark}. ` +
                'No verdict will be produced. ' + MODEL_CALIBRATION.note
            );
        }
    } catch (e) {
        console.error('[Worker] Model load failed', e);
        throw e;
    }
}

// --- Inference Helpers ---

/**
 * Run a batch and return the full per-image class probability distribution.
 *
 * Returns distributions rather than a single "AI probability" on purpose. The
 * previous version collapsed the output to one number inside this function and
 * had to decide which index meant AI in order to do so -- a decision it was not
 * equipped to make, made wrongly, and buried in a comment. Collapsing is now
 * the caller's problem, and the caller must consult the model contract.
 */
async function runInference(
    session: ort.InferenceSession,
    inputTensor: ort.Tensor,
    contract: ModelContract
): Promise<number[][]> {
    const results = await session.run({ [contract.inputName]: inputTensor });
    const outputTensor = results[contract.outputName];
    return logitsToDistributions(
        outputTensor.data as Float32Array, outputTensor.dims, contract);
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
            const globalDists = await runInference(
                sessionGlobal, globalBatchInput, MODEL_CONTRACTS.global);

            // Collapse each quadrant to an AI probability, if the contract
            // establishes one. It currently does not, so this is all nulls.
            const globalPerCrop = globalDists.map(
                d => toAiProbability(d, MODEL_CONTRACTS.global));
            const globalUsable = globalPerCrop.filter(
                (p): p is number => p !== null);

            const globalAiProb = globalUsable.length === globalPerCrop.length
                ? globalUsable.reduce((a, b) => a + b, 0) / globalUsable.length
                : null;

            console.log('[Worker] Global distributions:', globalDists,
                '-> AI prob:', globalAiProb === null ? 'N/A (no AI class established)'
                    : globalAiProb.toFixed(4));

            // --- Fast Exit Strategy (Normal Mode Only) ---
            let finalAiProb: number | null = globalAiProb;
            let resultLocalProb: number | undefined = undefined;
            let cropResults: CropResult[] = [];

            // If Deep Scan OR (Normal Scan AND Global is uncertain).
            // With no AI class established the global score is null, so the
            // gate cannot be evaluated and we always continue to the local
            // stage rather than short-circuiting on an unknown.
            const isUncertain = globalAiProb === null
                || (globalAiProb > 0.05 && globalAiProb < 0.95);

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

                        const batchDists = await runInference(
                            sessionLocal, batchInput, MODEL_CONTRACTS.local);

                        batchDists.forEach((dist, idx) => {
                            const p = toAiProbability(dist, MODEL_CONTRACTS.local);
                            if (p !== null) localScores.push(p);
                            cropResults.push({
                                rect: batchCrops[idx],
                                aiProb: p,
                                realProb: p === null ? null : 1 - p,
                                distribution: dist
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

                    // Weighted Fusion: 25% Global, 75% Local.
                    // Only meaningful when both stages produced a real number;
                    // with no AI class established both are null and so is the
                    // fusion. We do not substitute a default.
                    if (globalAiProb !== null && localScores.length > 0) {
                        finalAiProb = (0.25 * globalAiProb) + (0.75 * localAiProb);
                        resultLocalProb = localAiProb;
                    } else {
                        finalAiProb = null;
                    }

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


            const duration = performance.now() - startTime;

            // A verdict requires two things: a usable probability, and models
            // that have been measured to carry signal. Neither holds today, so
            // the result is reported as 'unavailable' and the UI shows the
            // forensic evidence instead of a fabricated percentage.
            const hasProbability = finalAiProb !== null;
            const canJudge = hasProbability && MODEL_CALIBRATION.calibrated;

            const result: InferenceResult = {
                status: canJudge ? 'ok' : 'model_unavailable',
                modelCalibrated: MODEL_CALIBRATION.calibrated,
                unavailableReason: canJudge ? undefined : (
                    !hasProbability
                        ? 'No AI class index is established for these checkpoints.'
                        : MODEL_CALIBRATION.note
                ),
                isAI: canJudge ? (finalAiProb as number) > 0.5 : null,
                confidence: canJudge
                    ? Math.round(
                        ((finalAiProb as number) > 0.5
                            ? (finalAiProb as number)
                            : 1 - (finalAiProb as number)) * 100)
                    : null,
                aiProbability: finalAiProb,
                realProbability: finalAiProb === null ? null : 1 - finalAiProb,
                inferenceTime: duration,
                cropResults,
                totalCrops: crops.length,
                globalProbability: globalAiProb,
                localProbability: resultLocalProb,
                benchmarkReference: MODEL_CALIBRATION.benchmark
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
