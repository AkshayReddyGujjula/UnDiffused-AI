/**
 * UnDiffused Offscreen Worker
 * ===========================
 * Handles image analysis using ONNX Runtime Web.
 * 
 * Pipeline: Fetch Image → Canvas → Laplacian → Gradient Magnitude → ONNX Inference
 */

import * as ort from 'onnxruntime-web';

// Constants (must match Python training script)
const IMAGE_SIZE = 128;

// Laplacian kernel (3x3)
const LAPLACIAN_KERNEL = [
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0]
];

// Sobel kernels for gradient
const SOBEL_X = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
];

const SOBEL_Y = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
];

let session: ort.InferenceSession | null = null;

/**
 * Initialize ONNX inference session
 */
async function initSession(): Promise<ort.InferenceSession> {
    if (session) return session;

    const modelUrl = chrome.runtime.getURL('model.onnx');
    session = await ort.InferenceSession.create(modelUrl, {
        executionProviders: ['wasm'],
    });

    console.log('[UnDiffused] ONNX session initialized');
    return session;
}

/**
 * Fetch image as ImageBitmap using extension permissions (CORS bypass)
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
 * Convert RGB to grayscale using luminosity method
 */
function rgbToGrayscale(r: number, g: number, b: number): number {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Apply 3x3 convolution kernel to grayscale image
 */
function convolve(
    data: Float32Array,
    width: number,
    height: number,
    kernel: number[][]
): Float32Array {
    const output = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let sum = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = (y + ky) * width + (x + kx);
                    sum += data[idx] * kernel[ky + 1][kx + 1];
                }
            }

            output[y * width + x] = sum;
        }
    }

    return output;
}

/**
 * Calculate gradient magnitude from Sobel gradients
 */
function calculateGradientMagnitude(
    data: Float32Array,
    width: number,
    height: number
): Float32Array {
    const gx = convolve(data, width, height, SOBEL_X);
    const gy = convolve(data, width, height, SOBEL_Y);

    const magnitude = new Float32Array(width * height);

    for (let i = 0; i < magnitude.length; i++) {
        magnitude[i] = Math.sqrt(gx[i] * gx[i] + gy[i] * gy[i]);
    }

    return magnitude;
}

/**
 * Normalize array to 0-255 range
 */
function normalize(data: Float32Array): Float32Array {
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < data.length; i++) {
        if (data[i] < min) min = data[i];
        if (data[i] > max) max = data[i];
    }

    const range = max - min || 1;
    const normalized = new Float32Array(data.length);

    for (let i = 0; i < data.length; i++) {
        normalized[i] = ((data[i] - min) / range) * 255;
    }

    return normalized;
}

/**
 * Process image through the feature extraction pipeline
 */
async function extractFeatures(imageUrl: string): Promise<Float32Array> {
    // Fetch and decode image
    const bitmap = await fetchImage(imageUrl);

    // Create offscreen canvas
    const canvas = new OffscreenCanvas(IMAGE_SIZE, IMAGE_SIZE);
    const ctx = canvas.getContext('2d')!;

    // Draw and resize image
    ctx.drawImage(bitmap, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
    const pixels = imageData.data;

    // Convert to grayscale
    const grayscale = new Float32Array(IMAGE_SIZE * IMAGE_SIZE);
    for (let i = 0; i < grayscale.length; i++) {
        const idx = i * 4;
        grayscale[i] = rgbToGrayscale(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
    }

    // Apply Laplacian filter
    const laplacian = convolve(grayscale, IMAGE_SIZE, IMAGE_SIZE, LAPLACIAN_KERNEL);

    // Calculate gradient magnitude
    const gradient = calculateGradientMagnitude(laplacian, IMAGE_SIZE, IMAGE_SIZE);

    // Normalize to 0-255
    const normalized = normalize(gradient);

    return normalized;
}

/**
 * Run inference on extracted features
 */
async function runInference(features: Float32Array): Promise<{ isAI: boolean; confidence: number }> {
    const inferenceSession = await initSession();

    // Create input tensor
    const inputTensor = new ort.Tensor('float32', features, [1, features.length]);

    // Run inference
    const feeds = { input: inputTensor };
    const results = await inferenceSession.run(feeds);

    // Parse results
    // The model outputs: 'output_label' (class) and 'output_probability' (probabilities)
    const labelOutput = results['output_label'];
    const probOutput = results['output_probability'];

    if (labelOutput && probOutput) {
        const label = (labelOutput.data as BigInt64Array)[0];
        const probs = probOutput.data as Float32Array;

        // Label 1 = AI-generated, Label 0 = Real
        const isAI = Number(label) === 1;
        const confidence = isAI ? probs[1] : probs[0];

        return { isAI, confidence: Math.round(confidence * 100) };
    }

    throw new Error('Unexpected model output format');
}

/**
 * Main analysis function
 */
async function analyzeImage(url: string): Promise<{ isAI: boolean; confidence: number }> {
    console.log('[UnDiffused] Analyzing:', url);

    const features = await extractFeatures(url);
    const result = await runInference(features);

    console.log('[UnDiffused] Result:', result);
    return result;
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

        // Return true to indicate async response
        return true;
    }
});

console.log('[UnDiffused] Offscreen worker ready');
