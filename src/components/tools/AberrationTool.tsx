import React, { useState, useRef, useCallback } from 'react';

interface AberrationToolProps {
    targetImage: string;
}

/**
 * Chromatic Aberration Check
 * ===========================
 * Detects lens color fringing at high-contrast edges.
 * Real lens photos show slight RGB channel misalignment;
 * AI images typically lack this optical imperfection.
 */
export const AberrationTool: React.FC<AberrationToolProps> = ({ targetImage }) => {
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ avgSeparation: number; detected: boolean; edgesAnalysed: number } | null>(null);
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

            // Separate R, G, B channels
            const r = new Float64Array(w * h);
            const g = new Float64Array(w * h);
            const b = new Float64Array(w * h);

            for (let i = 0; i < w * h; i++) {
                r[i] = pixels[i * 4];
                g[i] = pixels[i * 4 + 1];
                b[i] = pixels[i * 4 + 2];
            }

            // Find high-contrast edges using Sobel on luminance
            const edges: { x: number; y: number; strength: number }[] = [];

            for (let y = 2; y < h - 2; y += 4) {
                for (let x = 2; x < w - 2; x += 4) {
                    const lum = (idx: number) => 0.299 * r[idx] + 0.587 * g[idx] + 0.114 * b[idx];
                    const idx = y * w + x;
                    const gx = -lum(idx - w - 1) + lum(idx - w + 1)
                        - 2 * lum(idx - 1) + 2 * lum(idx + 1)
                        - lum(idx + w - 1) + lum(idx + w + 1);
                    const gy = -lum(idx - w - 1) - 2 * lum(idx - w) - lum(idx - w + 1)
                        + lum(idx + w - 1) + 2 * lum(idx + w) + lum(idx + w + 1);

                    const mag = Math.sqrt(gx * gx + gy * gy);
                    if (mag > 100) {
                        edges.push({ x, y, strength: mag });
                    }
                }
            }

            // At each edge, measure R-G and B-G channel separation
            let totalSeparation = 0;
            const separations: { x: number; y: number; sep: number }[] = [];

            for (const edge of edges.slice(0, 200)) {
                // Compute edge in each channel separately
                const channelEdge = (ch: Float64Array) => {
                    const idx = edge.y * w + edge.x;
                    const gx = -ch[idx - w - 1] + ch[idx - w + 1]
                        - 2 * ch[idx - 1] + 2 * ch[idx + 1]
                        - ch[idx + w - 1] + ch[idx + w + 1];
                    const gy = -ch[idx - w - 1] - 2 * ch[idx - w] - ch[idx - w + 1]
                        + ch[idx + w - 1] + 2 * ch[idx + w] + ch[idx + w + 1];
                    return { gx, gy, mag: Math.sqrt(gx * gx + gy * gy) };
                };

                const rEdge = channelEdge(r);
                const gEdge = channelEdge(g);
                const bEdge = channelEdge(b);

                // Measure angular difference between channels
                const rAngle = Math.atan2(rEdge.gy, rEdge.gx);
                const gAngle = Math.atan2(gEdge.gy, gEdge.gx);
                const bAngle = Math.atan2(bEdge.gy, bEdge.gx);

                const rgDiff = Math.abs(rAngle - gAngle);
                const bgDiff = Math.abs(bAngle - gAngle);

                const sep = (rgDiff + bgDiff) / 2;
                totalSeparation += sep;
                separations.push({ x: edge.x, y: edge.y, sep });
            }

            const avgSeparation = edges.length > 0 ? totalSeparation / Math.min(edges.length, 200) : 0;
            const detected = avgSeparation > 0.05;

            // Render visualization to off-screen canvas
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = w;
            resultCanvas.height = h;
            const ctx = resultCanvas.getContext('2d')!;

            // Show RGB channel separation
            const outData = ctx.createImageData(w, h);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                // Exaggerate channel differences
                outData.data[idx] = Math.min(255, Math.abs(r[i] - g[i]) * 5);
                outData.data[idx + 1] = Math.min(255, Math.abs(g[i] - b[i]) * 5);
                outData.data[idx + 2] = Math.min(255, Math.abs(b[i] - r[i]) * 5);
                outData.data[idx + 3] = 255;
            }
            ctx.putImageData(outData, 0, 0);

            // Mark edges
            for (const sep of separations) {
                ctx.beginPath();
                ctx.arc(sep.x, sep.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = sep.sep > 0.05 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.5)';
                ctx.fill();
            }

            resultRef.current = resultCanvas;

            setStats({
                avgSeparation: avgSeparation * 100,
                detected,
                edgesAnalysed: Math.min(edges.length, 200)
            });
        } catch (err) {
            console.error('[Aberration] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage]);

    // Draw result when stats change
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
            <button className={`tool-analyse-btn ${isAnalysing ? 'tool-loading' : ''}`}
                onClick={analyse} disabled={isAnalysing}>
                {isAnalysing ? 'Checking...' : '🌈 Check for Aberration'}
            </button>

            {stats && (
                <div className="tool-output-area">
                    <canvas ref={canvasRef} className="tool-output-canvas" />
                    <div className="tool-stats">
                        <div className="tool-stat">
                            <p className="tool-stat-label">Channel Separation</p>
                            <p className="tool-stat-value">{stats.avgSeparation.toFixed(2)}°</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Edges Analysed</p>
                            <p className="tool-stat-value">{stats.edgesAnalysed}</p>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.detected ? 'tool-verdict-safe' : 'tool-verdict-suspicious'}`}>
                        {stats.detected
                            ? '✅ Natural lens fringing detected — likely real photo'
                            : '⚠️ No chromatic aberration — possibly synthetic'}
                    </div>
                </div>
            )}

            {!stats && <canvas ref={canvasRef} style={{ display: 'none' }} />}
        </div>
    );
};
