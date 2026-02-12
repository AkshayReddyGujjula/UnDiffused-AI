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
 * Generates a 3x3 Grid of crops (9 total) for standard inference.
 * Positions: TL, TC, TR, ML, Center, MR, BL, BC, BR
 */
export function generateGridCrops(width: number, height: number): CropRect[] {
    const crops: CropRect[] = [];
    const size = PATCH_SIZE; // 224

    // If image is smaller than patch, return single global crop
    if (width <= size && height <= size) {
        return [{ x: 0, y: 0, width, height, label: 'Global' }];
    }

    // Grid Coordinates
    // X Axis: Left(0), Center((W-224)/2), Right(W-224)
    const xLeft = 0;
    const xCenter = Math.max(0, Math.floor((width - size) / 2));
    const xRight = Math.max(0, width - size);

    // Y Axis: Top(0), Center((H-224)/2), Bottom(H-224)
    const yTop = 0;
    const yCenter = Math.max(0, Math.floor((height - size) / 2));
    const yBottom = Math.max(0, height - size);

    // Top Row
    crops.push({ x: xLeft, y: yTop, width: size, height: size, label: 'Top-Left' });
    crops.push({ x: xCenter, y: yTop, width: size, height: size, label: 'Top-Center' });
    crops.push({ x: xRight, y: yTop, width: size, height: size, label: 'Top-Right' });

    // Middle Row
    crops.push({ x: xLeft, y: yCenter, width: size, height: size, label: 'Mid-Left' });
    crops.push({ x: xCenter, y: yCenter, width: size, height: size, label: 'Center' });
    crops.push({ x: xRight, y: yCenter, width: size, height: size, label: 'Mid-Right' });

    // Bottom Row
    crops.push({ x: xLeft, y: yBottom, width: size, height: size, label: 'Bottom-Left' });
    crops.push({ x: xCenter, y: yBottom, width: size, height: size, label: 'Bottom-Center' });
    crops.push({ x: xRight, y: yBottom, width: size, height: size, label: 'Bottom-Right' });

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
