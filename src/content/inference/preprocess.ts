import * as ort from 'onnxruntime-web';
import { CropRect } from './types';

const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];
const TARGET_SIZE = 224;

/**
 * Extracts a crop from the source canvas, normalizes it, and returns an ONNX Tensor.
 */
export function extractCropToTensor(
    sourceCanvas: HTMLCanvasElement | OffscreenCanvas,
    crop: CropRect
): ort.Tensor {
    // 1. Create a 224x224 OffscreenCanvas
    // Note: OffscreenCanvas is available in Content Scripts in most modern browsers.
    // If not, we might need a fallback, but Chrome V3 implies modern environment.
    const canvas = new OffscreenCanvas(TARGET_SIZE, TARGET_SIZE);
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error("Failed to get context for crop extraction");

    // 2. Draw the crop
    // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    ctx.drawImage(
        sourceCanvas,
        crop.x, crop.y, crop.width, crop.height, // Source rect
        0, 0, TARGET_SIZE, TARGET_SIZE           // Dest rect (always 224x224)
    );

    // 3. Get ImageData
    const imgData = ctx.getImageData(0, 0, TARGET_SIZE, TARGET_SIZE);
    const { data } = imgData; // RGBA uint8

    // 4. Transform to Float32 CHW Tensor [3, 224, 224]
    const float32Data = new Float32Array(3 * TARGET_SIZE * TARGET_SIZE);

    // Pre-calculate indices to optimize loop
    for (let i = 0; i < TARGET_SIZE * TARGET_SIZE; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];

        // Normalize R
        float32Data[i] = (r / 255.0 - MEAN[0]) / STD[0];
        // Normalize G
        float32Data[i + TARGET_SIZE * TARGET_SIZE] = (g / 255.0 - MEAN[1]) / STD[1];
        // Normalize B
        float32Data[i + 2 * TARGET_SIZE * TARGET_SIZE] = (b / 255.0 - MEAN[2]) / STD[2];
    }

    // 5. Create Tensor [1, 3, 224, 224]
    return new ort.Tensor('float32', float32Data, [1, 3, TARGET_SIZE, TARGET_SIZE]);
}
