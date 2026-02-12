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
    const cropW = Math.min(PATCH_SIZE, width);
    const cropH = Math.min(PATCH_SIZE, height);

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
        width: cropW,
        height: cropH,
        label: 'Center'
    });

    // 3. Four Corners
    // Top-Left
    crops.push({ x: 0, y: 0, width: cropW, height: cropH, label: 'Top-Left' });

    // Top-Right
    crops.push({
        x: Math.max(0, width - PATCH_SIZE),
        y: 0,
        width: cropW,
        height: cropH,
        label: 'Top-Right'
    });

    // Bottom-Left
    crops.push({
        x: 0,
        y: Math.max(0, height - PATCH_SIZE),
        width: cropW,
        height: cropH,
        label: 'Bottom-Left'
    });

    // Bottom-Right
    crops.push({
        x: Math.max(0, width - PATCH_SIZE),
        y: Math.max(0, height - PATCH_SIZE),
        width: cropW,
        height: cropH,
        label: 'Bottom-Right'
    });

    return crops;
}

/**
 * Generates a grid of non-overlapping tiles for Deep Scan.
 */
export function generateDeepScanTiles(width: number, height: number): CropRect[] {
    const crops: CropRect[] = [];
    const seen = new Set<string>();
    const cropW = Math.min(PATCH_SIZE, width);
    const cropH = Math.min(PATCH_SIZE, height);
    const tilesX = Math.max(1, Math.ceil(width / PATCH_SIZE));
    const tilesY = Math.max(1, Math.ceil(height / PATCH_SIZE));

    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            const tileX = Math.min(x * PATCH_SIZE, Math.max(0, width - cropW));
            const tileY = Math.min(y * PATCH_SIZE, Math.max(0, height - cropH));
            const key = `${tileX}:${tileY}:${cropW}:${cropH}`;
            if (seen.has(key)) continue;
            seen.add(key);

            crops.push({
                x: tileX,
                y: tileY,
                width: cropW,
                height: cropH,
                label: `Tile ${x},${y}`
            });
        }
    }

    // Add remainders if significant? For now, implementing basic grid as requested.
    // "Ignore remainders for now (OK to miss a thin border)."

    return crops;
}
