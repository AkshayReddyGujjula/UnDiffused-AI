import { describe, it, expect } from 'vitest';
import { generateDeepScanTiles, getAdaptiveCrops, generateGridCrops } from '../crops';

const PATCH = 224;
const DEEP_MAX = 100;

describe('generateDeepScanTiles', () => {
    it('returns at most DEEP_MAX_TILES tiles for very large images', () => {
        // 4000x4000 image would produce many tiles without the cap
        const tiles = generateDeepScanTiles(4000, 4000);
        expect(tiles.length).toBeLessThanOrEqual(DEEP_MAX);
    });

    it('tiles have the correct patch size for a normal image', () => {
        const tiles = generateDeepScanTiles(512, 512);
        for (const t of tiles) {
            expect(t.width).toBeLessThanOrEqual(PATCH);
            expect(t.height).toBeLessThanOrEqual(PATCH);
        }
    });

    it('tile coordinates are within image bounds', () => {
        const w = 800, h = 600;
        const tiles = generateDeepScanTiles(w, h);
        for (const t of tiles) {
            expect(t.x).toBeGreaterThanOrEqual(0);
            expect(t.y).toBeGreaterThanOrEqual(0);
            expect(t.x + t.width).toBeLessThanOrEqual(w);
            expect(t.y + t.height).toBeLessThanOrEqual(h);
        }
    });

    it('uses overlapping stride — more tiles than non-overlapping for a mid-size image', () => {
        const w = 672, h = 672; // 3x3 grid non-overlapping, but overlapping gives more
        const tiles = generateDeepScanTiles(w, h);
        // Non-overlapping would give ceil(672/224)^2 = 9 tiles
        // Overlapping (stride 112) gives more
        expect(tiles.length).toBeGreaterThan(9);
    });

    it('produces exactly 1 tile for a tiny image (smaller than patch)', () => {
        const tiles = generateDeepScanTiles(100, 100);
        // Single tile covering the whole small image
        expect(tiles.length).toBeGreaterThanOrEqual(1);
        expect(tiles[0].x).toBe(0);
        expect(tiles[0].y).toBe(0);
    });

    it('has no duplicate tiles (unique x,y coordinates)', () => {
        const tiles = generateDeepScanTiles(800, 600);
        const keys = tiles.map(t => `${t.x}:${t.y}`);
        const unique = new Set(keys);
        expect(unique.size).toBe(keys.length);
    });

    it('ranks by quality map when provided', () => {
        // Create a quality map that strongly favors top-left corner
        const w = 2000, h = 2000;
        const qualityMap = new Float32Array(w * h).fill(0);
        // High quality only in top-left 224x224
        for (let y = 0; y < PATCH; y++) {
            for (let x = 0; x < PATCH; x++) {
                qualityMap[y * w + x] = 1.0;
            }
        }
        const tiles = generateDeepScanTiles(w, h, qualityMap);
        // First tile should be at or near top-left
        expect(tiles[0].x).toBeLessThan(PATCH);
        expect(tiles[0].y).toBeLessThan(PATCH);
    });
});

describe('getAdaptiveCrops', () => {
    it('returns at most numCrops crops', () => {
        const w = 1000, h = 800;
        const qMap = new Float32Array(w * h).fill(0.5);
        const crops = getAdaptiveCrops(w, h, qMap, 10);
        expect(crops.length).toBeLessThanOrEqual(10);
    });

    it('returns exactly 1 crop for tiny images', () => {
        const qMap = new Float32Array(100 * 100).fill(0.5);
        const crops = getAdaptiveCrops(100, 100, qMap);
        expect(crops.length).toBe(1);
        expect(crops[0].label).toBe('Global');
    });

    it('crop coordinates are within image bounds', () => {
        const w = 1024, h = 768;
        const qMap = new Float32Array(w * h).fill(0.5);
        const crops = getAdaptiveCrops(w, h, qMap, 10);
        for (const c of crops) {
            expect(c.x).toBeGreaterThanOrEqual(0);
            expect(c.y).toBeGreaterThanOrEqual(0);
            expect(c.x + c.width).toBeLessThanOrEqual(w);
            expect(c.y + c.height).toBeLessThanOrEqual(h);
        }
    });

    it('default numCrops cap is 10', () => {
        const w = 2000, h = 1500;
        const qMap = new Float32Array(w * h).fill(0.5);
        const crops = getAdaptiveCrops(w, h, qMap); // no explicit cap
        expect(crops.length).toBeLessThanOrEqual(10);
    });

    it('high-quality region is ranked first', () => {
        const w = 1000, h = 1000;
        const qMap = new Float32Array(w * h).fill(0.0);
        // Make bottom-right corner the only high-quality region
        for (let y = 776; y < 1000; y++) {
            for (let x = 776; x < 1000; x++) {
                qMap[y * w + x] = 1.0;
            }
        }
        const crops = getAdaptiveCrops(w, h, qMap, 10);
        const first = crops[0];
        // The first adaptive crop should be near bottom-right
        expect(first.x).toBeGreaterThan(400);
        expect(first.y).toBeGreaterThan(400);
    });
});

describe('generateGridCrops', () => {
    it('returns 9 crops for a normal image', () => {
        const crops = generateGridCrops(1024, 768);
        expect(crops.length).toBe(9);
    });

    it('returns a single global crop for tiny images', () => {
        const crops = generateGridCrops(100, 100);
        expect(crops.length).toBe(1);
        expect(crops[0].label).toBe('Global');
    });

    it('all crops have 224x224 size for large images', () => {
        const crops = generateGridCrops(1024, 1024);
        for (const c of crops) {
            expect(c.width).toBe(PATCH);
            expect(c.height).toBe(PATCH);
        }
    });
});
