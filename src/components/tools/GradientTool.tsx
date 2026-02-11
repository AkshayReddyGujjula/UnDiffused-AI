import React, { useState, useRef, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';
import { ToolSlider } from './ToolSlider';
import { LiquidSelect } from '../LiquidSelect';

interface GradientToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

/**
 * Luminance Gradient Analysis Tool
 * ==================================
 * Computes edge maps using Sobel, Canny, or Laplacian filters.
 * AI images often exhibit unnaturally smooth gradients.
 */
export const GradientTool: React.FC<GradientToolProps> = ({ targetImage, onResult }) => {
    const [detector, setDetector] = useState<'sobel' | 'canny' | 'laplacian'>('sobel');
    const [threshold, setThreshold] = useState(100);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ edgeDensity: number; avgStrength: number; uniformity: number } | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const edgeRef = useRef<HTMLCanvasElement | null>(null);
    const magRef = useRef<HTMLCanvasElement | null>(null);

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
                const idx = i * 4;
                gray[i] = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            }

            const magnitudes = new Float64Array(w * h);
            const edges = new Uint8Array(w * h);

            if (detector === 'sobel' || detector === 'canny') {
                // Sobel kernels
                for (let y = 1; y < h - 1; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        const gx = -gray[(y - 1) * w + (x - 1)] + gray[(y - 1) * w + (x + 1)]
                            - 2 * gray[y * w + (x - 1)] + 2 * gray[y * w + (x + 1)]
                            - gray[(y + 1) * w + (x - 1)] + gray[(y + 1) * w + (x + 1)];

                        const gy = -gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + (x + 1)]
                            + gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];

                        const mag = Math.sqrt(gx * gx + gy * gy);
                        magnitudes[y * w + x] = mag;
                        edges[y * w + x] = mag > threshold ? 255 : 0;
                    }
                }
            } else {
                // Laplacian kernel
                for (let y = 1; y < h - 1; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        const lap = -4 * gray[y * w + x]
                            + gray[(y - 1) * w + x]
                            + gray[(y + 1) * w + x]
                            + gray[y * w + (x - 1)]
                            + gray[y * w + (x + 1)];
                        const mag = Math.abs(lap);
                        magnitudes[y * w + x] = mag;
                        edges[y * w + x] = mag > threshold / 2 ? 255 : 0;
                    }
                }
            }

            // Statistics
            let edgeCount = 0;
            let totalStrength = 0;
            const blockSize = 32;
            const blockStrengths: number[] = [];

            for (let i = 0; i < w * h; i++) {
                if (edges[i] > 0) edgeCount++;
                totalStrength += magnitudes[i];
            }

            // Block-level uniformity
            for (let by = 0; by < Math.floor(h / blockSize); by++) {
                for (let bx = 0; bx < Math.floor(w / blockSize); bx++) {
                    let blockSum = 0;
                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            blockSum += magnitudes[(by * blockSize + dy) * w + (bx * blockSize + dx)];
                        }
                    }
                    blockStrengths.push(blockSum / (blockSize * blockSize));
                }
            }

            const meanBlock = blockStrengths.reduce((a, b) => a + b, 0) / blockStrengths.length;
            const stdBlock = Math.sqrt(blockStrengths.reduce((a, b) => a + (b - meanBlock) ** 2, 0) / blockStrengths.length);
            const uniformity = meanBlock > 0 ? Math.max(0, 100 - (stdBlock / meanBlock) * 50) : 0;

            setStats({
                edgeDensity: (edgeCount / (w * h)) * 10000,
                avgStrength: totalStrength / (w * h),
                uniformity
            });

            // Render edge map to off-screen canvas
            const edgeCanvas = document.createElement('canvas');
            edgeCanvas.width = w;
            edgeCanvas.height = h;
            const edgeCtx = edgeCanvas.getContext('2d')!;
            const edgeData = edgeCtx.createImageData(w, h);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                edgeData.data[idx] = edgeData.data[idx + 1] = edgeData.data[idx + 2] = edges[i];
                edgeData.data[idx + 3] = 255;
            }
            edgeCtx.putImageData(edgeData, 0, 0);

            // Render magnitude heat map to off-screen canvas
            const magCanvas = document.createElement('canvas');
            magCanvas.width = w;
            magCanvas.height = h;
            const magCtx = magCanvas.getContext('2d')!;
            const magData = magCtx.createImageData(w, h);
            const maxMag = Math.max(...magnitudes);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                const v = maxMag > 0 ? magnitudes[i] / maxMag : 0;
                // Heat map: blue → cyan → green → yellow → red
                if (v < 0.25) {
                    magData.data[idx] = 0;
                    magData.data[idx + 1] = Math.floor(v * 4 * 255);
                    magData.data[idx + 2] = 255;
                } else if (v < 0.5) {
                    magData.data[idx] = 0;
                    magData.data[idx + 1] = 255;
                    magData.data[idx + 2] = Math.floor((1 - (v - 0.25) * 4) * 255);
                } else if (v < 0.75) {
                    magData.data[idx] = Math.floor((v - 0.5) * 4 * 255);
                    magData.data[idx + 1] = 255;
                    magData.data[idx + 2] = 0;
                } else {
                    magData.data[idx] = 255;
                    magData.data[idx + 1] = Math.floor((1 - (v - 0.75) * 4) * 255);
                    magData.data[idx + 2] = 0;
                }
                magData.data[idx + 3] = 255;
            }
            magCtx.putImageData(magData, 0, 0);

            edgeRef.current = edgeCanvas;
            magRef.current = magCanvas;

            setStats({
                edgeDensity: (edgeCount / (w * h)) * 10000,
                avgStrength: totalStrength / (w * h),
                uniformity
            });
        } catch (err) {
            console.error('[Gradient] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, detector, threshold]);

    // Pass result up when stats or activeTab changes
    React.useEffect(() => {
        if (stats && onResult) {
            if (activeTab === 0 && edgeRef.current) {
                onResult(edgeRef.current);
            } else if (activeTab === 1 && magRef.current) {
                onResult(magRef.current);
            }
        }
    }, [stats, activeTab, onResult]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Edge Detector</label>
                <LiquidSelect
                    value={detector}
                    onChange={(val) => setDetector(val)}
                    options={[
                        { label: 'Sobel', value: 'sobel' },
                        { label: 'Canny', value: 'canny' },
                        { label: 'Laplacian', value: 'laplacian' }
                    ]}
                />
            </div>

            <div className="tool-control-group">
                <label className="tool-control-label">Threshold: {threshold}</label>
                <ToolSlider min={20} max={300} value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))} />
            </div>

            <ToolActionRow
                label="Analyse Gradients"
                onClick={analyse}
                isAnalysing={isAnalysing}
            />

            {stats && (
                <div className="tool-output-area">
                    <div className="tool-tabs">
                        <button className={`tool-tab ${activeTab === 0 ? 'tool-tab-active' : ''}`}
                            onClick={() => setActiveTab(0)}>Edge Map</button>
                        <button className={`tool-tab ${activeTab === 1 ? 'tool-tab-active' : ''}`}
                            onClick={() => setActiveTab(1)}>Gradient Magnitude</button>
                    </div>

                    <div className="tool-stat-label" style={{ textAlign: 'center', marginBottom: 0 }}>
                        Result shown in main view
                    </div>

                    <div className="tool-stats">
                        <div className="tool-stat">
                            <p className="tool-stat-label">Edge Density</p>
                            <p className="tool-stat-value">{stats.edgeDensity.toFixed(0)}/10k px</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Avg Strength</p>
                            <p className="tool-stat-value">{stats.avgStrength.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.uniformity > 70 ? 'tool-verdict-danger' : 'tool-verdict-safe'}`}>
                        {stats.uniformity > 70 ? '⚠️ Unnaturally smooth gradients' : '✅ Natural edge variation'}
                        {' '}(Uniformity: {stats.uniformity.toFixed(1)}%)
                    </div>
                </div>
            )}
        </div>
    );
};
