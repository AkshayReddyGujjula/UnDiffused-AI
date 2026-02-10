import React, { useState, useRef, useCallback } from 'react';

interface FFTToolProps {
    targetImage: string;
}

/**
 * Frequency Domain Analysis (FFT) Tool
 * ======================================
 * Computes 2D FFT via row/column 1D FFTs using Cooley-Tukey.
 * Displays log magnitude spectrum to reveal hidden patterns.
 */
export const FFTTool: React.FC<FFTToolProps> = ({ targetImage }) => {
    const [scale, setScale] = useState<'log' | 'linear'>('log');
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [stats, setStats] = useState<{ highFreq: number; lowFreq: number; gridArtifacts: boolean } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Simple 1D FFT (Cooley-Tukey, radix-2)
    const fft1d = (realIn: Float64Array, imagIn: Float64Array): [Float64Array, Float64Array] => {
        const n = realIn.length;
        if (n <= 1) return [realIn, imagIn];

        const real = new Float64Array(realIn);
        const imag = new Float64Array(imagIn);

        // Bit-reversal permutation
        for (let i = 1, j = 0; i < n; i++) {
            let bit = n >> 1;
            while (j & bit) { j ^= bit; bit >>= 1; }
            j ^= bit;
            if (i < j) {
                [real[i], real[j]] = [real[j], real[i]];
                [imag[i], imag[j]] = [imag[j], imag[i]];
            }
        }

        for (let len = 2; len <= n; len *= 2) {
            const halfLen = len / 2;
            const angle = -2 * Math.PI / len;
            const wReal = Math.cos(angle);
            const wImag = Math.sin(angle);

            for (let i = 0; i < n; i += len) {
                let curReal = 1, curImag = 0;
                for (let j = 0; j < halfLen; j++) {
                    const tReal = curReal * real[i + j + halfLen] - curImag * imag[i + j + halfLen];
                    const tImag = curReal * imag[i + j + halfLen] + curImag * real[i + j + halfLen];

                    real[i + j + halfLen] = real[i + j] - tReal;
                    imag[i + j + halfLen] = imag[i + j] - tImag;
                    real[i + j] += tReal;
                    imag[i + j] += tImag;

                    const newReal = curReal * wReal - curImag * wImag;
                    curImag = curReal * wImag + curImag * wReal;
                    curReal = newReal;
                }
            }
        }
        return [real, imag];
    };

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

            // Resize to power of 2 for FFT
            const size = 256; // Fixed FFT size
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = size;
            tempCanvas.height = size;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.drawImage(img, 0, 0, size, size);
            const imageData = tempCtx.getImageData(0, 0, size, size);

            // Convert to grayscale
            const gray = new Float64Array(size * size);
            for (let i = 0; i < size * size; i++) {
                const idx = i * 4;
                gray[i] = 0.299 * imageData.data[idx] + 0.587 * imageData.data[idx + 1] + 0.114 * imageData.data[idx + 2];
            }

            // 2D FFT: rows then columns
            const realRows = new Float64Array(size * size);
            const imagRows = new Float64Array(size * size);

            // FFT on rows
            for (let y = 0; y < size; y++) {
                const rowReal = gray.slice(y * size, (y + 1) * size);
                const rowImag = new Float64Array(size);
                const [outR, outI] = fft1d(rowReal, rowImag);
                realRows.set(outR, y * size);
                imagRows.set(outI, y * size);
            }

            // FFT on columns
            const realFinal = new Float64Array(size * size);
            const imagFinal = new Float64Array(size * size);

            for (let x = 0; x < size; x++) {
                const colReal = new Float64Array(size);
                const colImag = new Float64Array(size);
                for (let y = 0; y < size; y++) {
                    colReal[y] = realRows[y * size + x];
                    colImag[y] = imagRows[y * size + x];
                }
                const [outR, outI] = fft1d(colReal, colImag);
                for (let y = 0; y < size; y++) {
                    realFinal[y * size + x] = outR[y];
                    imagFinal[y * size + x] = outI[y];
                }
            }

            // Compute magnitude spectrum
            const magnitude = new Float64Array(size * size);
            let maxMag = 0;
            let highFreqEnergy = 0;
            let lowFreqEnergy = 0;
            const center = size / 2;

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const idx = y * size + x;
                    const mag = Math.sqrt(realFinal[idx] ** 2 + imagFinal[idx] ** 2);

                    // Shift for display (move DC to center)
                    const sy = (y + center) % size;
                    const sx = (x + center) % size;
                    const sIdx = sy * size + sx;

                    magnitude[sIdx] = scale === 'log' ? Math.log(1 + mag) : mag;
                    if (magnitude[sIdx] > maxMag) maxMag = magnitude[sIdx];

                    // Energy distribution
                    const dist = Math.sqrt((sx - center) ** 2 + (sy - center) ** 2);
                    if (dist < center * 0.3) lowFreqEnergy += mag;
                    else highFreqEnergy += mag;
                }
            }

            const totalEnergy = highFreqEnergy + lowFreqEnergy;
            const highPct = totalEnergy > 0 ? (highFreqEnergy / totalEnergy) * 100 : 0;
            const lowPct = totalEnergy > 0 ? (lowFreqEnergy / totalEnergy) * 100 : 0;

            // Check for grid artifacts (periodic bright spots)
            let gridScore = 0;
            for (let y = 0; y < size; y += 8) {
                for (let x = 0; x < size; x += 8) {
                    if (x === center && y === center) continue;
                    const idx = y * size + x;
                    if (magnitude[idx] > maxMag * 0.5) gridScore++;
                }
            }

            setStats({ highFreq: highPct, lowFreq: lowPct, gridArtifacts: gridScore > 3 });

            // Render spectrum
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d')!;
            const outData = ctx.createImageData(size, size);

            for (let i = 0; i < size * size; i++) {
                const v = maxMag > 0 ? (magnitude[i] / maxMag) * 255 : 0;
                const idx = i * 4;
                // Blue-white color scheme
                outData.data[idx] = Math.min(255, v * 0.8);
                outData.data[idx + 1] = Math.min(255, v * 0.9);
                outData.data[idx + 2] = Math.min(255, v);
                outData.data[idx + 3] = 255;
            }

            ctx.putImageData(outData, 0, 0);

            // Draw concentric frequency circles
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
            ctx.lineWidth = 1;
            for (let r = 30; r < center; r += 30) {
                ctx.beginPath();
                ctx.arc(center, center, r, 0, Math.PI * 2);
                ctx.stroke();
            }
        } catch (err) {
            console.error('[FFT] Analysis failed:', err);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage, scale]);

    return (
        <div>
            <div className="tool-control-group">
                <label className="tool-control-label">Magnitude Scale</label>
                <div className="tool-toggle-group">
                    <button className={`tool-toggle-btn ${scale === 'log' ? 'tool-toggle-btn-active' : ''}`}
                        onClick={() => setScale('log')}>Log</button>
                    <button className={`tool-toggle-btn ${scale === 'linear' ? 'tool-toggle-btn-active' : ''}`}
                        onClick={() => setScale('linear')}>Linear</button>
                </div>
            </div>

            <button className={`tool-analyse-btn ${isAnalysing ? 'tool-loading' : ''}`}
                onClick={analyse} disabled={isAnalysing}>
                {isAnalysing ? 'Computing FFT...' : '🌊 Compute FFT'}
            </button>

            {stats && (
                <div className="tool-output-area">
                    <canvas ref={canvasRef} className="tool-output-canvas" />
                    <div className="tool-stats">
                        <div className="tool-stat">
                            <p className="tool-stat-label">High Freq Energy</p>
                            <p className="tool-stat-value">{stats.highFreq.toFixed(1)}%</p>
                        </div>
                        <div className="tool-stat">
                            <p className="tool-stat-label">Low Freq Energy</p>
                            <p className="tool-stat-value">{stats.lowFreq.toFixed(1)}%</p>
                        </div>
                    </div>
                    <div className={`tool-verdict ${stats.gridArtifacts ? 'tool-verdict-danger' : 'tool-verdict-safe'}`}>
                        {stats.gridArtifacts ? '⚠️ Grid artifacts detected (GAN signature)' : '✅ No repeating patterns detected'}
                    </div>
                </div>
            )}

            {!stats && <canvas ref={canvasRef} style={{ display: 'none' }} />}
        </div>
    );
};
