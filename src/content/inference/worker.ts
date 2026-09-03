import * as ort from 'onnxruntime-web';
import { CropRect, InferenceResult, CropResult } from './types';
import {
    CalibratedContract,
    assertModelContract,
    logitsToAiProbabilities,
    DETECTOR_V2,
    DETECTOR_V2_CALIBRATION,
    ABSTENTION_BAND,
    toVerdict,
} from './contract';

console.log('[Worker] Worker script loaded and starting...');

// Configuration (received from main thread)
let config: {
    modelPaths: { detector: string };
    wasmPaths: string | Record<string, string>;
} | null = null;

// Preprocessing constants come from the model contract rather than from
// literals here. They were duplicated for most of this project's history, which
// is how a preprocessing change could silently stop matching the weights while
// every test still passed.
const MEAN = DETECTOR_V2.mean;
const STD = DETECTOR_V2.std;
const TARGET_SIZE = DETECTOR_V2.inputSize;

let sessionDetector: ort.InferenceSession | null = null;
let inferenceQueue: Promise<void> = Promise.resolve();


// --- Helper: Batch Tensors ---
function batchTensors(tensors: ort.Tensor[]): ort.Tensor {
    if (tensors.length === 0) throw new Error("No tensors to batch");
    const batchSize = tensors.length;
    const channels = 3;
    const height = TARGET_SIZE;
    const width = TARGET_SIZE;
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
    if (sessionDetector) return;
    if (!config) throw new Error("Worker not initialized with config");

    try {
        ort.env.wasm.wasmPaths = config.wasmPaths;
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.simd = true;

        const options: ort.InferenceSession.SessionOptions = {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
        };

        const session = await ort.InferenceSession.create(
            config.modelPaths.detector, options);

        // Assert the tensor contract before anything is allowed to run. The
        // v1 path guessed at the interface and rendered the guess as a
        // percentage for the project's entire history.
        assertModelContract(session, DETECTOR_V2);
        sessionDetector = session;

        console.log(
            '[Worker] detector_v2 loaded and contract verified. ' +
            `Held-out-generator AUROC ${DETECTOR_V2_CALIBRATION.heldoutGeneratorAuroc} ` +
            `(v1 shipped: ${DETECTOR_V2_CALIBRATION.v1ShippedAuroc}).`
        );
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
    contract: CalibratedContract
): Promise<number[]> {
    const results = await session.run({ [contract.inputName]: inputTensor });
    const outputTensor = results[contract.outputName];
    // Pass the contract's own temperature rather than relying on the parser's
    // default. The default happens to be this contract's value today, so an
    // omission here would be invisible until the day someone repoints at a
    // model calibrated differently, which is precisely when it would matter.
    return logitsToAiProbabilities(
        outputTensor.data as Float32Array, outputTensor.dims,
        contract.temperature);
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
        // Deep vs default scan is decided in pipeline.ts by which crops it sends.
        const { bitmap, crops } = e.data;
        const startTime = performance.now();

        try {
            if (!config) throw new Error("Worker not initialized");
            await loadModels();
            if (!sessionDetector) throw new Error("Session not initialized");

            // --- The verdict: whole image, one forward pass -----------------
            // The model was trained on whole images resized to 224, so that is
            // what it is scored on. The previous pipeline's quadrant averaging
            // and 25/75 global-local blend were tuned against a model that
            // turned out to carry no signal, so none of it is carried over.
            const wholeTensor = extractCropToTensor(bitmap, {
                x: 0, y: 0, width: bitmap.width, height: bitmap.height,
                label: 'Whole'
            });
            const [aiProbability] = await runInference(
                sessionDetector, wholeTensor, DETECTOR_V2);

            const verdict = toVerdict(aiProbability);
            console.log(`[Worker] P(AI)=${aiProbability.toFixed(4)} -> ${verdict}`);

            // --- Evidence: per-crop scores for the heatmap ------------------
            // These are shown as evidence, not as the verdict. Individual
            // 224x224 crops are out of distribution relative to training, so
            // they localise where the model reacts without being scored
            // themselves.
            const cropResults: CropResult[] = [];
            const localCrops = (crops || []).filter(
                (c: CropRect) => c.label !== 'Global');

            if (localCrops.length > 0) {
                const BATCH_SIZE = 8;
                for (let i = 0; i < localCrops.length; i += BATCH_SIZE) {
                    const batchCrops = localCrops.slice(i, i + BATCH_SIZE);

                    // A failure here costs a patch of the heatmap, not the
                    // verdict, so it must not take the verdict with it. The
                    // whole-image score above has already been computed and is
                    // the only number the user is given. Crops are explicitly
                    // out of distribution, and the parser now throws on a
                    // non-finite logit, so one bad tile would otherwise abort a
                    // scan that had already succeeded.
                    let probs: number[];
                    try {
                        const tensors = batchCrops.map(
                            (crop: CropRect) => extractCropToTensor(bitmap, crop));
                        probs = await runInference(
                            sessionDetector, batchTensors(tensors), DETECTOR_V2);
                    } catch (err) {
                        console.warn(
                            '[Worker] Evidence batch failed, verdict unaffected:',
                            err);
                        continue;
                    }

                    probs.forEach((pAi, idx) => {
                        cropResults.push({
                            rect: batchCrops[idx],
                            aiProb: pAi,
                            realProb: 1 - pAi,
                        });
                    });

                    self.postMessage({
                        id, type: 'progress',
                        processed: Math.min(i + BATCH_SIZE, localCrops.length),
                        total: localCrops.length
                    });
                    await new Promise(r => setTimeout(r, 0));
                }
            }

            const duration = performance.now() - startTime;

            const result: InferenceResult = {
                status: 'ok',
                modelCalibrated: DETECTOR_V2_CALIBRATION.calibrated,
                verdict,
                abstentionBand: {
                    low: ABSTENTION_BAND.low,
                    high: ABSTENTION_BAND.high,
                },
                isAI: verdict === 'likely_ai',
                confidence: Math.round(
                    (aiProbability > 0.5 ? aiProbability : 1 - aiProbability) * 100),
                aiProbability,
                realProbability: 1 - aiProbability,
                inferenceTime: duration,
                cropResults,
                totalCrops: cropResults.length,
                benchmarkReference: DETECTOR_V2_CALIBRATION.benchmark,
                measuredAuroc: DETECTOR_V2_CALIBRATION.heldoutGeneratorAuroc,
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
