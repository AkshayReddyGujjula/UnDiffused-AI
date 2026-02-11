import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';
import { ToolSlider } from './ToolSlider';

interface FFTToolProps {
    targetImage: string;
    onResult?: (canvas: HTMLCanvasElement) => void;
}

/**
 * FFT Tool (Fast Fourier Transform)
 * =================================
 * Visualizes the frequency domain of the image.
 */
export const FFTTool: React.FC<FFTToolProps> = ({ targetImage, onResult }) => {
    const [scale, setScale] = useState(1); // Log scale strength
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ highFreq: number; lowFreq: number; gridArtifacts: boolean } | null>(null);

    // Simple 1D FFT (Cooley-Tukey, radix-2)
    const fft1d = (realIn: Float64Array, imagIn: Float64Array): [Float64Array, Float64Array] => {
        const n = realIn.length;
        if (n <= 1) return [realIn, imagIn];

        const half = n / 2;
        const realEven = new Float64Array(half);
        const imagEven = new Float64Array(half);
        const realOdd = new Float64Array(half);
        const imagOdd = new Float64Array(half);

        for (let i = 0; i < half; i++) {
            realEven[i] = realIn[2 * i];
            imagEven[i] = imagIn[2 * i];
            realOdd[i] = realIn[2 * i + 1];
            imagOdd[i] = imagIn[2 * i + 1];
        }

        const [realE, imagE] = fft1d(realEven, imagEven);
        const [realO, imagO] = fft1d(realOdd, imagOdd);

        const realOut = new Float64Array(n);
        const imagOut = new Float64Array(n);

        for (let k = 0; k < half; k++) {
            const angle = -2 * Math.PI * k / n;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const tReal = cos * realO[k] - sin * imagO[k];
            const tImag = cos * imagO[k] + sin * realO[k];

            realOut[k] = realE[k] + tReal;
            imagOut[k] = imagE[k] + tImag;
            realOut[k + half] = realE[k] - tReal;
            imagOut[k + half] = imagE[k] - tImag;
        }

        return [realOut, imagOut];
    };

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setStats(null);

        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = targetImage;
            });

            // Use power of 2 size for FFT stability
            const size = 512;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, size, size);

            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;

            // Convert to grayscale
            const gray = new Float64Array(size * size);
            for (let i = 0; i < size * size; i++) {
                gray[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
            }

            // Perform 2D FFT (Rows then Cols)
            const real = new Float64Array(gray);
            const imag = new Float64Array(size * size);

            // Row-wise FFT
            for (let y = 0; y < size; y++) {
                const rowReal = new Float64Array(size);
                const rowImag = new Float64Array(size);
                for (let x = 0; x < size; x++) {
                    rowReal[x] = real[y * size + x];
                    rowImag[x] = imag[y * size + x];
                }
                const [rOut, iOut] = fft1d(rowReal, rowImag);
                for (let x = 0; x < size; x++) {
                    real[y * size + x] = rOut[x];
                    imag[y * size + x] = iOut[x];
                }
            }

            // Col-wise FFT
            for (let x = 0; x < size; x++) {
                const colReal = new Float64Array(size);
                const colImag = new Float64Array(size);
                for (let y = 0; y < size; y++) {
                    colReal[y] = real[y * size + x];
                    colImag[y] = imag[y * size + x];
                }
                const [rOut, iOut] = fft1d(colReal, colImag);
                for (let y = 0; y < size; y++) {
                    real[y * size + x] = rOut[y];
                    imag[y * size + x] = iOut[y];
                }
            }

            // Compute Magnitude (Shifted)
            const magnitude = new Float64Array(size * size);
            const center = size / 2;
            let maxMag = 0;

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const r = real[y * size + x];
                    const i = imag[y * size + x];
                    let mag = Math.sqrt(r * r + i * i);
                    mag = Math.log(1 + mag) * scale; // Log scaling

                    const sy = (y + center) % size;
                    const sx = (x + center) % size;
                    const idx = sy * size + sx;

                    magnitude[idx] = mag;
                    if (mag > maxMag) maxMag = mag;
                }
            }

            // Simple stats based on magnitude distribution
            const centerMag = magnitude[center * size + center];
            const highFreqMag = magnitude[0]; // Corner (high freq after shift)
            const highPct = (highFreqMag / maxMag) * 100;
            const lowPct = (centerMag / maxMag) * 100;

            // Detect grid artifacts (peaks at regular intervals)
            let gridScore = 0;
            for (let i = 1; i < 4; i++) {
                const px = center + i * (size / 8);
                if (px < size && magnitude[center * size + px] > magnitude[center * size + px - 1] * 1.5) {
                    gridScore++;
                }
            }

            // Store result in ref for rendering
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = size;
            resultCanvas.height = size;
            const resCtx = resultCanvas.getContext('2d')!;
            const outData = resCtx.createImageData(size, size);

            for (let i = 0; i < size * size; i++) {
                const v = maxMag > 0 ? (magnitude[i] / maxMag) * 255 : 0;
                const idx = i * 4;
                // Blue-white color scheme
                outData.data[idx] = Math.min(255, v * 0.8);
                outData.data[idx + 1] = Math.min(255, v * 0.9);
                outData.data[idx + 2] = Math.min(255, v);
                outData.data[idx + 3] = 255;
            }

            resCtx.putImageData(outData, 0, 0);

            // Draw concentric frequency circles
            resCtx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
            resCtx.lineWidth = 1;
            for (let r = 30; r < center; r += 30) {
                resCtx.beginPath();
                resCtx.arc(center, center, r, 0, Math.PI * 2);
                resCtx.stroke();
            }

            // Pass result up
            if (onResult) {
                onResult(resultCanvas);
            }

            setStats({ highFreq: highPct, lowFreq: lowPct, gridArtifacts: gridScore > 3 });

        } catch (err) {
            console.error('[FFT] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, scale, onResult]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Log Scale Factor: {scale}</label>
                <ToolSlider
                    min={1}
                    max={10}
                    step={0.1}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                />
            </div>

            <ToolActionRow
                label="Generate Spectrum"
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
                            <div className="tool-stat-label">High Freq Content</div>
                            <div className="tool-stat-value">{stats.highFreq.toFixed(1)}%</div>
                        </div>
                        <div className="tool-stat">
                            <div className="tool-stat-label">Low Freq Content</div>
                            <div className="tool-stat-value">{stats.lowFreq.toFixed(1)}%</div>
                        </div>
                        <div className="tool-stat">
                            <div className="tool-stat-label">Grid Artifacts</div>
                            <div className="tool-stat-value" style={{ color: stats.gridArtifacts ? '#ef4444' : '#10b981' }}>
                                {stats.gridArtifacts ? 'Detected' : 'None'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
