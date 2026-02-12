import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';
import { LiquidSelect } from '../LiquidSelect';

interface PRNUToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

type PrnuStats = {
    consistency: number;
    textureLeak: number;
    residualStrength: number;
};

/**
 * PRNU-style residual analysis.
 * This is a single-image approximation and does not identify camera model.
 */
export const PRNUTool: React.FC<PRNUToolProps> = ({ targetImage, onResult }) => {
    const [filterLevel, setFilterLevel] = useState<'low' | 'medium' | 'high'>('medium');
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState<PrnuStats | null>(null);

    const blur3x3 = (src: Float32Array, w: number, h: number): Float32Array => {
        const out = new Float32Array(w * h);
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = y * w + x;
                out[i] = (
                    src[i - w - 1] + 2 * src[i - w] + src[i - w + 1] +
                    2 * src[i - 1] + 4 * src[i] + 2 * src[i + 1] +
                    src[i + w - 1] + 2 * src[i + w] + src[i + w + 1]
                ) / 16;
            }
        }
        return out;
    };

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setStats(null);
        setProgress(0);

        try {
            const img = new Image();

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load'));
                img.src = targetImage;
            });

            setProgress(20);

            const w = img.naturalWidth;
            const h = img.naturalHeight;

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.drawImage(img, 0, 0);
            const rgba = tempCtx.getImageData(0, 0, w, h).data;

            const gray = new Float32Array(w * h);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                gray[i] = 0.299 * rgba[idx] + 0.587 * rgba[idx + 1] + 0.114 * rgba[idx + 2];
            }

            setProgress(40);

            let denoised = blur3x3(gray, w, h);
            if (filterLevel !== 'low') denoised = blur3x3(denoised, w, h);
            if (filterLevel === 'high') denoised = blur3x3(denoised, w, h);

            setProgress(60);

            // Residual normalized by signal level (PRNU is multiplicative).
            const residual = new Float32Array(w * h);
            let residualAbsSum = 0;
            for (let i = 0; i < w * h; i++) {
                const value = (gray[i] - denoised[i]) / Math.max(1, gray[i]);
                residual[i] = value;
                residualAbsSum += Math.abs(value);
            }

            // Local stationarity check via block variance consistency.
            const blockSize = 32;
            const blocksX = Math.floor(w / blockSize);
            const blocksY = Math.floor(h / blockSize);
            if (blocksX < 1 || blocksY < 1) {
                throw new Error('Image too small for PRNU block analysis');
            }

            const blockVariances: number[] = [];
            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    let sum = 0;
                    let sumSq = 0;
                    const count = blockSize * blockSize;
                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const value = residual[(by * blockSize + dy) * w + (bx * blockSize + dx)];
                            sum += value;
                            sumSq += value * value;
                        }
                    }
                    const mean = sum / count;
                    const variance = Math.max(0, sumSq / count - mean * mean);
                    blockVariances.push(variance);
                }
            }

            const meanVar = blockVariances.reduce((a, b) => a + b, 0) / blockVariances.length;
            const stdVar = Math.sqrt(blockVariances.reduce((a, b) => a + (b - meanVar) ** 2, 0) / blockVariances.length);
            const consistency = Math.max(0, Math.min(100, (1 - Math.min(stdVar / Math.max(meanVar, 1e-9), 2) / 2) * 100));

            setProgress(75);

            // Scene leakage: correlation between edge strength and residual magnitude.
            const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
            const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
            const edge = new Float32Array(w * h);
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    let gx = 0;
                    let gy = 0;
                    let k = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const v = gray[(y + ky) * w + (x + kx)];
                            gx += v * sobelX[k];
                            gy += v * sobelY[k];
                            k++;
                        }
                    }
                    edge[y * w + x] = Math.sqrt(gx * gx + gy * gy);
                }
            }

            let meanEdge = 0;
            let meanRes = 0;
            for (let i = 0; i < edge.length; i++) {
                meanEdge += edge[i];
                meanRes += Math.abs(residual[i]);
            }
            meanEdge /= edge.length;
            meanRes /= residual.length;

            let cov = 0;
            let varEdge = 0;
            let varRes = 0;
            for (let i = 0; i < edge.length; i++) {
                const de = edge[i] - meanEdge;
                const dr = Math.abs(residual[i]) - meanRes;
                cov += de * dr;
                varEdge += de * de;
                varRes += dr * dr;
            }
            const corr = cov / Math.sqrt(Math.max(1e-12, varEdge * varRes));
            const textureLeak = Math.max(0, Math.min(100, Math.abs(corr) * 100));

            setProgress(90);

            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;
            const outData = ctx.createImageData(w, h);

            let maxAbs = 0;
            for (let i = 0; i < residual.length; i++) {
                const v = Math.abs(residual[i]);
                if (v > maxAbs) maxAbs = v;
            }
            const denom = maxAbs || 1;

            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                // Centered grayscale around zero residual.
                const normalized = residual[i] / denom;
                const mapped = Math.round((normalized * 0.5 + 0.5) * 255);
                outData.data[idx] = mapped;
                outData.data[idx + 1] = mapped;
                outData.data[idx + 2] = mapped;
                outData.data[idx + 3] = 255;
            }

            ctx.putImageData(outData, 0, 0);

            if (onResult) {
                onResult(resultCanvas);
            }

            setProgress(100);
            setStats({
                consistency,
                textureLeak,
                residualStrength: residualAbsSum / residual.length
            });
        } catch (err) {
            console.error('[PRNU] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, filterLevel, onResult]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Filter Level</label>
                <LiquidSelect
                    value={filterLevel}
                    onChange={(val) => setFilterLevel(val as 'low' | 'medium' | 'high')}
                    options={[
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' }
                    ]}
                />
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '8px 0' }}>
                PRNU-like analysis only. Camera model identification is not performed.
            </p>

            <ToolActionRow
                label="Extract Residual"
                onClick={analyse}
                isAnalysing={isAnalysing}
            />

            {isAnalysing && (
                <div className="tool-progress-bar" style={{ marginTop: 8 }}>
                    <div className="tool-progress-fill" style={{ width: `${progress}%` }} />
                </div>
            )}

            {stats && (
                <div className="tool-output-area">
                    <div className="tool-stat-label" style={{ textAlign: 'center', marginBottom: 0 }}>
                        Result shown in main view
                    </div>
                    <div className="tool-stats">
                        <div className="tool-stat">
                            <p className="tool-stat-label">Consistency</p>
                            <p className="tool-stat-value">{stats.consistency.toFixed(1)}%</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Texture Leak</p>
                            <p className="tool-stat-value">{stats.textureLeak.toFixed(1)}%</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Residual Strength</p>
                            <p className="tool-stat-value">{stats.residualStrength.toFixed(4)}</p>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.textureLeak > 60 ? 'tool-verdict-danger' : stats.consistency > 55 ? 'tool-verdict-safe' : 'tool-verdict-suspicious'}`}>
                        {stats.textureLeak > 60
                            ? 'Residual is strongly coupled to scene content (inconclusive for PRNU)'
                            : stats.consistency > 55
                                ? 'Residual stationarity is moderately consistent with camera-like noise'
                                : 'Residual pattern is weak or inconsistent'}
                    </div>
                </div>
            )}
        </div>
    );
};
