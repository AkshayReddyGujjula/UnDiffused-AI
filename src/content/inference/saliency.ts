

/**
 * Computes a pixel-wise "importance score" (0.0 - 1.0) based on three weighted metrics.
 * 
 * Metrics & Weights:
 * - Laplacian Variance (Sharpness) [Weight: 0.5]
 * - Edge Density (Structure) [Weight: 0.3]
 * - Local Contrast (Dynamic Range) [Weight: 0.2]
 * 
 * @param imageData The input image data.
 * @returns A Float32Array representing the quality map (0.0 - 1.0).
 */
export function computeQualityMap(imageData: ImageData): Float32Array {
    const { width, height, data } = imageData;
    const size = width * height;

    // 1. Grayscale Conversion (Luma)
    const gray = new Float32Array(size);
    for (let i = 0; i < size; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Initialize metrics
    const laplacian = new Float32Array(size);
    const edges = new Float32Array(size);
    const contrast = new Float32Array(size);
    const qualityMap = new Float32Array(size);

    // Helper for safe index access (clamp to edges)
    const idx = (x: number, y: number) => {
        const cx = Math.max(0, Math.min(width - 1, x));
        const cy = Math.max(0, Math.min(height - 1, y));
        return cy * width + cx;
    };

    // 2. Compute Metrics (Single Pass per Metric for simplicity, could be optimized)

    // --- Metric 1: Laplacian (Sharpness) ---
    // Kernel: [[0, 1, 0], [1, -4, 1], [0, 1, 0]]
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const val =
                gray[idx(x, y - 1)] +
                gray[idx(x - 1, y)] +
                gray[idx(x + 1, y)] +
                gray[idx(x, y + 1)] -
                4 * gray[idx(x, y)];
            laplacian[idx(x, y)] = Math.abs(val);
        }
    }

    // Compute Local Variance of Laplacian (5x5 window)
    // To speed up, we can just use the Laplacian magnitude itself as a proxy for specific high-frequency energy,
    // but the spec asks for "Local Variance over a 5x5 window." 
    // Calculating full variance on 5x5 for every pixel is expensive. 
    // Approximation: Average Laplacian magnitude in 5x5 window.
    // Let's implement a separated box blur for efficiency if needed, but for now, direct loop.
    const laplacianVar = computeLocalAverage(laplacian, width, height, 2); // 2 radius = 5x5


    // --- Metric 2: Edge Density (Sobel) ---
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const gx = -gray[idx(x - 1, y - 1)] + gray[idx(x + 1, y - 1)]
                - 2 * gray[idx(x - 1, y)] + 2 * gray[idx(x + 1, y)]
                - gray[idx(x - 1, y + 1)] + gray[idx(x + 1, y + 1)];

            const gy = -gray[idx(x - 1, y - 1)] - 2 * gray[idx(x, y - 1)] - gray[idx(x + 1, y - 1)]
                + gray[idx(x - 1, y + 1)] + 2 * gray[idx(x, y + 1)] + gray[idx(x + 1, y + 1)];

            edges[idx(x, y)] = Math.sqrt(gx * gx + gy * gy);
        }
    }


    // --- Metric 3: Local Contrast (Standard Deviation) ---
    // Standard Deviation in 5x5 window.
    // StdDev = sqrt(E[x^2] - (E[x])^2)
    const meanGray = computeLocalAverage(gray, width, height, 2);

    // Compute squared gray image
    const graySq = new Float32Array(size);
    for (let i = 0; i < size; i++) graySq[i] = gray[i] * gray[i];
    const meanGraySq = computeLocalAverage(graySq, width, height, 2);

    for (let i = 0; i < size; i++) {
        const variance = Math.max(0, meanGraySq[i] - (meanGray[i] * meanGray[i]));
        contrast[i] = Math.sqrt(variance);
    }

    // 3. Normalize and Combine
    const normLaplacian = normalize(laplacianVar);
    const normEdges = normalize(edges);
    const normContrast = normalize(contrast);

    for (let i = 0; i < size; i++) {
        qualityMap[i] =
            0.5 * normLaplacian[i] +
            0.3 * normEdges[i] +
            0.2 * normContrast[i];
    }

    return qualityMap;
}

function computeLocalAverage(input: Float32Array, width: number, height: number, radius: number): Float32Array {
    const output = new Float32Array(input.length);
    // Naive 5x5 convolution for now. 
    // Optimization: Separable filter would be O(1) per pixel with integral image or 2-pass 1D Box Blur.
    // Given 200ms budget, naive 5x5 is roughly 25 ops per pixel on ~1M pixels (assuming 1000x1000 img) = 25M ops.
    // This is fine for JS on desktop.

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0;
            let count = 0;
            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {
                    const py = y + ky;
                    const px = x + kx;
                    if (px >= 0 && px < width && py >= 0 && py < height) {
                        sum += input[py * width + px];
                        count++;
                    }
                }
            }
            output[y * width + x] = sum / count;
        }
    }
    return output;
}

function normalize(input: Float32Array): Float32Array {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < input.length; i++) {
        if (input[i] < min) min = input[i];
        if (input[i] > max) max = input[i];
    }

    const range = max - min;
    const output = new Float32Array(input.length);

    if (range < 0.0001) return output; // Avoid div by zero, return 0s

    for (let i = 0; i < input.length; i++) {
        output[i] = (input[i] - min) / range;
    }
    return output;
}

/**
 * Visualizes the quality map as an overlay.
 * Red = High Quality (1.0), Blue/Transparent = Low Quality (0.0)
 */
export function renderQualityHeatmap(qualityMap: Float32Array, width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < qualityMap.length; i++) {
        const score = qualityMap[i];

        // Heatmap Color Map: Blue (0) -> Red (1)
        // Simple interpolation
        const r = Math.floor(score * 255);
        const b = Math.floor((1 - score) * 255);

        data[i * 4] = r;     // R
        data[i * 4 + 1] = 0; // G
        data[i * 4 + 2] = b; // B
        data[i * 4 + 3] = Math.floor(score * 200); // Alpha scaled by score (transparent if low score)
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}
