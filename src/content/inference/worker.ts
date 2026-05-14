import * as ort from 'onnxruntime-web';
import { CropRect, InferenceResult, CropResult } from './types';
import { ModelMeta, loadModelMeta, validateSession, extractAiProbability } from './modelMeta';
import { FusionConfig, loadFusionConfig, computeFusedScore, buildFusionFeatures } from './fusion';

console.log('[Worker] Worker script loaded and starting...');

// ─── Configuration ────────────────────────────────────────────────────────────

interface WorkerConfig {
    modelPaths: {
        global: string;
        local: string;
        globalMeta: string;
        localMeta: string;
        fusion: string;
    };
    wasmPaths: string | Record<string, string>;
}

let config: WorkerConfig | null = null;
let metaGlobal: ModelMeta | null = null;
let metaLocal: ModelMeta | null = null;
let fusionConfig: FusionConfig | null = null;

let sessionGlobal: ort.InferenceSession | null = null;
let sessionLocal: ort.InferenceSession | null = null;
let localModelLoading: Promise<ort.InferenceSession> | null = null;

let inferenceQueue: Promise<void> = Promise.resolve();

// Uncertainty gate: only run local scan when global is between these thresholds.
const GATE_LOW = 0.15;
const GATE_HIGH = 0.85;

// Deep-scan early-stop: if top-20-tile mean exceeds these, stop early.
const EARLY_STOP_HIGH = 0.90;
const EARLY_STOP_LOW = 0.10;
const EARLY_STOP_MIN_TILES = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function batchTensors(tensors: ort.Tensor[]): ort.Tensor {
    if (tensors.length === 0) throw new Error('No tensors to batch');
    const batchSize = tensors.length;
    const channels = 3;
    const height = 224;
    const width = 224;
    const singleSize = channels * height * width;
    const batchedData = new Float32Array(batchSize * singleSize);
    tensors.forEach((t, i) => batchedData.set(t.data as Float32Array, i * singleSize));
    return new ort.Tensor('float32', batchedData, [batchSize, channels, height, width]);
}

function extractCropToTensor(
    bitmap: ImageBitmap,
    crop: CropRect,
    meta: ModelMeta
): ort.Tensor {
    const size = meta.input_size;
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get OffscreenCanvas 2d context');

    ctx.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    const float32 = new Float32Array(3 * size * size);
    const [mr, mg, mb] = meta.normalization.mean;
    const [sr, sg, sb] = meta.normalization.std;

    for (let i = 0; i < size * size; i++) {
        float32[i]              = (data[i * 4]     / 255.0 - mr) / sr;
        float32[i + size * size]    = (data[i * 4 + 1] / 255.0 - mg) / sg;
        float32[i + 2 * size * size] = (data[i * 4 + 2] / 255.0 - mb) / sb;
    }

    return new ort.Tensor('float32', float32, [1, 3, size, size]);
}

// ─── Model Loading ────────────────────────────────────────────────────────────

async function loadGlobalModel(): Promise<void> {
    if (sessionGlobal) return;
    if (!config) throw new Error('Worker not initialized with config');

    ort.env.wasm.wasmPaths = config.wasmPaths;
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.simd = true;

    const options: ort.InferenceSession.SessionOptions = {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
        enableCpuMemArena: true,
    };

    sessionGlobal = await ort.InferenceSession.create(config.modelPaths.global, options);
    validateSession(sessionGlobal, metaGlobal!, 'GlobalModel');
    console.log('[Worker] Global model loaded');
}

async function loadLocalModel(): Promise<ort.InferenceSession> {
    if (sessionLocal) return sessionLocal;

    if (!config) throw new Error('Worker not initialized with config');
    if (!localModelLoading) {
        const options: ort.InferenceSession.SessionOptions = {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
        };
        localModelLoading = ort.InferenceSession.create(config.modelPaths.local, options).then(s => {
            validateSession(s, metaLocal!, 'LocalModel');
            sessionLocal = s;
            console.log('[Worker] Local model loaded (lazy)');
            return s;
        });
    }
    return localModelLoading;
}

// ─── Inference ────────────────────────────────────────────────────────────────

async function runBatchInference(
    session: ort.InferenceSession,
    meta: ModelMeta,
    inputTensor: ort.Tensor
): Promise<number[]> {
    const feeds = { [meta.input_name]: inputTensor };
    const results = await session.run(feeds);
    const outputTensor = results[meta.output_name];
    const outputData = outputTensor.data as Float32Array;
    const batchSize = outputTensor.dims[0] as number;

    const probs: number[] = [];
    for (let i = 0; i < batchSize; i++) {
        probs.push(extractAiProbability(outputData, i, meta));
    }
    return probs;
}

// ─── Message Handler ──────────────────────────────────────────────────────────

