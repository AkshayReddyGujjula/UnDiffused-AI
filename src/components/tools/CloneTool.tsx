import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';
import { ToolSlider } from './ToolSlider';

interface CloneToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

/**
 * Clone Detection Tool
 * =====================
 * Finds duplicated regions in an image using block matching.
 * Highlights clone pairs with matching colours and connecting lines.
 */
export const CloneTool: React.FC<CloneToolProps> = ({ targetImage, onResult }) => {
    const [sensitivity, setSensitivity] = useState(5);
    const [minRegion, setMinRegion] = useState(32);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [cloneCount, setCloneCount] = useState<number | null>(null);

    const hashBlock = (data: Uint8ClampedArray, w: number, bx: number, by: number, size: number): number => {
        let hash = 0;
        const step = Math.max(1, Math.floor(size / 8));
        for (let dy = 0; dy < size; dy += step) {
            for (let dx = 0; dx < size; dx += step) {
                const idx = ((by + dy) * w + (bx + dx)) * 4;
                const lum = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
                hash = ((hash << 5) - hash + Math.floor(lum / (12 - sensitivity))) | 0;
            }
        }
        return hash;
    };

    const blockSimilarity = (data: Uint8ClampedArray, w: number, ax: number, ay: number, bx: number, by: number, size: number): number => {
        let totalDiff = 0;
        let pixels = 0;
        const step = Math.max(1, Math.floor(size / 16));
        for (let dy = 0; dy < size; dy += step) {
            for (let dx = 0; dx < size; dx += step) {
                const idxA = ((ay + dy) * w + (ax + dx)) * 4;
                const idxB = ((by + dy) * w + (bx + dx)) * 4;
                totalDiff += Math.abs(data[idxA] - data[idxB]);
                totalDiff += Math.abs(data[idxA + 1] - data[idxB + 1]);
                totalDiff += Math.abs(data[idxA + 2] - data[idxB + 2]);
                pixels++;
            }
        }
        return 1 - totalDiff / (pixels * 3 * 255);
    };

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setCloneCount(null);

        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load'));
                img.src = targetImage;
            });

            const w = img.naturalWidth;
            const h = img.naturalHeight;

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.drawImage(img, 0, 0);
            const imageData = tempCtx.getImageData(0, 0, w, h);

            // Hash all blocks
            const step = Math.max(minRegion / 2, 8);
            const blockMap = new Map<number, { x: number; y: number }[]>();

            for (let by = 0; by + minRegion <= h; by += step) {
                for (let bx = 0; bx + minRegion <= w; bx += step) {
                    const hash = hashBlock(imageData.data, w, bx, by, minRegion);
                    if (!blockMap.has(hash)) blockMap.set(hash, []);
                    blockMap.get(hash)!.push({ x: bx, y: by });
                }
            }

            // Find clone pairs (blocks with same hash that are far apart)
            const clonePairs: { ax: number; ay: number; bx: number; by: number; sim: number }[] = [];
            const minDist = minRegion * 2;
            const threshold = 0.85 + (sensitivity - 5) * 0.01;

            for (const [, blocks] of blockMap) {
                if (blocks.length < 2 || blocks.length > 50) continue;
                for (let i = 0; i < blocks.length && i < 10; i++) {
                    for (let j = i + 1; j < blocks.length && j < 10; j++) {
                        const dist = Math.sqrt((blocks[i].x - blocks[j].x) ** 2 + (blocks[i].y - blocks[j].y) ** 2);
                        if (dist < minDist) continue;

                        const sim = blockSimilarity(imageData.data, w, blocks[i].x, blocks[i].y, blocks[j].x, blocks[j].y, minRegion);
                        if (sim >= threshold) {
                            clonePairs.push({
                                ax: blocks[i].x, ay: blocks[i].y,
                                bx: blocks[j].x, by: blocks[j].y,
                                sim
                            });
                        }
                    }
                }
            }

            // Render to off-screen canvas
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            // Draw clone pairs
            const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];
            const limitedPairs = clonePairs.slice(0, 30);

            limitedPairs.forEach((pair, idx) => {
                const color = colors[idx % colors.length];
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.7;

                // Draw rectangles
                ctx.strokeRect(pair.ax, pair.ay, minRegion, minRegion);
                ctx.strokeRect(pair.bx, pair.by, minRegion, minRegion);

                // Fill with translucent color
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.15;
                ctx.fillRect(pair.ax, pair.ay, minRegion, minRegion);
                ctx.fillRect(pair.bx, pair.by, minRegion, minRegion);

                // Connecting line
                ctx.globalAlpha = 0.4;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(pair.ax + minRegion / 2, pair.ay + minRegion / 2);
                ctx.lineTo(pair.bx + minRegion / 2, pair.by + minRegion / 2);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            });

            // Pass result up
            if (onResult) {
                onResult(resultCanvas);
            }

            setCloneCount(limitedPairs.length);
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
                        {cloneCount > 0 ? '🎯' : '✅'} Found {cloneCount} clone {cloneCount === 1 ? 'pair' : 'pairs'}
                    </div>
                </div>
            )}
        </div>
    );
};
