import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';

interface CompressionToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

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

            const w = img.naturalWidth;
            const h = img.naturalHeight;

            const tc = document.createElement('canvas');
            tc.width = w;
            tc.height = h;
            const tctx = tc.getContext('2d')!;
            tctx.drawImage(img, 0, 0);
            const px = tctx.getImageData(0, 0, w, h).data;

            const bs = 8;
            const bx = Math.floor(w / bs);
            const by = Math.floor(h / bs);
            const bq: number[] = [];

            for (let iy = 0; iy < by; iy++) {
                for (let ix = 0; ix < bx; ix++) {
                    let diff = 0;
                    let cnt = 0;

                    // Horizontal boundaries
                    if (ix < bx - 1) {
                        for (let d = 0; d < bs; d++) {
                            const py = iy * bs + d;
                            const p1 = (py * w + (ix + 1) * bs - 1) * 4;
                            const p2 = p1 + 4;
                            diff += Math.abs(px[p1] - px[p2]) + Math.abs(px[p1 + 1] - px[p2 + 1]) + Math.abs(px[p1 + 2] - px[p2 + 2]);
                            cnt++;
                        }
                    }

                    // Vertical boundaries
                    if (iy < by - 1) {
                        for (let d = 0; d < bs; d++) {
                            const px2 = ix * bs + d;
                            const py1 = (iy + 1) * bs - 1;
                            const py2_ = py1 + 1;
                            const i1 = (py1 * w + px2) * 4;
                            const i2 = (py2_ * w + px2) * 4;
                            diff += Math.abs(px[i1] - px[i2]) + Math.abs(px[i1 + 1] - px[i2 + 1]) + Math.abs(px[i1 + 2] - px[i2 + 2]);
                            cnt++;
                        }
                    }
                    bq.push(cnt > 0 ? diff / (cnt * 3) : 0);
                }
            }

            const mean = bq.reduce((a, b) => a + b, 0) / bq.length;
            const std = Math.sqrt(bq.reduce((a, b) => a + (b - mean) ** 2, 0) / bq.length);

            let incon = 0;
            for (const q of bq) {
                if (Math.abs(q - mean) > std * 2) incon++;
            }

            const quality = Math.max(10, Math.min(100, 100 - mean * 2));
            const layers = incon > bx * by * 0.1 ? 2 : 1;

            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            const maxQ = Math.max(...bq);
            for (let iy = 0; iy < by; iy++) {
                for (let ix = 0; ix < bx; ix++) {
                    const n = maxQ > 0 ? bq[iy * bx + ix] / maxQ : 0;
                    const r = n < 0.33 ? 0 : n < 0.66 ? 200 : 220;
                    const g = n < 0.33 ? 180 : n < 0.66 ? 180 : 50;
                    ctx.fillStyle = `rgba(${r},${g},0,0.3)`;
                    ctx.fillRect(ix * bs, iy * bs, bs, bs);
                    if (showGrid) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
                        ctx.lineWidth = 0.5;
                        ctx.strokeRect(ix * bs, iy * bs, bs, bs);
                    }
                }
            }

            // Pass result up
            if (onResult) {
                onResult(resultCanvas);
            }

            setStats({ quality, layers, inconsistent: incon });
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
                    <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Show 8×8 DCT block grid
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
                        <div className="tool-stat"><p className="tool-stat-label">Est. Quality</p><p className="tool-stat-value">{stats.quality.toFixed(0)}%</p></div>
                        <div className="tool-stat"><p className="tool-stat-label">Layers</p><p className="tool-stat-value">{stats.layers}</p></div>
                    </div>
                    <div className={`tool-verdict ${stats.layers > 1 ? 'tool-verdict-suspicious' : 'tool-verdict-safe'}`}>
                        {stats.layers > 1 ? `⚠️ Multiple re-compressions (${stats.inconsistent} inconsistent blocks)` : '✅ Single compression — consistent'}
                    </div>
                </div>
            )}
        </div>
    );
};
