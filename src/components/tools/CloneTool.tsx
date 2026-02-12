import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';
import { ToolSlider } from './ToolSlider';

interface CloneToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

type BlockDescriptor = {
    x: number;
    y: number;
    desc: Float32Array;
    hash: number;
};

/**
 * Clone Detection Tool
 * ====================
 * Detects duplicated regions via block descriptors and similarity matching.
 */
export const CloneTool: React.FC<CloneToolProps> = ({ targetImage, onResult }) => {
    const [sensitivity, setSensitivity] = useState(5);
    const [minRegion, setMinRegion] = useState(32);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [cloneCount, setCloneCount] = useState<number | null>(null);

    const buildDescriptor = (
        luminance: Float32Array,
        width: number,
        x: number,
        y: number,
        blockSize: number
    ): Float32Array => {
        // 4x4 mean-pooled patch descriptor normalized by local mean.
        const grid = 4;
        const cell = Math.max(1, Math.floor(blockSize / grid));
        const values = new Float32Array(grid * grid);

        let sumAll = 0;
        for (let gy = 0; gy < grid; gy++) {
            for (let gx = 0; gx < grid; gx++) {
                let sum = 0;
                let count = 0;
                for (let dy = 0; dy < cell; dy++) {
                    for (let dx = 0; dx < cell; dx++) {
                        const px = x + gx * cell + dx;
                        const py = y + gy * cell + dy;
                        sum += luminance[py * width + px];
                        count++;
                    }
                }
                const mean = count > 0 ? sum / count : 0;
                values[gy * grid + gx] = mean;
                sumAll += mean;
            }
        }

        const avg = sumAll / values.length;
        let norm = 0;
        for (let i = 0; i < values.length; i++) {
            values[i] -= avg;
            norm += values[i] * values[i];
        }
        norm = Math.sqrt(norm) || 1;
        for (let i = 0; i < values.length; i++) {
            values[i] /= norm;
        }
        return values;
    };

    const hashDescriptor = (desc: Float32Array): number => {
        let h = 2166136261;
        for (let i = 0; i < desc.length; i++) {
            // Quantize normalized value from [-1, 1] into 32 bins.
            const q = Math.max(0, Math.min(31, Math.round((desc[i] + 1) * 15.5)));
            h ^= q;
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    };

    const cosineSimilarity = (a: Float32Array, b: Float32Array): number => {
        let dot = 0;
        for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
        return dot;
    };

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setCloneCount(null);

        try {
            const img = new Image();

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load'));
                img.src = targetImage;
            });

            const srcW = img.naturalWidth;
            const srcH = img.naturalHeight;
            const scale = Math.min(1, 768 / Math.max(srcW, srcH));
            const w = Math.max(64, Math.round(srcW * scale));
            const h = Math.max(64, Math.round(srcH * scale));

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.drawImage(img, 0, 0, w, h);
            const imageData = tempCtx.getImageData(0, 0, w, h).data;

            const luminance = new Float32Array(w * h);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                luminance[i] = 0.299 * imageData[idx] + 0.587 * imageData[idx + 1] + 0.114 * imageData[idx + 2];
            }

            const blockSize = Math.max(8, Math.round(minRegion * scale));
            let stride = Math.max(4, Math.floor(blockSize / 2));
            let estBlocks = Math.floor((w - blockSize) / stride + 1) * Math.floor((h - blockSize) / stride + 1);
            while (estBlocks > 12000) {
                stride += 2;
                estBlocks = Math.floor((w - blockSize) / stride + 1) * Math.floor((h - blockSize) / stride + 1);
            }

            const descriptors: BlockDescriptor[] = [];
            const buckets = new Map<number, number[]>();
            let scanned = 0;

            for (let by = 0; by + blockSize <= h; by += stride) {
                for (let bx = 0; bx + blockSize <= w; bx += stride) {
                    const desc = buildDescriptor(luminance, w, bx, by, blockSize);
                    const hash = hashDescriptor(desc);
                    const item: BlockDescriptor = { x: bx, y: by, desc, hash };
                    const index = descriptors.push(item) - 1;
                    if (!buckets.has(hash)) buckets.set(hash, []);
                    buckets.get(hash)!.push(index);

                    scanned++;
                    if (scanned % 2000 === 0) {
                        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
                    }
                }
            }

            const threshold = 0.9 + (sensitivity - 5) * 0.008;
            const minDist = blockSize * 1.5;
            const candidates: { a: BlockDescriptor; b: BlockDescriptor; sim: number }[] = [];

            for (const ids of buckets.values()) {
                if (ids.length < 2 || ids.length > 70) continue;

                const maxComparisons = Math.min(400, (ids.length * (ids.length - 1)) / 2);
                let comparisons = 0;

                for (let i = 0; i < ids.length; i++) {
                    for (let j = i + 1; j < ids.length; j++) {
                        const a = descriptors[ids[i]];
                        const b = descriptors[ids[j]];
                        const dist = Math.hypot(a.x - b.x, a.y - b.y);
                        if (dist < minDist) continue;

                        const sim = cosineSimilarity(a.desc, b.desc);
                        if (sim >= threshold) {
                            candidates.push({ a, b, sim });
                        }

                        comparisons++;
                        if (comparisons >= maxComparisons) break;
                    }
                    if (comparisons >= maxComparisons) break;
                }
            }

            candidates.sort((u, v) => v.sim - u.sim);

            const selected: { a: BlockDescriptor; b: BlockDescriptor; sim: number }[] = [];
            const maxPairs = 30;
            for (const pair of candidates) {
                const tooClose = selected.some((s) =>
                    Math.hypot(s.a.x - pair.a.x, s.a.y - pair.a.y) < blockSize / 2 &&
                    Math.hypot(s.b.x - pair.b.x, s.b.y - pair.b.y) < blockSize / 2
                );
                if (!tooClose) {
                    selected.push(pair);
                    if (selected.length >= maxPairs) break;
                }
            }

            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = srcW;
            resultCanvas.height = srcH;
            const ctx = resultCanvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            const colors = ['#f43f5e', '#06b6d4', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
            for (let i = 0; i < selected.length; i++) {
                const color = colors[i % colors.length];
                const pair = selected[i];

                const ax = pair.a.x / scale;
                const ay = pair.a.y / scale;
                const bx = pair.b.x / scale;
                const by = pair.b.y / scale;
                const regionSize = minRegion;

                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.75;
                ctx.strokeRect(ax, ay, regionSize, regionSize);
                ctx.strokeRect(bx, by, regionSize, regionSize);

                ctx.fillStyle = color;
                ctx.globalAlpha = 0.16;
                ctx.fillRect(ax, ay, regionSize, regionSize);
                ctx.fillRect(bx, by, regionSize, regionSize);

                ctx.globalAlpha = 0.45;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(ax + regionSize / 2, ay + regionSize / 2);
                ctx.lineTo(bx + regionSize / 2, by + regionSize / 2);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            }

            if (onResult) {
                onResult(resultCanvas);
            }

            setCloneCount(selected.length);
        } catch (err) {
            console.error('[Clone] Detection failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, sensitivity, minRegion, onResult]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Sensitivity: {sensitivity}</label>
                <ToolSlider min={1} max={10} value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))} />
            </div>

            <div className="tool-control-group">
                <label className="tool-control-label">Min Region Size: {minRegion}px</label>
                <ToolSlider min={8} max={128} step={8} value={minRegion}
                    onChange={(e) => setMinRegion(Number(e.target.value))} />
            </div>

            <ToolActionRow
                label="Detect Clones"
                onClick={analyse}
                isAnalysing={isAnalysing}
            />

            {cloneCount !== null && (
                <div className="tool-output-area">
                    <div className="tool-stat-label" style={{ textAlign: 'center', marginBottom: 0 }}>
                        Result shown in main view
                    </div>
                    <div className={`tool-verdict ${cloneCount > 5 ? 'tool-verdict-danger' : cloneCount > 0 ? 'tool-verdict-suspicious' : 'tool-verdict-safe'}`}>
                        Found {cloneCount} clone {cloneCount === 1 ? 'pair' : 'pairs'}
                    </div>
                </div>
            )}
        </div>
    );
};
