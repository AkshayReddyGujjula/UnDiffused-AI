import React, { useState, useCallback } from 'react';

interface HighlightToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

/**
 * Specular Highlight Analysis Tool
 * ==================================
 * Detects specular highlights and estimates light source direction.
 * Inconsistent highlight directions indicate manipulation.
 */
export const HighlightTool: React.FC<HighlightToolProps> = ({ targetImage, onResult }) => {
    const [sensitivity, setSensitivity] = useState(6);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ highlights: number; consistent: number; inconsistent: number } | null>(null);

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

            // Detect specular highlights (bright spots)
            const highlightThreshold = 200 + (10 - sensitivity) * 5;
            const highlights: { x: number; y: number; intensity: number }[] = [];

            // Use block-based detection to avoid too many points
            const blockSize = 16;
            for (let by = 0; by < Math.floor(h / blockSize); by++) {
                for (let bx = 0; bx < Math.floor(w / blockSize); bx++) {
                    let maxVal = 0;
                    let maxX = 0, maxY = 0;

                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const px = bx * blockSize + dx;
                            const py = by * blockSize + dy;
                            const idx = (py * w + px) * 4;
                            const lum = Math.max(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
                            if (lum > maxVal) {
                                maxVal = lum;
                                maxX = px;
                                maxY = py;
                            }
                        }
                    }

                    if (maxVal > highlightThreshold) {
                        highlights.push({ x: maxX, y: maxY, intensity: maxVal });
                    }
                }
            }

            // Estimate light direction from each highlight
            // Use gradient around highlight to estimate incoming light direction
            const directions: number[] = [];
            for (const hl of highlights) {
                let gx = 0, gy = 0;
                const radius = 10;
                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        const px = hl.x + dx;
                        const py = hl.y + dy;
                        if (px < 0 || px >= w || py < 0 || py >= h) continue;
                        const idx = (py * w + px) * 4;
                        const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
                        gx += dx * lum;
                        gy += dy * lum;
                    }
                }
                const angle = Math.atan2(gy, gx);
                directions.push(angle);
            }

            // Check consistency of light directions
            let consistent = 0, inconsistent = 0;
            if (directions.length > 1) {
                const meanAngle = directions.reduce((a, b) => a + b, 0) / directions.length;
                for (const angle of directions) {
                    const diff = Math.abs(angle - meanAngle);
                    if (diff < Math.PI / 4 || diff > Math.PI * 7 / 4) {
                        consistent++;
                    } else {
                        inconsistent++;
                    }
                }
            }

            setStats({ highlights: highlights.length, consistent, inconsistent });

            // Render to off-screen canvas
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            highlights.forEach((hl, idx) => {
                const isConsistent = idx < directions.length && (() => {
                    const meanAngle = directions.reduce((a, b) => a + b, 0) / directions.length;
                    const diff = Math.abs(directions[idx] - meanAngle);
                    return diff < Math.PI / 4 || diff > Math.PI * 7 / 4;
                })();

                // Draw circle
                ctx.beginPath();
                ctx.arc(hl.x, hl.y, 12, 0, Math.PI * 2);
                ctx.strokeStyle = isConsistent ? '#fbbf24' : '#ef4444';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw direction arrow
                if (idx < directions.length) {
                    const angle = directions[idx];
                    const arrowLen = 25;
                    ctx.beginPath();
                    ctx.moveTo(hl.x, hl.y);
                    ctx.lineTo(hl.x + Math.cos(angle) * arrowLen, hl.y + Math.sin(angle) * arrowLen);
                    ctx.strokeStyle = isConsistent ? 'rgba(251, 191, 36, 0.7)' : 'rgba(239, 68, 68, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });

            // Pass result up
            if (onResult) {
                onResult(resultCanvas);
            }

            setStats({ highlights: highlights.length, consistent, inconsistent });
        } catch (err) {
            console.error('[Highlight] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, sensitivity, onResult]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Sensitivity: {sensitivity}</label>
                <input type="range" className="tool-slider" min="1" max="10" value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))} />
            </div>

            <button className={`tool-analyse-btn ${isAnalysing ? 'tool-loading' : ''}`}
                onClick={analyse} disabled={isAnalysing}>
                {isAnalysing ? 'Detecting...' : '✨ Detect Highlights'}
            </button>

            {stats && (
                <div className="tool-output-area">
                    <div className="tool-stat-label" style={{ textAlign: 'center', marginBottom: 0 }}>
                        Result shown in main view
                    </div>
                    <div className="tool-stats">
                        <div className="tool-stat">
                            <p className="tool-stat-label">Highlights Found</p>
                            <p className="tool-stat-value">{stats.highlights}</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Consistent / Inconsistent</p>
                            <p className="tool-stat-value">{stats.consistent} / {stats.inconsistent}</p>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.inconsistent > stats.consistent ? 'tool-verdict-danger' : 'tool-verdict-safe'}`}>
                        {stats.inconsistent > stats.consistent ? '⚠️ Lighting inconsistencies detected' : '✅ Physically plausible lighting'}
                    </div>
                </div>
            )}
        </div>
    );
};