async function processMessage(e: MessageEvent): Promise<void> {
    const { id, action, type, payload } = e.data;

    if (type === 'init') {
        try {
            config = payload as WorkerConfig;
            console.log('[Worker] Initializing with config...');

            // Load metadata first (fast, JSON fetch)
            [metaGlobal, metaLocal, fusionConfig] = await Promise.all([
                loadModelMeta(config.modelPaths.globalMeta),
                loadModelMeta(config.modelPaths.localMeta),
                loadFusionConfig(config.modelPaths.fusion),
            ]);

            // Only load the global model eagerly; local is lazy
            await loadGlobalModel();
            self.postMessage({ type: 'init_complete' });
        } catch (err: any) {
            console.error('[Worker] Init failed:', err);
            self.postMessage({ type: 'init_error', error: err.message });
        }
        return;
    }

    if (action === 'inference') {
        const { bitmap, crops, mode } = e.data as {
            bitmap: ImageBitmap;
            crops: CropRect[];
            mode: 'default' | 'deep';
        };
        const startTime = performance.now();

        try {
            if (!config || !metaGlobal || !metaLocal || !fusionConfig) {
                throw new Error('Worker not fully initialized');
            }
            if (!sessionGlobal) await loadGlobalModel();

            // ── Stage 1: Global Scan (4-quadrant batch) ──────────────────────
            const halfW = Math.floor(bitmap.width / 2);
            const halfH = Math.floor(bitmap.height / 2);
            const globalCrops: CropRect[] = [
                { x: 0,     y: 0,     width: halfW, height: halfH, label: 'Global_TL' },
                { x: halfW, y: 0,     width: halfW, height: halfH, label: 'Global_TR' },
                { x: 0,     y: halfH, width: halfW, height: halfH, label: 'Global_BL' },
                { x: halfW, y: halfH, width: halfW, height: halfH, label: 'Global_BR' },
            ];

            const globalTensors = globalCrops.map(c => extractCropToTensor(bitmap, c, metaGlobal!));
            const globalBatch = batchTensors(globalTensors);
            const globalBatchProbs = await runBatchInference(sessionGlobal!, metaGlobal, globalBatch);
            const globalAiProb = globalBatchProbs.reduce((a, b) => a + b, 0) / globalBatchProbs.length;

            console.log(`[Worker] Global AI prob: ${globalAiProb.toFixed(4)}`);

            // ── Stage 2: Local Scan (if uncertain or deep mode) ───────────────
            let finalAiProb = globalAiProb;
            let localAiProb: number | undefined;
            let cropResults: CropResult[] = [];

            const isUncertain = globalAiProb > GATE_LOW && globalAiProb < GATE_HIGH;

            if (mode === 'deep' || isUncertain) {
                const localSession = await loadLocalModel();
                const localCrops = crops.filter(c => c.label !== 'Global');

                if (localCrops.length > 0) {
                    const BATCH_SIZE = 8;
                    const localScores: number[] = [];

                    for (let i = 0; i < localCrops.length; i += BATCH_SIZE) {
                        const batchCrops = localCrops.slice(i, i + BATCH_SIZE);
                        const tensors = batchCrops.map(c => extractCropToTensor(bitmap, c, metaLocal!));
                        const batchInput = batchTensors(tensors);
                        const batchProbs = await runBatchInference(localSession, metaLocal, batchInput);

                        batchProbs.forEach((p, idx) => {
                            localScores.push(p);
                            cropResults.push({ rect: batchCrops[idx], aiProb: p, realProb: 1 - p });
                        });

                        const processed = Math.min(i + BATCH_SIZE, localCrops.length);
                        self.postMessage({ id, type: 'progress', processed, total: localCrops.length });

                        // Early stop for deep scan when confidence is already saturated
                        if (mode === 'deep' && localScores.length >= EARLY_STOP_MIN_TILES) {
                            const sorted = [...localScores].sort((a, b) => b - a);
                            const top20Mean = sorted.slice(0, 20).reduce((a, b) => a + b, 0) / 20;
                            if (top20Mean > EARLY_STOP_HIGH || top20Mean < EARLY_STOP_LOW) {
                                console.log(`[Worker] Early stop at tile ${processed}: top-20 mean=${top20Mean.toFixed(4)}`);
                                break;
                            }
                        }

                        await new Promise(r => setTimeout(r, 0));
                    }

                    // ── Stage 3: Fusion ───────────────────────────────────────
                    const features = buildFusionFeatures(globalAiProb, localScores, GATE_HIGH);
                    finalAiProb = computeFusedScore(features, fusionConfig!);
                    localAiProb = features.localTop3Mean;
                }
            } else {
                console.log('[Worker] Fast exit: global confidence outside uncertain zone');
            }

            const isAI = finalAiProb > fusionConfig.threshold;
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
                localProbability: localAiProb,
                calibratedScore: finalAiProb,
                uncertaintyState: (globalAiProb > GATE_LOW && globalAiProb < GATE_HIGH)
                    ? 'uncertain'
                    : 'confident',
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
        .catch(err => console.error('[Worker] Queue failure:', err));
};
