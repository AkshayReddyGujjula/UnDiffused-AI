import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';

interface CompressionToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

const JPEG_LUMA_Q50 = [
    16, 11, 10, 16, 24, 40, 51, 61,
    12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56,
    14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77,
    24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101,
    72, 92, 95, 98, 112, 100, 103, 99
];

const AC_INDICES = Array.from({ length: 64 }, (_, i) => i).filter((i) => i !== 0);

const buildQuantMatrix = (quality: number): number[] => {
    const q = Math.max(1, Math.min(100, quality));
    const scale = q < 50 ? Math.floor(5000 / q) : 200 - q * 2;
    return JPEG_LUMA_Q50.map((v) => Math.max(1, Math.min(255, Math.floor((v * scale + 50) / 100))));
};

/**
 * Compression analysis via 8x8 DCT quantization residuals.
 */
export const CompressionTool: React.FC<CompressionToolProps> = ({ targetImage, onResult }) => {
    const [showGrid, setShowGrid] = useState(true);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ quality: number; layers: number; inconsistent: number } | null>(null);

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setStats(null);
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

            const tc = document.createElement('canvas');
            tc.width = w;
            tc.height = h;
            const tctx = tc.getContext('2d')!;
            tctx.drawImage(img, 0, 0, w, h);
            const rgba = tctx.getImageData(0, 0, w, h).data;

            const luminance = new Float32Array(w * h);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                luminance[i] = 0.299 * rgba[idx] + 0.587 * rgba[idx + 1] + 0.114 * rgba[idx + 2] - 128;
            }

            const bs = 8;
            const blocksX = Math.floor(w / bs);
            const blocksY = Math.floor(h / bs);
            const blockCount = blocksX * blocksY;
            if (blockCount < 16) {
                throw new Error('Image too small for 8x8 compression analysis');
            }

            const cos = Array.from({ length: 8 }, (_, u) =>
                Array.from({ length: 8 }, (_, x) => Math.cos(((2 * x + 1) * u * Math.PI) / 16))
            );
            const c = (u: number): number => (u === 0 ? 1 / Math.sqrt(2) : 1);

            // Collect per-block AC DCT coefficients.
            const blockAC: Float32Array[] = [];
            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    const coeffs = new Float32Array(64);
                    for (let v = 0; v < 8; v++) {
                        for (let u = 0; u < 8; u++) {
                            let sum = 0;
                            for (let y = 0; y < 8; y++) {
                                for (let x = 0; x < 8; x++) {
                                    const px = bx * bs + x;
                                    const py = by * bs + y;
                                    sum += luminance[py * w + px] * cos[u][x] * cos[v][y];
                                }
                            }
                            coeffs[v * 8 + u] = 0.25 * c(u) * c(v) * sum;
                        }
                    }

                    const ac = new Float32Array(63);
                    for (let i = 0; i < AC_INDICES.length; i++) {
                        ac[i] = coeffs[AC_INDICES[i]];
                    }
                    blockAC.push(ac);
                }
            }

            const candidates = [50, 60, 70, 80, 90, 95];
            let bestQuality = candidates[0];
            let bestMean = Number.POSITIVE_INFINITY;
            let bestScores: number[] = [];

            for (const q of candidates) {
                const qMat = buildQuantMatrix(q);
                const qAc = AC_INDICES.map((idx) => qMat[idx]);
                const scores: number[] = new Array(blockCount);

                let sumScore = 0;
                for (let b = 0; b < blockCount; b++) {
                    const coeffs = blockAC[b];
                    let residual = 0;
                    for (let i = 0; i < coeffs.length; i++) {
                        const step = qAc[i];
                        const coeff = coeffs[i];
                        residual += Math.abs(coeff - Math.round(coeff / step) * step) / step;
                    }
                    const score = residual / coeffs.length;
                    scores[b] = score;
                    sumScore += score;
                }

                const meanScore = sumScore / blockCount;
                if (meanScore < bestMean) {
                    bestMean = meanScore;
                    bestQuality = q;
                    bestScores = scores;
                }
            }

            const mean = bestScores.reduce((a, b) => a + b, 0) / bestScores.length;
            const std = Math.sqrt(bestScores.reduce((a, b) => a + (b - mean) ** 2, 0) / bestScores.length);
            const inconsistencyThreshold = mean + 1.5 * std;
            const inconsistent = bestScores.filter((s) => s > inconsistencyThreshold).length;
            const layers = inconsistent / bestScores.length > 0.12 ? 2 : 1;

            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = srcW;
            resultCanvas.height = srcH;
            const ctx = resultCanvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            const maxScore = Math.max(...bestScores);
            const minScore = Math.min(...bestScores);
            const range = Math.max(1e-6, maxScore - minScore);

            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    const normalized = (bestScores[by * blocksX + bx] - minScore) / range;
                    const r = Math.floor(255 * normalized);
                    const g = Math.floor(210 * (1 - normalized));

                    const x = (bx * bs) / scale;
                    const y = (by * bs) / scale;
                    const cellW = bs / scale;
                    const cellH = bs / scale;

                    ctx.fillStyle = `rgba(${r},${g},20,0.34)`;
                    ctx.fillRect(x, y, cellW, cellH);

                    if (showGrid) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
                        ctx.lineWidth = 0.6;
                        ctx.strokeRect(x, y, cellW, cellH);
                    }
                }
            }

            if (onResult) {
                onResult(resultCanvas);
            }

            setStats({ quality: bestQuality, layers, inconsistent });
        } catch (e) {
            console.error('[Compression]', e);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, showGrid, onResult]);

    return (
        <div>
            <div className="tool-control-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#cbd5e1' }}>
                    <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Show 8x8 DCT block grid
                </label>
            </div>
            <ToolActionRow
                label="Analyse Compression"
                onClick={analyse}
                isAnalysing={isAnalysing}
            />
            {stats && (
                <div className="tool-output-area">
                    <div className="tool-stat-label" style={{ textAlign: 'center', marginBottom: 0 }}>
                        Result shown in main view
                    </div>
                    <div className="tool-stats">
                        <div className="tool-stat"><p className="tool-stat-label">Estimated JPEG Q</p><p className="tool-stat-value">{stats.quality.toFixed(0)}</p></div>
                        <div className="tool-stat"><p className="tool-stat-label">Layers</p><p className="tool-stat-value">{stats.layers}</p></div>
                    </div>
                    <div className={`tool-verdict ${stats.layers > 1 ? 'tool-verdict-suspicious' : 'tool-verdict-safe'}`}>
                        {stats.layers > 1 ? `Potential re-compression inconsistency (${stats.inconsistent} blocks)` : 'Quantization pattern mostly consistent'}
                    </div>
                </div>
            )}
        </div>
    );
};
