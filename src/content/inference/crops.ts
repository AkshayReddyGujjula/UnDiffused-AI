import { CropRect } from './types';

const PATCH_SIZE = 224;
// 50% overlap stride for deep scan — catches boundary artifacts missed by non-overlapping tiles
const DEEP_STRIDE = Math.floor(PATCH_SIZE / 2); // 112
const DEEP_MAX_TILES = 100;

export function generateDefaultCrops(width: number, height: number): CropRect[] {
    const crops: CropRect[] = [];
    const cropW = Math.min(PATCH_SIZE, width);
    const cropH = Math.min(PATCH_SIZE, height);

    crops.push({ x: 0, y: 0, width, height, label: 'Global' });

    if (width <= PATCH_SIZE && height <= PATCH_SIZE) return crops;

    const centerX = Math.max(0, Math.floor((width - PATCH_SIZE) / 2));
    const centerY = Math.max(0, Math.floor((height - PATCH_SIZE) / 2));
    crops.push({ x: centerX, y: centerY, width: cropW, height: cropH, label: 'Center' });

    crops.push({ x: 0, y: 0, width: cropW, height: cropH, label: 'Top-Left' });
    crops.push({ x: Math.max(0, width - PATCH_SIZE), y: 0, width: cropW, height: cropH, label: 'Top-Right' });
    crops.push({ x: 0, y: Math.max(0, height - PATCH_SIZE), width: cropW, height: cropH, label: 'Bottom-Left' });
    crops.push({
        x: Math.max(0, width - PATCH_SIZE),
        y: Math.max(0, height - PATCH_SIZE),
        width: cropW,
        height: cropH,
        label: 'Bottom-Right',
    });

    return crops;
}

export function generateGridCrops(width: number, height: number): CropRect[] {
    const size = PATCH_SIZE;
    if (width <= size && height <= size) {
        return [{ x: 0, y: 0, width, height, label: 'Global' }];
    }

    const xLeft = 0;
    const xCenter = Math.max(0, Math.floor((width - size) / 2));
    const xRight = Math.max(0, width - size);
    const yTop = 0;
    const yCenter = Math.max(0, Math.floor((height - size) / 2));
    const yBottom = Math.max(0, height - size);

    return [
        { x: xLeft,   y: yTop,    width: size, height: size, label: 'Top-Left' },
        { x: xCenter, y: yTop,    width: size, height: size, label: 'Top-Center' },
        { x: xRight,  y: yTop,    width: size, height: size, label: 'Top-Right' },
        { x: xLeft,   y: yCenter, width: size, height: size, label: 'Mid-Left' },
        { x: xCenter, y: yCenter, width: size, height: size, label: 'Center' },
        { x: xRight,  y: yCenter, width: size, height: size, label: 'Mid-Right' },
        { x: xLeft,   y: yBottom, width: size, height: size, label: 'Bottom-Left' },
        { x: xCenter, y: yBottom, width: size, height: size, label: 'Bottom-Center' },
        { x: xRight,  y: yBottom, width: size, height: size, label: 'Bottom-Right' },
    ];
}

/**
 * Deep scan: overlapping tiles with DEEP_STRIDE (50% overlap) capped at DEEP_MAX_TILES.
 * Overlapping coverage catches artifacts near tile boundaries that non-overlapping grids miss.
 * When the tile count exceeds the cap, tiles are ranked by estimated saliency (edge density)
 * so the most informative regions are processed first.
 */
