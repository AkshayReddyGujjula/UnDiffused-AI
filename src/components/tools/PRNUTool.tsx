import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';
import { LiquidSelect } from '../LiquidSelect';

interface PRNUToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

/**
 * PRNU (Photo Response Non-Uniformity) Tool
 * ===========================================
 * Extracts noise residual via wavelet-like denoising.
 * Real camera photos have a unique sensor fingerprint; AI images lack it.
 */
export const PRNUTool: React.FC<PRNUToolProps> = ({ targetImage, onResult }) => {
    const [filterLevel, setFilterLevel] = useState<'low' | 'medium' | 'high'>('medium');
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState<{ hasFingerprint: boolean; consistency: number; uniformity: number } | null>(null);

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setStats(null);
        setProgress(0);

        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
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
            const imageData = tempCtx.getImageData(0, 0, w, h);
            const pixels = imageData.data;

            // Convert to grayscale
            const gray = new Float64Array(w * h);
            for (let i = 0; i < w * h; i++) {
                gray[i] = 0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2];
            }

            setProgress(40);

            // Simple denoising via averaging filter (approximation of wavelet denoising)
            const kernelSize = filterLevel === 'low' ? 3 : filterLevel === 'medium' ? 5 : 7;
            const half = Math.floor(kernelSize / 2);
            const denoised = new Float64Array(w * h);

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let sum = 0;
                    let count = 0;
                    for (let ky = -half; ky <= half; ky++) {
                        for (let kx = -half; kx <= half; kx++) {
                            const ny = y + ky;
                            const nx = x + kx;
                            if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                                sum += gray[ny * w + nx];
                                count++;
                            }
                        }
                    }
                    denoised[y * w + x] = sum / count;
                }
            }

            setProgress(70);

            // Noise residual = original - denoised
            const noise = new Float64Array(w * h);
            for (let i = 0; i < w * h; i++) {
                noise[i] = gray[i] - denoised[i];
            }

            // Analyze noise pattern
            const blockSize = 32;
            const blocksX = Math.floor(w / blockSize);
            const blocksY = Math.floor(h / blockSize);
            const blockVariances: number[] = [];

            for (let by = 0; by < blocksY; by++) {
                for (let bx = 0; bx < blocksX; bx++) {
                    const values: number[] = [];
                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            values.push(noise[(by * blockSize + dy) * w + (bx * blockSize + dx)]);
                        }
                    }
                    const mean = values.reduce((a, b) => a + b, 0) / values.length;
                    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
                    blockVariances.push(variance);
                }
            }

            const meanVar = blockVariances.reduce((a, b) => a + b, 0) / blockVariances.length;
            const stdVar = Math.sqrt(blockVariances.reduce((a, b) => a + (b - meanVar) ** 2, 0) / blockVariances.length);
            const consistency = meanVar > 0 ? Math.min(100, (stdVar / meanVar) * 100) : 0;
            const uniformity = 100 - consistency;

            // Higher consistency = more likely real camera (fixed pattern noise)
            const hasFingerprint = consistency > 30;

            setStats({ hasFingerprint, consistency, uniformity });
            setProgress(90);

            // Render noise visualization to off-screen canvas
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;
            const outData = ctx.createImageData(w, h);

            let minN = Infinity, maxN = -Infinity;
            for (let i = 0; i < noise.length; i++) {
                if (noise[i] < minN) minN = noise[i];
                if (noise[i] > maxN) maxN = noise[i];
            }
            const range = maxN - minN || 1;

            for (let i = 0; i < w * h; i++) {
                const v = ((noise[i] - minN) / range) * 255;
                const idx = i * 4;
                // Amplify for visibility
                const amplified = Math.min(255, v * 3);
                outData.data[idx] = amplified;
                outData.data[idx + 1] = amplified;
                outData.data[idx + 2] = amplified;
                outData.data[idx + 3] = 255;
            }

            ctx.putImageData(outData, 0, 0);

            // Pass result up
            if (onResult) {
                onResult(resultCanvas);
            }

            setProgress(100);
            setStats({ hasFingerprint, consistency, uniformity });

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
                ⏱ Analysis may take a few seconds
            </p>

            <ToolActionRow
                label="Extract PRNU"
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
                            <p className="tool-stat-label">Pattern Consistency</p>
                            <p className="tool-stat-value">{stats.consistency.toFixed(1)}%</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Noise Uniformity</p>
                            <p className="tool-stat-value">{stats.uniformity.toFixed(1)}%</p>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.hasFingerprint ? 'tool-verdict-safe' : 'tool-verdict-danger'}`}>
                        {stats.hasFingerprint ? '✅ Sensor fingerprint detected — Authentic camera photo' : '❌ No sensor pattern found — Synthetic/AI-generated'}
                    </div>
                </div>
            )}
        </div>
    );
};
