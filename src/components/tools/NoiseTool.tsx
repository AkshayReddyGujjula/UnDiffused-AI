import React, { useState, useRef, useCallback } from 'react';
import { LiquidSelect } from '../LiquidSelect';

interface NoiseToolProps {
    targetImage: string;
}

/**
 * Noise Pattern Analysis Tool
 * ============================
 * Divides image into blocks, computes noise variance per block
 * using a high-pass filter. Uniform noise = AI suspect.
 */
export const NoiseTool: React.FC<NoiseToolProps> = ({ targetImage }) => {
    const [noiseType, setNoiseType] = useState<'luminance' | 'chromatic' | 'both'>('luminance');
    const [blockSize, setBlockSize] = useState(32);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ mean: number; std: number; uniformity: number } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const resultRef = useRef<HTMLCanvasElement | null>(null);

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setStats(null);

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
            const pixels = imageData.data;

            // Convert to luminance or use specific channel
            const getLuminance = (i: number) => {
                if (noiseType === 'chromatic') {
                    return (pixels[i] - pixels[i + 1]) * 0.5 + 128;
                }
                return 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
            };

            // Compute block variances
            const blocksX = Math.floor(w / blockSize);
            const blocksY = Math.floor(h / blockSize);
            const variances: number[] = [];

            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    const values: number[] = [];
                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const px = bx * blockSize + dx;
                            const py = by * blockSize + dy;
                            const idx = (py * w + px) * 4;

                            // High-pass: difference from neighbors
                            const center = getLuminance(idx);
                            let neighborSum = 0;
                            let count = 0;
                            for (const [nx, ny] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                                const npx = px + nx;
                                const npy = py + ny;
                                if (npx >= 0 && npx < w && npy >= 0 && npy < h) {
                                    neighborSum += getLuminance((npy * w + npx) * 4);
                                    count++;
                                }
                            }
                            const noise = center - neighborSum / count;
                            values.push(noise);
                        }
                    }

                    // Compute variance
                    const mean = values.reduce((a, b) => a + b, 0) / values.length;
                    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
                    variances.push(variance);
                }
            }

            // Statistics
            const meanVar = variances.reduce((a, b) => a + b, 0) / variances.length;
            const stdVar = Math.sqrt(variances.reduce((a, b) => a + (b - meanVar) ** 2, 0) / variances.length);
            const uniformity = Math.max(0, 100 - (stdVar / meanVar) * 100);

            setStats({ mean: meanVar, std: stdVar, uniformity });

            // Render heat map to off-screen canvas
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;

            // Draw original dimmed
            ctx.globalAlpha = 0.3;
            ctx.drawImage(img, 0, 0);
            ctx.globalAlpha = 1;

            const maxVar = Math.max(...variances);

            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    const v = variances[by * blocksX + bx];
                    const normalized = maxVar > 0 ? v / maxVar : 0;

                    // Low variance = red (suspicious), high = green (natural)
                    const r = Math.floor(255 * (1 - normalized));
                    const g = Math.floor(255 * normalized);

                    ctx.fillStyle = `rgba(${r}, ${g}, 60, 0.5)`;
                    ctx.fillRect(bx * blockSize, by * blockSize, blockSize, blockSize);
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.strokeRect(bx * blockSize, by * blockSize, blockSize, blockSize);
                }
            }

            resultRef.current = resultCanvas;
            setStats({ mean: meanVar, std: stdVar, uniformity });
        } catch (err) {
            console.error('[Noise] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, noiseType, blockSize]);

    // Draw result
    React.useEffect(() => {
        if (stats && resultRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                canvasRef.current.width = resultRef.current.width;
                canvasRef.current.height = resultRef.current.height;
                ctx.drawImage(resultRef.current, 0, 0);
            }
        }
    }, [stats]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Noise Type</label>
                <LiquidSelect
                    value={noiseType}
                    onChange={(val) => setNoiseType(val as any)}
                    options={[
                        { label: 'Luminance', value: 'luminance' },
                        { label: 'Chromatic', value: 'chromatic' },
                        { label: 'Both', value: 'both' }
                    ]}
                />
            </div>

            <div className="tool-control-group">
                <label className="tool-control-label">Block Size: {blockSize}px</label>
                <input type="range" className="tool-slider" min="8" max="64" step="8" value={blockSize}
                    onChange={(e) => setBlockSize(Number(e.target.value))} />
            </div>

            <button className={`tool-analyse-btn ${isAnalysing ? 'tool-loading' : ''}`}
                onClick={analyse} disabled={isAnalysing}>
                {isAnalysing ? 'Analysing...' : '📡 Analyse Noise'}
            </button>

            {stats && (
                <div className="tool-output-area">
                    <canvas ref={canvasRef} className="tool-output-canvas" />
                    <div className="tool-stats">
                        <div className="tool-stat">
                            <p className="tool-stat-label">Mean Variance</p>
                            <p className="tool-stat-value">{stats.mean.toFixed(2)}</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Std Deviation</p>
                            <p className="tool-stat-value">{stats.std.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.uniformity > 70 ? 'tool-verdict-danger' : stats.uniformity > 40 ? 'tool-verdict-suspicious' : 'tool-verdict-safe'}`}>
                        {stats.uniformity > 70 ? '⚠️' : stats.uniformity > 40 ? '🤔' : '✅'}
                        {' '}Uniformity: {stats.uniformity.toFixed(1)}% — {stats.uniformity > 70 ? 'Uniform noise (AI suspect)' : stats.uniformity > 40 ? 'Moderate uniformity' : 'Natural variance (Real)'}
                    </div>
                </div>
            )}

            {!stats && <canvas ref={canvasRef} style={{ display: 'none' }} />}
        </div>
    );
};