export function generateDeepScanTiles(
    width: number,
    height: number,
    qualityMap?: Float32Array
): CropRect[] {
    const size = PATCH_SIZE;
    const cropW = Math.min(size, width);
    const cropH = Math.min(size, height);

    const seen = new Set<string>();
    const allTiles: CropRect[] = [];

    for (let y = 0; y <= height - cropH; y += DEEP_STRIDE) {
        for (let x = 0; x <= width - cropW; x += DEEP_STRIDE) {
            const key = `${x}:${y}`;
            if (seen.has(key)) continue;
            seen.add(key);
            allTiles.push({ x, y, width: cropW, height: cropH, label: `Tile ${x},${y}` });
        }
    }

    // Always include the right/bottom edge strips so we don't miss the image boundary
    for (let y = 0; y <= height - cropH; y += DEEP_STRIDE) {
        const x = Math.max(0, width - cropW);
        const key = `${x}:${y}`;
        if (!seen.has(key)) {
            seen.add(key);
            allTiles.push({ x, y, width: cropW, height: cropH, label: `Tile ${x},${y}` });
        }
    }
    for (let x = 0; x <= width - cropW; x += DEEP_STRIDE) {
        const y = Math.max(0, height - cropH);
        const key = `${x}:${y}`;
        if (!seen.has(key)) {
            seen.add(key);
            allTiles.push({ x, y, width: cropW, height: cropH, label: `Tile ${x},${y}` });
        }
    }

    if (allTiles.length <= DEEP_MAX_TILES) return allTiles;

    // Rank by saliency score when capping — prioritise high-detail regions
    if (qualityMap) {
        const scored = allTiles.map(tile => ({
            tile,
            score: sampleQuality(tile, qualityMap, width),
        }));
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, DEEP_MAX_TILES).map(s => s.tile);
    }

    // No quality map: distribute evenly across the image rather than truncating from top-left
    const step = Math.ceil(allTiles.length / DEEP_MAX_TILES);
    return allTiles.filter((_, i) => i % step === 0).slice(0, DEEP_MAX_TILES);
}

function sampleQuality(tile: CropRect, qualityMap: Float32Array, imageWidth: number): number {
    const sampleStep = 16;
    let total = 0;
    let count = 0;
    for (let dy = 0; dy < tile.height; dy += sampleStep) {
        for (let dx = 0; dx < tile.width; dx += sampleStep) {
            const px = tile.x + dx;
            const py = tile.y + dy;
            total += qualityMap[py * imageWidth + px] ?? 0;
            count++;
        }
    }
    return count > 0 ? total / count : 0;
}

/**
 * Adaptive saliency-ranked cropping for normal scan.
 * Uses sliding window + NMS; capped at numCrops (default 10).
 */
export function getAdaptiveCrops(
    width: number,
    height: number,
    qualityMap: Float32Array,
    numCrops = 10
): CropRect[] {
    const size = PATCH_SIZE;

    if (width <= size && height <= size) {
        return [{ x: 0, y: 0, width, height, label: 'Global' }];
    }

    const stride = 56;
    const candidates: { x: number; y: number; score: number }[] = [];

    for (let y = 0; y <= height - size; y += stride) {
        for (let x = 0; x <= width - size; x += stride) {
            let total = 0;
            let samples = 0;
            const sampleStep = 8;

            for (let wy = 0; wy < size; wy += sampleStep) {
                const rowOffset = (y + wy) * width;
                for (let wx = 0; wx < size; wx += sampleStep) {
                    total += qualityMap[rowOffset + x + wx];
                    samples++;
                }
            }
            candidates.push({ x, y, score: total / samples });
        }
    }

    candidates.sort((a, b) => b.score - a.score);

    const selected: { x: number; y: number; score: number }[] = [];

    const isOverlapping = (cx: number, cy: number): boolean => {
        for (const s of selected) {
            const ix = Math.max(cx, s.x);
            const iy = Math.max(cy, s.y);
            const ax = Math.min(cx + size, s.x + size);
            const ay = Math.min(cy + size, s.y + size);
            if (ix < ax && iy < ay) {
                const intersection = (ax - ix) * (ay - iy);
                if (intersection / (size * size) > 0.3) return true;
            }
        }
        return false;
    };

    for (const cand of candidates) {
        if (selected.length >= numCrops) break;
        if (!isOverlapping(cand.x, cand.y)) selected.push(cand);
    }

    const crops: CropRect[] = selected.map((s, i) => ({
        x: s.x,
        y: s.y,
        width: size,
        height: size,
        label: `Adaptive-${i + 1} (${s.score.toFixed(2)})`,
    }));

    // Fallback: fill remaining slots from the fixed grid
    if (crops.length < numCrops) {
        const fallback = generateGridCrops(width, height);
        for (const fc of fallback) {
            if (crops.length >= numCrops) break;
            const isDup = crops.some(c => Math.abs(c.x - fc.x) < 10 && Math.abs(c.y - fc.y) < 10);
            if (!isDup) crops.push({ ...fc, label: `Fallback-${fc.label}` });
        }
    }

    return crops;
}
