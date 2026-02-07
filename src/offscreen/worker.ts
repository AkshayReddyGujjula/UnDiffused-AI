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
const HEATMAP_SIZE = 32; // Output heatmap resolution

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

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    // Clamp coordinates to handle borders (BORDER_REPLICATE)
                    const py = Math.min(Math.max(y + ky, 0), height - 1);
                    const px = Math.min(Math.max(x + kx, 0), width - 1);
                    const idx = py * width + px;

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
 * Generate 32x32 heatmap from gradient data showing high-variance regions
 */
function generateHeatmapData(gradient: Float32Array): number[] {
    const heatmap: number[] = [];
    const blockSize = IMAGE_SIZE / HEATMAP_SIZE; // 4x4 blocks

    // Calculate local variance for each block
    for (let by = 0; by < HEATMAP_SIZE; by++) {
        for (let bx = 0; bx < HEATMAP_SIZE; bx++) {
            let sum = 0;
            let sumSq = 0;
            let count = 0;

            // Sample pixels in this block
            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    const x = bx * blockSize + dx;
                    const y = by * blockSize + dy;
                    const idx = y * IMAGE_SIZE + x;
                    const val = gradient[idx];
                    sum += val;
                    sumSq += val * val;
                    count++;
                }
            }

            // Variance = E[X²] - E[X]²
            const mean = sum / count;
            const variance = sumSq / count - mean * mean;
            heatmap.push(variance);
        }
    }

    // Normalize to 0-1 range
    const max = Math.max(...heatmap, 1);
    return heatmap.map(v => v / max);
}

/**
 * Process image through the feature extraction pipeline
 * Returns both normalized features and raw gradient for heatmap
 */
async function extractFeatures(imageUrl: string): Promise<{ features: Float32Array; gradient: Float32Array }> {
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
    const features = normalize(gradient);

    return { features, gradient };
}

/**
 * Run inference on extracted features
 */
async function runInference(features: Float32Array): Promise<{ isAI: boolean; confidence: number }> {
    const inferenceSession = await initSession();

    // Log model input/output names for debug
    console.log('[UnDiffused] Model inputs:', inferenceSession.inputNames);

    // Normalize to 0-1 for CNN (features are 0-255)
    // Create a new array to avoid modifying the visualization data
    const inputData = new Float32Array(features.length);
    for (let i = 0; i < features.length; i++) {
        inputData[i] = features[i] / 255.0;
    }

    // Create input tensor [1, 1, 128, 128]
    const inputName = inferenceSession.inputNames[0];
    const inputTensor = new ort.Tensor('float32', inputData, [1, 1, IMAGE_SIZE, IMAGE_SIZE]);

    // Run inference
    const feeds: Record<string, ort.Tensor> = {};
    feeds[inputName] = inputTensor;

    const results = await inferenceSession.run(feeds);

    // Get output (Sigmoid probability of being AI)
    const outputName = inferenceSession.outputNames[0];
    const outputTensor = results[outputName];

    const probability = outputTensor.data[0] as number;
    const isAI = probability > 0.5;

    // Calculate confidence
    const confidence = Math.round((isAI ? probability : 1 - probability) * 100);

    return { isAI, confidence };
}

/**
 * Main analysis function - returns result with heatmap data
 */
async function analyzeImage(url: string): Promise<{ isAI: boolean; confidence: number; heatmapData: number[]; filterData: number[] }> {
    console.log('[UnDiffused] Analyzing:', url);

    const { features, gradient } = await extractFeatures(url);
    const result = await runInference(features);
    const heatmapData = generateHeatmapData(gradient);

    // Convert float array to regular array for message passing
    // Subsample slightly or send full 128x128? 128x128 is 16k values, totally fine.
    const filterData = Array.from(features);

    console.log('[UnDiffused] Result:', result, 'Heatmap points:', heatmapData.length);
    return { ...result, heatmapData, filterData };
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
