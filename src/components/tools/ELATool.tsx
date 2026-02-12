import React, { useState, useCallback } from 'react';
import { LiquidSelect } from '../LiquidSelect';
import { ToolActionRow } from './ToolActionRow';
import { ToolSlider } from './ToolSlider';

interface ELAToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

/**
 * Error Level Analysis Tool
 * ==========================
 * Re-compresses image at a given quality level and computes
 * pixel-wise absolute difference to reveal compression inconsistencies.
 */
export const ELATool: React.FC<ELAToolProps> = ({ targetImage, onResult }) => {
    const [quality, setQuality] = useState(95);
    const [sensitivity, setSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
    const [isAnalysing, setIsAnalysing] = useState(false);

    // Stats for local display
    const [stats, setStats] = useState<{ diffScore: number } | null>(null);

    const sensitivityMultiplier = sensitivity === 'low' ? 16 : sensitivity === 'medium' ? 28 : 40;

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

            // Draw original
            const origCanvas = document.createElement('canvas');
            origCanvas.width = w;
            origCanvas.height = h;
            const origCtx = origCanvas.getContext('2d')!;
            origCtx.drawImage(img, 0, 0);
            const originalData = origCtx.getImageData(0, 0, w, h);

            // Re-compress via JPEG
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.drawImage(img, 0, 0);

            const jpegDataUrl = tempCanvas.toDataURL('image/jpeg', quality / 100);

            // Load re-compressed
            const recompImg = new Image();
            await new Promise<void>((resolve, reject) => {
                recompImg.onload = () => resolve();
                recompImg.onerror = () => reject(new Error('Failed to decode recompressed JPEG'));
                recompImg.src = jpegDataUrl;
            });

            tempCtx.drawImage(recompImg, 0, 0);
            const recompData = tempCtx.getImageData(0, 0, w, h);

            // Compute ELA difference
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;
            const outData = ctx.createImageData(w, h);

            // Histogram of per-pixel residual intensity for robust scaling.
            const histogram = new Uint32Array(256);
            const residuals = new Uint16Array(w * h);
            let totalDiff = 0;

            for (let i = 0; i < originalData.data.length; i += 4) {
                const dr = Math.abs(originalData.data[i] - recompData.data[i]);
                const dg = Math.abs(originalData.data[i + 1] - recompData.data[i + 1]);
                const db = Math.abs(originalData.data[i + 2] - recompData.data[i + 2]);

                const residual = Math.round((dr + dg + db) / 3);
                residuals[i >> 2] = residual;
                histogram[residual] += 1;
                totalDiff += residual;
            }

            // Robust normalizer: 95th percentile keeps extreme spikes from washing out map contrast.
            const totalPixels = w * h;
            const p95Target = Math.floor(totalPixels * 0.95);
            let cumulative = 0;
            let p95 = 1;
            for (let v = 0; v < histogram.length; v++) {
                cumulative += histogram[v];
                if (cumulative >= p95Target) {
                    p95 = Math.max(1, v);
                    break;
                }
            }

            for (let i = 0; i < residuals.length; i++) {
                const idx = i * 4;
                const boosted = Math.min(1, (residuals[i] * sensitivityMultiplier) / (p95 * 28));
                const gammaEnhanced = Math.pow(boosted, 0.65);

                // Forensic palette: black -> red -> orange -> yellow -> white.
                let r = 0;
                let g = 0;
                let b = 0;
                if (gammaEnhanced < 0.25) {
                    r = Math.floor((gammaEnhanced / 0.25) * 180);
                } else if (gammaEnhanced < 0.5) {
                    r = Math.floor(180 + ((gammaEnhanced - 0.25) / 0.25) * 75);
                    g = Math.floor(((gammaEnhanced - 0.25) / 0.25) * 80);
                } else if (gammaEnhanced < 0.75) {
                    r = 255;
                    g = Math.floor(80 + ((gammaEnhanced - 0.5) / 0.25) * 120);
                    b = Math.floor(((gammaEnhanced - 0.5) / 0.25) * 30);
                } else {
                    r = 255;
                    g = Math.floor(200 + ((gammaEnhanced - 0.75) / 0.25) * 55);
                    b = Math.floor(30 + ((gammaEnhanced - 0.75) / 0.25) * 225);
                }

                outData.data[idx] = r;
                outData.data[idx + 1] = g;
                outData.data[idx + 2] = b;
                outData.data[idx + 3] = 255;
            }

            ctx.putImageData(outData, 0, 0);

            // Pass result up
            if (onResult) {
                onResult(resultCanvas);
            }

            setStats({ diffScore: totalDiff / totalPixels });

        } catch (err) {
            console.error('[ELA] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, quality, sensitivityMultiplier, onResult]);

    return (
        <div>
            {/* Quality slider */}
            <div className="tool-control-group">
                <label className="tool-control-label">JPEG Quality: {quality}%</label>
                <ToolSlider
                    min={50}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                />
            </div>

            {/* Sensitivity */}
            <div className="tool-control-group">
                <label className="tool-control-label">Sensitivity</label>
                <LiquidSelect
                    value={sensitivity}
                    onChange={(val) => setSensitivity(val as 'low' | 'medium' | 'high')}
                    options={[
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' }
                    ]}
                />
            </div>

            {/* Analyse button */}
            <ToolActionRow
                label="Analyse Error Levels"
                onClick={analyse}
                isAnalysing={isAnalysing}
            />

            {/* Stats */}
            {stats && (
                <div className="tool-output-area">
                    <div className="tool-stat-label" style={{ textAlign: 'center', marginBottom: 0 }}>
                        Result shown in main view
                    </div>
                    <div className="tool-stats">
                        <div className="tool-stat">
                            <div className="tool-stat-label">Difference Score</div>
                            <div className="tool-stat-value">{stats.diffScore.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
