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
 * =================================
 * Supports Sobel, Canny, and Laplacian edge analysis.
 */
export const GradientTool: React.FC<GradientToolProps> = ({ targetImage, onResult }) => {
    const [detector, setDetector] = useState<'sobel' | 'canny' | 'laplacian'>('sobel');
    const [threshold, setThreshold] = useState(100);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ edgeDensity: number; avgStrength: number; uniformity: number } | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const edgeRef = useRef<HTMLCanvasElement | null>(null);
    const magRef = useRef<HTMLCanvasElement | null>(null);
    const onResultRef = useRef<typeof onResult>(onResult);

    React.useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    const convolve3x3 = (src: Float32Array, width: number, height: number, k: number[]): Float32Array => {
        const out = new Float32Array(width * height);
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = y * width + x;
                out[i] =
                    src[i - width - 1] * k[0] + src[i - width] * k[1] + src[i - width + 1] * k[2] +
                    src[i - 1] * k[3] + src[i] * k[4] + src[i + 1] * k[5] +
                    src[i + width - 1] * k[6] + src[i + width] * k[7] + src[i + width + 1] * k[8];
            }
        }
        return out;
    };

    const gaussianBlur5x5 = (src: Float32Array, width: number, height: number): Float32Array => {
        const out = new Float32Array(width * height);
        const k = [
            2, 4, 5, 4, 2,
            4, 9, 12, 9, 4,
            5, 12, 15, 12, 5,
            4, 9, 12, 9, 4,
            2, 4, 5, 4, 2
        ];
        const norm = 159;

        for (let y = 2; y < height - 2; y++) {
            for (let x = 2; x < width - 2; x++) {
                let sum = 0;
                let idx = 0;
                for (let ky = -2; ky <= 2; ky++) {
                    for (let kx = -2; kx <= 2; kx++) {
                        sum += src[(y + ky) * width + (x + kx)] * k[idx++];
                    }
                }
                out[y * width + x] = sum / norm;
            }
        }
        return out;
    };

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
            const rgba = tempCtx.getImageData(0, 0, w, h).data;

            const gray = new Float32Array(w * h);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                gray[i] = 0.299 * rgba[idx] + 0.587 * rgba[idx + 1] + 0.114 * rgba[idx + 2];
            }

            const magnitudes = new Float32Array(w * h);
            const edges = new Uint8Array(w * h);

            if (detector === 'sobel') {
                const gx = convolve3x3(gray, w, h, [-1, 0, 1, -2, 0, 2, -1, 0, 1]);
                const gy = convolve3x3(gray, w, h, [-1, -2, -1, 0, 0, 0, 1, 2, 1]);
                for (let i = 0; i < magnitudes.length; i++) {
                    const mag = Math.sqrt(gx[i] * gx[i] + gy[i] * gy[i]);
                    magnitudes[i] = mag;
                    edges[i] = mag >= threshold ? 255 : 0;
                }
            } else if (detector === 'laplacian') {
                const lap = convolve3x3(gray, w, h, [0, 1, 0, 1, -4, 1, 0, 1, 0]);
                for (let i = 0; i < magnitudes.length; i++) {
                    const mag = Math.abs(lap[i]);
                    magnitudes[i] = mag;
                    edges[i] = mag >= threshold * 0.5 ? 255 : 0;
                }
            } else {
                // Canny: blur -> Sobel -> non-max suppression -> hysteresis.
                const blurred = gaussianBlur5x5(gray, w, h);
                const gx = convolve3x3(blurred, w, h, [-1, 0, 1, -2, 0, 2, -1, 0, 1]);
                const gy = convolve3x3(blurred, w, h, [-1, -2, -1, 0, 0, 0, 1, 2, 1]);
                const gradMag = new Float32Array(w * h);
                const nms = new Float32Array(w * h);
                const lowThreshold = threshold * 0.4;
                const strong = 2;
                const weak = 1;
                const flags = new Uint8Array(w * h);

                for (let i = 0; i < gradMag.length; i++) {
                    const gxx = gx[i];
                    const gyy = gy[i];
                    gradMag[i] = Math.sqrt(gxx * gxx + gyy * gyy);
                }

                for (let y = 1; y < h - 1; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        const idx = y * w + x;
                        const gxx = gx[idx];
                        const gyy = gy[idx];
                        const mag = gradMag[idx];

                        let angle = Math.atan2(gyy, gxx) * (180 / Math.PI);
                        if (angle < 0) angle += 180;

                        let q = 0;
                        let r = 0;
                        if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle <= 180)) {
                            q = gradMag[idx + 1];
                            r = gradMag[idx - 1];
                        } else if (angle >= 22.5 && angle < 67.5) {
                            q = gradMag[idx + w + 1];
                            r = gradMag[idx - w - 1];
                        } else if (angle >= 67.5 && angle < 112.5) {
                            q = gradMag[idx + w];
                            r = gradMag[idx - w];
                        } else {
                            q = gradMag[idx - w + 1];
                            r = gradMag[idx + w - 1];
                        }

                        if (mag >= q && mag >= r) {
                            nms[idx] = mag;
                            if (mag >= threshold) flags[idx] = strong;
                            else if (mag >= lowThreshold) flags[idx] = weak;
                        }
                    }
                }

                const stack: number[] = [];
                for (let i = 0; i < flags.length; i++) {
                    if (flags[i] === strong) stack.push(i);
                }

                while (stack.length > 0) {
                    const idx = stack.pop()!;
                    const x = idx % w;
                    const y = Math.floor(idx / w);
                    edges[idx] = 255;

                    for (let ny = y - 1; ny <= y + 1; ny++) {
                        for (let nx = x - 1; nx <= x + 1; nx++) {
                            if (nx <= 0 || nx >= w - 1 || ny <= 0 || ny >= h - 1) continue;
                            const ni = ny * w + nx;
                            if (flags[ni] === weak) {
                                flags[ni] = strong;
                                stack.push(ni);
                            }
                        }
                    }
                }

                for (let i = 0; i < magnitudes.length; i++) {
                    magnitudes[i] = nms[i];
                }
            }

            let edgeCount = 0;
            let totalStrength = 0;
            const blockSize = 32;
            const blockStrengths: number[] = [];

            for (let i = 0; i < w * h; i++) {
                if (edges[i] > 0) edgeCount++;
                totalStrength += magnitudes[i];
            }

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

            if (blockStrengths.length === 0) {
                throw new Error('Image too small for gradient block analysis');
            }

            const meanBlock = blockStrengths.reduce((a, b) => a + b, 0) / blockStrengths.length;
            const stdBlock = Math.sqrt(blockStrengths.reduce((a, b) => a + (b - meanBlock) ** 2, 0) / blockStrengths.length);
            const uniformity = meanBlock > 0 ? Math.max(0, Math.min(100, (1 - Math.min(stdBlock / meanBlock, 2) / 2) * 100)) : 0;

            const edgeCanvas = document.createElement('canvas');
            edgeCanvas.width = w;
            edgeCanvas.height = h;
            const edgeCtx = edgeCanvas.getContext('2d')!;
            const edgeData = edgeCtx.createImageData(w, h);
            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                edgeData.data[idx] = edges[i];
                edgeData.data[idx + 1] = edges[i];
                edgeData.data[idx + 2] = edges[i];
                edgeData.data[idx + 3] = 255;
            }
            edgeCtx.putImageData(edgeData, 0, 0);

            const magCanvas = document.createElement('canvas');
            magCanvas.width = w;
            magCanvas.height = h;
            const magCtx = magCanvas.getContext('2d')!;
            const magData = magCtx.createImageData(w, h);

            let maxMag = 0;
            for (let i = 0; i < magnitudes.length; i++) {
                if (magnitudes[i] > maxMag) maxMag = magnitudes[i];
            }
            const denom = maxMag || 1;

            for (let i = 0; i < w * h; i++) {
                const idx = i * 4;
                const v = magnitudes[i] / denom;
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

    React.useEffect(() => {
        if (!stats) return;
        const emit = onResultRef.current;
        if (!emit) return;

        if (activeTab === 0 && edgeRef.current) {
            emit(edgeRef.current);
        } else if (activeTab === 1 && magRef.current) {
            emit(magRef.current);
        }
    }, [stats, activeTab]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Edge Detector</label>
                <LiquidSelect
                    value={detector}
                    onChange={(val) => setDetector(val as 'sobel' | 'canny' | 'laplacian')}
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
                        {stats.uniformity > 70 ? 'Unnaturally smooth gradients' : 'Natural edge variation'}
                        {' '}(Uniformity: {stats.uniformity.toFixed(1)}%)
                    </div>
                </div>
            )}
        </div>
    );
};
