import * as ort from 'onnxruntime-web';

// Initialize WASM paths immediately
ort.env.wasm.wasmPaths = chrome.runtime.getURL('wasm/');
ort.env.wasm.numThreads = 1; // Strict single-threading for content script stability
ort.env.wasm.simd = true;

const MODEL_PATH = 'models/model_quantized.onnx';

export class SwinSession {
    private static instance: SwinSession;
    private session: ort.InferenceSession | null = null;
    private loadingPromise: Promise<ort.InferenceSession> | null = null;

    private constructor() { }

    public static getInstance(): SwinSession {
        if (!SwinSession.instance) {
            SwinSession.instance = new SwinSession();
        }
        return SwinSession.instance;
    }

    public async getSession(): Promise<ort.InferenceSession> {
        if (this.session) return this.session;
        if (this.loadingPromise) return this.loadingPromise;

        this.loadingPromise = (async () => {
            console.log('[UnDiffused] Loading ONNX model...');
            try {
                const modelUrl = chrome.runtime.getURL(MODEL_PATH);
                const options: ort.InferenceSession.SessionOptions = {
                    executionProviders: ['wasm'],
                    graphOptimizationLevel: 'all',
                    enableCpuMemArena: true,
                };

                const session = await ort.InferenceSession.create(modelUrl, options);
                console.log('[UnDiffused] Model loaded.', session.inputNames, session.outputNames);
                this.session = session;
                return session;
            } catch (error) {
                console.error('[UnDiffused] Model load failed:', error);
                this.loadingPromise = null;
                throw error;
            }
        })();

        return this.loadingPromise;
    }
}
