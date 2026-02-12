import { CropRect } from './types';

const PATCH_SIZE = 224;

/**
 * Generates the default set of crops:
 * 1. Global (resized)
 * 2. Center
 * 3. Four Corners
 */
export function generateDefaultCrops(width: number, height: number): CropRect[] {
    const crops: CropRect[] = [];

    // 1. Global (conceptually matches the whole image, preprocessor will resize it)
    crops.push({
        x: 0,
        y: 0,
        width: width,
        height: height,
        label: 'Global'
    });

    // If image is smaller than patch size, just use Global (it will be upscaled/padded by preprocessor)
    if (width <= PATCH_SIZE && height <= PATCH_SIZE) {
        return crops;
    }

    // 2. Center Crop
    const centerX = Math.max(0, Math.floor((width - PATCH_SIZE) / 2));
    const centerY = Math.max(0, Math.floor((height - PATCH_SIZE) / 2));
    crops.push({
        x: centerX,
        y: centerY,
        width: PATCH_SIZE,
        height: PATCH_SIZE,
        label: 'Center'
    });

    // 3. Four Corners
    // Top-Left
    crops.push({ x: 0, y: 0, width: PATCH_SIZE, height: PATCH_SIZE, label: 'Top-Left' });

    // Top-Right
    crops.push({
        x: Math.max(0, width - PATCH_SIZE),
        y: 0,
        width: PATCH_SIZE,
        height: PATCH_SIZE,
        label: 'Top-Right'
    });

    // Bottom-Left
    crops.push({
        x: 0,
        y: Math.max(0, height - PATCH_SIZE),
        width: PATCH_SIZE,
        height: PATCH_SIZE,
        label: 'Bottom-Left'
    });

    // Bottom-Right
    crops.push({
        x: Math.max(0, width - PATCH_SIZE),
        y: Math.max(0, height - PATCH_SIZE),
        width: PATCH_SIZE,
        height: PATCH_SIZE,
        label: 'Bottom-Right'
    });

    return crops;
}

/**
 * Generates a grid of non-overlapping tiles for Deep Scan.
 */
export function generateDeepScanTiles(width: number, height: number): CropRect[] {
    const crops: CropRect[] = [];

    const tilesX = Math.floor(width / PATCH_SIZE);
    const tilesY = Math.floor(height / PATCH_SIZE);

    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            crops.push({
                x: x * PATCH_SIZE,
                y: y * PATCH_SIZE,
                width: PATCH_SIZE,
                height: PATCH_SIZE,
                label: `Tile ${x},${y}`
            });
        }
    }

    // Add remainders if significant? For now, implementing basic grid as requested.
    // "Ignore remainders for now (OK to miss a thin border)."

    return crops;
}
