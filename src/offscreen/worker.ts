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

    // Create input tensor
    const inputTensor = new ort.Tensor('float32', features, [1, features.length]);

    // Run inference
    const feeds = { input: inputTensor };
    const results = await inferenceSession.run(feeds);

    // Log available output names for debugging
    console.log('[UnDiffused] Model output names:', Object.keys(results));

    // Parse results - sklearn pipelines output 'output_label' and 'output_probability'
    // The probability output is a ZipMap (sequence of maps), not a simple tensor
    const labelOutput = results['output_label'];

    if (!labelOutput) {
        // Try alternative output names
        const outputNames = Object.keys(results);
        throw new Error(`No label output found. Available outputs: ${outputNames.join(', ')}`);
    }

    // Get predicted label (0 = Real, 1 = AI-generated)
    const label = Number((labelOutput.data as BigInt64Array)[0]);
    const isAI = label === 1;

    // For probability, try to extract from output_probability if available as tensor
    // If not, we'll estimate confidence based on the prediction
    let confidence = 85; // Default confidence

    const probOutput = results['output_probability'];
    if (probOutput) {
        try {
            // Check if it's a tensor type we can read
            const outputType = probOutput.type as string;
            if (outputType === 'float32' || outputType === 'float64') {
                const probs = probOutput.data as Float32Array;
                // Probabilities are [prob_class_0, prob_class_1]
                confidence = Math.round((isAI ? probs[1] : probs[0]) * 100);
            } else if (outputType.includes('map') || outputType.includes('seq')) {
                // ZipMap format - extract from the sequence
                // The data is structured as [{0: prob0, 1: prob1}]
                const mapData = probOutput.data as unknown;
                if (Array.isArray(mapData) && mapData.length > 0) {
                    const probMap = mapData[0] as Map<bigint, number>;
                    if (probMap instanceof Map) {
                        const prob0 = probMap.get(BigInt(0)) || 0;
                        const prob1 = probMap.get(BigInt(1)) || 0;
                        confidence = Math.round((isAI ? prob1 : prob0) * 100);
                    }
                }
            }
        } catch (e) {
            console.warn('[UnDiffused] Could not parse probability output, using default confidence:', e);
        }
    }

    return { isAI, confidence };
}

/**
 * Main analysis function - returns result with heatmap data
 */
async function analyzeImage(url: string): Promise<{ isAI: boolean; confidence: number; heatmapData: number[] }> {
    console.log('[UnDiffused] Analyzing:', url);

    const { features, gradient } = await extractFeatures(url);
    const result = await runInference(features);
    const heatmapData = generateHeatmapData(gradient);

    console.log('[UnDiffused] Result:', result, 'Heatmap points:', heatmapData.length);
    return { ...result, heatmapData };
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
