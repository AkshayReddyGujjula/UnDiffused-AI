/**
 * UnDiffused Offscreen Worker
 * ===========================
 * Handles image analysis using ONNX Runtime Web.
 * 
 * Pipeline: Fetch Image → Canvas (224x224) → RGB Normalization → ONNX Inference
 */

import * as ort from 'onnxruntime-web';

// Constants (must match Python training script)
const IMAGE_SIZE = 224;
const HEATMAP_SIZE = 32; // Output heatmap resolution

// ImageNet Normalization Constants
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

let session: ort.InferenceSession | null = null;

/**
 * Initialize ONNX inference session
 */
async function initSession(): Promise<ort.InferenceSession> {
    if (session) return session;

    const modelUrl = chrome.runtime.getURL('models/model_quantized.onnx');
    session = await ort.InferenceSession.create(modelUrl, {
        executionProviders: ['wasm'],
    });

    console.log('[UnDiffused] ONNX session initialized');
    return session;
}

/**
 * Fetch image as ImageBitmap
 */
async function fetchImage(url: string): Promise<ImageBitmap> {
    const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    return createImageBitmap(blob);
}

/**
 * Generate 32x32 heatmap from RGB variance
 */
function generateHeatmapData(pixels: Uint8ClampedArray): number[] {
    const heatmap: number[] = [];
    const blockSize = IMAGE_SIZE / HEATMAP_SIZE; // 7x7 blocks for 224/32

    for (let by = 0; by < HEATMAP_SIZE; by++) {
        for (let bx = 0; bx < HEATMAP_SIZE; bx++) {
            let sumSq = 0;
            let sum = 0;
            let count = 0;

            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    const x = bx * blockSize + dx;
                    const y = by * blockSize + dy;
                    const idx = (y * IMAGE_SIZE + x) * 4;

                    // Use luminance for variance calculation
                    const r = pixels[idx];
                    const g = pixels[idx + 1];
                    const b = pixels[idx + 2];
                    const val = 0.299 * r + 0.587 * g + 0.114 * b;

                    sum += val;
                    sumSq += val * val;
                    count++;
                }
            }

            const mean = sum / count;
            const variance = sumSq / count - mean * mean;
            heatmap.push(variance);
        }
    }

    const max = Math.max(...heatmap, 1);
    return heatmap.map(v => v / max);
}

/**
 * Process image to normalized RGB Float32Array
 * Shape: [3, 224, 224] (CHW format for ONNX)
 */
async function extractFeatures(imageUrl: string): Promise<{ inputData: Float32Array; rawPixels: Uint8ClampedArray }> {
    const bitmap = await fetchImage(imageUrl);

    const canvas = new OffscreenCanvas(IMAGE_SIZE, IMAGE_SIZE);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

    const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
    const pixels = imageData.data;

    const inputData = new Float32Array(3 * IMAGE_SIZE * IMAGE_SIZE);

    // Convert HWC (Interleaved) to CHW (Planar) and Normalize
    for (let i = 0; i < IMAGE_SIZE * IMAGE_SIZE; i++) {
        const r = pixels[i * 4] / 255.0;
        const g = pixels[i * 4 + 1] / 255.0;
        const b = pixels[i * 4 + 2] / 255.0;

        // Planar format: [R, R, ..., G, G, ..., B, B, ...]
        inputData[i] = (r - MEAN[0]) / STD[0]; // R
        inputData[i + IMAGE_SIZE * IMAGE_SIZE] = (g - MEAN[1]) / STD[1]; // G
        inputData[i + 2 * IMAGE_SIZE * IMAGE_SIZE] = (b - MEAN[2]) / STD[2]; // B
    }

    return { inputData, rawPixels: pixels };
}

/**
 * Run inference
 */
async function runInference(inputData: Float32Array): Promise<{ isAI: boolean; confidence: number }> {
    const inferenceSession = await initSession();

    const inputName = inferenceSession.inputNames[0];
    const inputTensor = new ort.Tensor('float32', inputData, [1, 3, IMAGE_SIZE, IMAGE_SIZE]);

    const feeds: Record<string, ort.Tensor> = {};
    feeds[inputName] = inputTensor;

    const results = await inferenceSession.run(feeds);
    const outputName = inferenceSession.outputNames[0];
    const probability = results[outputName].data[0] as number;

    const isAI = probability > 0.5;
    const confidence = Math.round((isAI ? probability : 1 - probability) * 100);

    return { isAI, confidence };
}

/**
 * Main analysis function
 */
async function analyzeImage(url: string): Promise<{ isAI: boolean; confidence: number; heatmapData: number[]; filterData: number[] }> {
    console.log('[UnDiffused] Analyzing RGB:', url);

    const { inputData, rawPixels } = await extractFeatures(url);
    const result = await runInference(inputData);
    const heatmapData = generateHeatmapData(rawPixels);

    // filterData is used for visualization in the UI (currently showing gradient)
    // We can send a grayscale version for now, or just some representative visualization
    const grayData = new Float32Array(IMAGE_SIZE * IMAGE_SIZE);
    for (let i = 0; i < IMAGE_SIZE * IMAGE_SIZE; i++) {
        grayData[i] = (rawPixels[i * 4] * 0.299 + rawPixels[i * 4 + 1] * 0.587 + rawPixels[i * 4 + 2] * 0.114);
    }

    return { ...result, heatmapData, filterData: Array.from(grayData) };
}

// Message listener
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'ANALYZE') {
        analyzeImage(message.url)
            .then(result => {
                sendResponse({ success: true, ...result });
            })
            .catch(error => {
                console.error('[UnDiffused] Analysis error:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

console.log('[UnDiffused] Offscreen worker ready (RGB Mode)');
