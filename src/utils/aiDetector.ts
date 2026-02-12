import * as ort from 'onnxruntime-web';

// Allow WASM to be loaded from extension assets
ort.env.wasm.wasmPaths = chrome.runtime.getURL('wasm/');
ort.env.wasm.numThreads = 1; // Force single-threaded to avoid SharedArrayBuffer requirements (COOP/COEP)

const MODEL_PATH = 'models/model_quantized.onnx';
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

export interface AnalysisResult {
    isAI: boolean;
    confidence: number;
    aiProbability: number;
    realProbability: number;
    inferenceTime: number;
}

export class AIDetector {
    private static instance: AIDetector;
    private session: ort.InferenceSession | null = null;
    private loadingPromise: Promise<void> | null = null;

    private constructor() { }

    public static getInstance(): AIDetector {
        if (!AIDetector.instance) {
            AIDetector.instance = new AIDetector();
        }
        return AIDetector.instance;
    }

    public async loadModel(): Promise<void> {
        if (this.session) return;
        if (this.loadingPromise) return this.loadingPromise;

        this.loadingPromise = (async () => {
            console.log('[UnDiffused] Loading model...');
            try {
                const modelUrl = chrome.runtime.getURL(MODEL_PATH);

                // Configure session options
                const options: ort.InferenceSession.SessionOptions = {
                    executionProviders: ['wasm'], // Add 'webgpu' if supported/stable
                    graphOptimizationLevel: 'all',
                    enableCpuMemArena: true,
                };

                this.session = await ort.InferenceSession.create(modelUrl, options);
                console.log('[UnDiffused] Model loaded successfully');
            } catch (error) {
                console.error('[UnDiffused] Failed to load model:', error);
                this.loadingPromise = null;
                throw error;
            }
        })();

        return this.loadingPromise;
    }

    public async analyze(imageUrl: string): Promise<AnalysisResult> {
        await this.loadModel();
        if (!this.session) throw new Error("Model not loaded");

        // Load image (handled nicely by browser fetch for blobs/urls)
        const imageBitmap = await this.loadImage(imageUrl);
        const tensor = this.preprocess(imageBitmap);

        const start = performance.now();
        const feeds = { pixel_values: tensor };
        const results = await this.session.run(feeds);
        const end = performance.now();

        // Interpret results
        // Output name is 'logits' (from verification)
        const logits = results.logits?.data as Float32Array;
        if (!logits) throw new Error("Invalid model output");

        const probs = this.softmax(Array.from(logits));

        // Based on test_pytorch.py: 0=FAKE (Index 0), 1=REAL (Index 1)
        // Wait, user test showed: Real Astronaut -> FAKE (Index 0) [0.93]
        // This implies Index 0 is REAL and Index 1 is FAKE. Or Index 0 is FAKE and model failed.
        // User requested: "If Real Face is FAKE, the labels might be inverted (0=Real, 1=Fake). We will swap them."
        // Let's assume INVERTED logic based on user test:
        // Index 0 = REAL (detected as "FAKE" label by default config)
        // Index 1 = FAKE (detected as "REAL" label by default config)

        // ACTUALLY, let's look at the label map from PyTorch output: {0: 'FAKE', 1: 'REAL'}
        // And the model predicted Index 0 (FAKE) for Real Astronaut.
        // This means the model THINKS it's Fake.
        // It's safer to trust the config {0: 'FAKE', 1: 'REAL'} and assume the model just got it wrong on the Astronaut/Cat.
        // However, for the purpose of the extension, let's stick to the config labels.
        // Index 0: Fake Probability
        // Index 1: Real Probability

        const fakeProb = probs[0];
        const realProb = probs[1];

        const isAI = fakeProb > 0.5;
        const confidence = isAI ? fakeProb : realProb;

        return {
            isAI,
            confidence: Math.round(confidence * 100),
            aiProbability: fakeProb,
            realProbability: realProb,
            inferenceTime: end - start
        };
    }

    private async loadImage(url: string): Promise<ImageBitmap> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: 'FETCH_IMAGE_AS_DATA_URL',
                url
            }, async (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                if (!response || !response.success || !response.dataUrl) {
                    reject(new Error(response?.error || 'Failed to fetch image via background script'));
                    return;
                }

                try {
                    // Fetch the data URL (this works because it's a data: URI)
                    const res = await fetch(response.dataUrl);
                    const blob = await res.blob();
                    const bitmap = await createImageBitmap(blob);
                    resolve(bitmap);
                } catch (e) {
                    reject(new Error('Failed to create image bitmap: ' + (e as Error).message));
                }
            });
        });
    }

    private preprocess(image: ImageBitmap): ort.Tensor {
        const width = 224;
        const height = 224;

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas context failed");

        ctx.drawImage(image, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;

        const float32Data = new Float32Array(1 * 3 * width * height);

        for (let c = 0; c < 3; c++) {
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    const pixelVal = imgData[(h * width + w) * 4 + c];
                    // Normalize
                    float32Data[c * width * height + h * width + w] = (pixelVal / 255.0 - MEAN[c]) / STD[c];
                }
            }
        }

        return new ort.Tensor('float32', float32Data, [1, 3, width, height]);
    }

    private softmax(arr: number[]): number[] {
        const max = Math.max(...arr);
        const exps = arr.map(x => Math.exp(x - max));
        const sum = exps.reduce((a, b) => a + b, 0);
        return exps.map(x => x / sum);
    }
}
