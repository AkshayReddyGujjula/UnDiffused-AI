import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';
import { ToolSlider } from './ToolSlider';
import { LiquidSelect } from '../LiquidSelect';

interface NoiseToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

/**
 * Noise Pattern Analysis Tool
 * ===========================
 * Estimates local noise by applying a high-pass (Laplacian) residual
 * and measuring variance consistency across blocks.
 */
export const NoiseTool: React.FC<NoiseToolProps> = ({ targetImage, onResult }) => {
    const [noiseType, setNoiseType] = useState<'luminance' | 'chromatic' | 'both'>('luminance');
    const [blockSize, setBlockSize] = useState(16);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ mean: number; std: number; uniformity: number } | null>(null);

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setStats(null);

        try {
            const img = new Image();

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = targetImage;
            });

            const w = img.naturalWidth;
            const h = img.naturalHeight;
            const effectiveBlockSize = Math.max(8, Math.min(blockSize, w, h));

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.drawImage(img, 0, 0);
            const imageData = tempCtx.getImageData(0, 0, w, h);
            const pixels = imageData.data;

            const getSignal = (index: number): number => {
                const luminance = 0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2];
                const chromatic = Math.abs(pixels[index] - pixels[index + 1]) + Math.abs(pixels[index + 1] - pixels[index + 2]);

                if (noiseType === 'chromatic') return chromatic;
                if (noiseType === 'both') return luminance * 0.7 + chromatic * 0.3;
                return luminance;
            };

            const signal = new Float64Array(w * h);
            for (let i = 0; i < w * h; i++) {
                signal[i] = getSignal(i * 4);
            }

            // High-pass residual with an 8-neighbor Laplacian kernel.
            const residual = new Float64Array(w * h);
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const idx = y * w + x;
                    const center = signal[idx];
                    residual[idx] =
                        8 * center
                        - signal[idx - 1] - signal[idx + 1]
                        - signal[idx - w] - signal[idx + w]
                        - signal[idx - w - 1] - signal[idx - w + 1]
                        - signal[idx + w - 1] - signal[idx + w + 1];
                }
            }

            const blocksX = Math.floor(w / effectiveBlockSize);
            const blocksY = Math.floor(h / effectiveBlockSize);
            if (blocksX < 1 || blocksY < 1) {
                throw new Error('Image too small for selected block size');
            }

            const variances: number[] = [];
            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    let sum = 0;
                    let sumSq = 0;
                    const count = effectiveBlockSize * effectiveBlockSize;

                    for (let dy = 0; dy < effectiveBlockSize; dy++) {
                        for (let dx = 0; dx < effectiveBlockSize; dx++) {
                            const px = bx * effectiveBlockSize + dx;
                            const py = by * effectiveBlockSize + dy;
                            const value = residual[py * w + px];
                            sum += value;
                            sumSq += value * value;
                        }
                    }

                    const mean = sum / count;
                    const variance = Math.max(0, sumSq / count - mean * mean);
                    variances.push(variance);
                }
            }

            const meanVar = variances.reduce((a, b) => a + b, 0) / variances.length;
            const stdVar = Math.sqrt(variances.reduce((a, b) => a + (b - meanVar) ** 2, 0) / variances.length);
            const cv = stdVar / Math.max(meanVar, 1e-6);
            const uniformity = Math.max(0, Math.min(100, (1 - Math.min(cv, 1.5) / 1.5) * 100));

            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;

            ctx.globalAlpha = 0.3;
            ctx.drawImage(img, 0, 0);
            ctx.globalAlpha = 1;

            const sorted = [...variances].sort((a, b) => a - b);
            const p90 = sorted[Math.floor(sorted.length * 0.9)] ?? sorted[sorted.length - 1] ?? 1;
            const minVar = sorted[0] ?? 0;
            const range = Math.max(1e-6, p90 - minVar);

            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    const value = variances[by * blocksX + bx];
                    const normalized = Math.max(0, Math.min(1, (value - minVar) / range));

                    // Low variance = red (suspicious), high variance = green (natural).
                    const r = Math.floor(255 * (1 - normalized));
                    const g = Math.floor(255 * normalized);
                    ctx.fillStyle = `rgba(${r}, ${g}, 60, 0.5)`;
                    ctx.fillRect(bx * effectiveBlockSize, by * effectiveBlockSize, effectiveBlockSize, effectiveBlockSize);

                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.strokeRect(bx * effectiveBlockSize, by * effectiveBlockSize, effectiveBlockSize, effectiveBlockSize);
                }
            }

            if (onResult) {
                onResult(resultCanvas);
            }

            setStats({ mean: meanVar, std: stdVar, uniformity });
        } catch (err) {
            console.error('[Noise] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, noiseType, blockSize, onResult]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Noise Type</label>
                <LiquidSelect
                    value={noiseType}
                    onChange={(val) => setNoiseType(val as 'luminance' | 'chromatic' | 'both')}
                    options={[
                        { label: 'Luminance', value: 'luminance' },
                        { label: 'Chromatic', value: 'chromatic' },
                        { label: 'Both', value: 'both' }
                    ]}
                />
            </div>

            <div className="tool-control-group">
                <label className="tool-control-label">Block Size: {blockSize}px</label>
                <ToolSlider min={8} max={64} step={8} value={blockSize}
                    onChange={(e) => setBlockSize(Number(e.target.value))} />
            </div>

            <ToolActionRow
                label="Analyse Noise"
                onClick={analyse}
                isAnalysing={isAnalysing}
            />

            {stats && (
                <div className="tool-output-area">
                    <div className="tool-stat-label" style={{ textAlign: 'center', marginBottom: 0 }}>
                        Result shown in main view
                    </div>
                    <div className="tool-stats">
                        <div className="tool-stat">
                            <div className="tool-stat-label">Mean Variance</div>
                            <div className="tool-stat-value">{stats.mean.toFixed(2)}</div>
                        </div>
                        <div className="tool-stat">
                            <div className="tool-stat-label">Std Deviation</div>
                            <div className="tool-stat-value">{stats.std.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.uniformity > 75 ? 'tool-verdict-danger' : stats.uniformity > 55 ? 'tool-verdict-suspicious' : 'tool-verdict-safe'}`}>
                        Uniformity: {stats.uniformity.toFixed(1)}% - {stats.uniformity > 75 ? 'Highly uniform residuals (AI suspect)' : stats.uniformity > 55 ? 'Moderately uniform residuals' : 'Natural local noise variation'}
                    </div>
                </div>
            )}
        </div>
    );
};
