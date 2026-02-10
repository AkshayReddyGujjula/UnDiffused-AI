import React, { useState, useRef, useCallback } from 'react';
import { LiquidSelect } from '../LiquidSelect';

interface ELAToolProps {
    targetImage: string;
}

/**
 * Error Level Analysis Tool
 * ==========================
 * Re-compresses image at a given quality level and computes
 * pixel-wise absolute difference to reveal compression inconsistencies.
 */
export const ELATool: React.FC<ELAToolProps> = ({ targetImage }) => {
    const [quality, setQuality] = useState(85);
    const [sensitivity, setSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [opacity, setOpacity] = useState(100);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const originalRef = useRef<HTMLCanvasElement>(null);

    const sensitivityMultiplier = sensitivity === 'low' ? 10 : sensitivity === 'medium' ? 20 : 40;

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setHasResult(false);

        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = targetImage;
            });

            const w = img.naturalWidth;
            const h = img.naturalHeight;

            // Draw original
            const origCanvas = originalRef.current;
            if (!origCanvas) return;
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
            await new Promise<void>((resolve) => {
                recompImg.onload = () => resolve();
                recompImg.src = jpegDataUrl;
            });

            tempCtx.drawImage(recompImg, 0, 0);
            const recompData = tempCtx.getImageData(0, 0, w, h);

            // Compute ELA difference
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d')!;
            const outData = ctx.createImageData(w, h);

            for (let i = 0; i < originalData.data.length; i += 4) {
                const dr = Math.abs(originalData.data[i] - recompData.data[i]);
                const dg = Math.abs(originalData.data[i + 1] - recompData.data[i + 1]);
                const db = Math.abs(originalData.data[i + 2] - recompData.data[i + 2]);

                // Amplify differences
                const r = Math.min(255, dr * sensitivityMultiplier);
                const g = Math.min(255, dg * sensitivityMultiplier);
                const b = Math.min(255, db * sensitivityMultiplier);

                // Heat map coloring
                const intensity = (r + g + b) / 3;
                if (intensity < 64) {
                    outData.data[i] = 0;
                    outData.data[i + 1] = 0;
                    outData.data[i + 2] = Math.min(255, intensity * 4);
                } else if (intensity < 128) {
                    outData.data[i] = 0;
                    outData.data[i + 1] = Math.min(255, (intensity - 64) * 4);
                    outData.data[i + 2] = 255 - (intensity - 64) * 4;
                } else if (intensity < 192) {
                    outData.data[i] = Math.min(255, (intensity - 128) * 4);
                    outData.data[i + 1] = 255;
                    outData.data[i + 2] = 0;
                } else {
                    outData.data[i] = 255;
                    outData.data[i + 1] = 255 - (intensity - 192) * 4;
                    outData.data[i + 2] = 0;
                }
                outData.data[i + 3] = 255;
            }

            ctx.putImageData(outData, 0, 0);
            setHasResult(true);
        } catch (err) {
            console.error('[ELA] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, quality, sensitivityMultiplier]);

    const exportResult = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'ela-analysis.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div>
            {/* Quality slider */}
            <div className="tool-control-group">
                <label className="tool-control-label">JPEG Quality: {quality}%</label>
                <input
                    type="range"
                    className="tool-slider"
                    min="50"
                    max="100"
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
            <button
                className={`tool-analyse-btn ${isAnalysing ? 'tool-loading' : ''}`}
                onClick={analyse}
                disabled={isAnalysing}
            >
                {isAnalysing ? 'Analysing...' : '🔬 Analyse'}
            </button>

            {/* Results */}
            {hasResult && (
                <div className="tool-output-area">
                    <div style={{ position: 'relative' }}>
                        <canvas ref={originalRef} className="tool-output-canvas" style={{ opacity: 1 - opacity / 100 }} />
                        <canvas
                            ref={canvasRef}
                            className="tool-output-canvas"
                            style={{ position: 'absolute', top: 0, left: 0, opacity: opacity / 100 }}
                        />
                    </div>
                    <div className="tool-control-group" style={{ marginTop: 10 }}>
                        <label className="tool-control-label">ELA Overlay Opacity: {opacity}%</label>
                        <input
                            type="range"
                            className="tool-slider"
                            min="0"
                            max="100"
                            value={opacity}
                            onChange={(e) => setOpacity(Number(e.target.value))}
                        />
                    </div>
                    <button className="tool-export-btn" onClick={exportResult}>📥 Export PNG</button>
                </div>
            )}

            {/* Hidden canvas */}
            {!hasResult && <canvas ref={canvasRef} style={{ display: 'none' }} />}
            {!hasResult && <canvas ref={originalRef} style={{ display: 'none' }} />}
        </div>
    );
};
