import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '../components/GlassCard';

type ScanState = 'idle' | 'scanning' | 'result' | 'error';

interface ScanResult {
    isAI: boolean;
    confidence: number;
    heatmapData?: number[];
}

const HEATMAP_SIZE = 32;

/**
 * HeatmapCanvas - Renders gradient variance as red-transparent overlay
 */
const HeatmapCanvas: React.FC<{ data: number[] }> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawHeatmap = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length !== HEATMAP_SIZE * HEATMAP_SIZE) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match display size for sharp rendering
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // enable smoothing for that "blurry" heatmap look
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 1. Create a small offscreen canvas for the raw 32x32 data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = HEATMAP_SIZE;
        tempCanvas.height = HEATMAP_SIZE;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // 2. Create ImageData to manipulate pixels directly
        const imgData = tempCtx.createImageData(HEATMAP_SIZE, HEATMAP_SIZE);
        const pixels = imgData.data;

        for (let i = 0; i < data.length; i++) {
            const value = data[i];
            // Normalize value to visualize it better
            // Ideally value is 0-1.

            // Map value to Red channel with Alpha
            // We want high values to be very visible red
            const alpha = Math.min(255, Math.floor(Math.pow(value, 0.6) * 200));

            const idx = i * 4;
            pixels[idx] = 239;     // R (Red-500)
            pixels[idx + 1] = 68;  // G
            pixels[idx + 2] = 68;  // B
            pixels[idx + 3] = alpha; // A
        }

        tempCtx.putImageData(imgData, 0, 0);

        // 3. Draw the small canvas stretched onto the main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

    }, [data]);

    useEffect(() => {
        drawHeatmap();
        window.addEventListener('resize', drawHeatmap);
        return () => window.removeEventListener('resize', drawHeatmap);
    }, [drawHeatmap]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        // Removed mix-blend-mode to avoid weird darkening effects
        />
    );
};

/**
 * Scanner Component
 * ==================
 * Main UI overlay showing the scan animation and result.
 * 
 * Features:
 * - Spring physics entry animation
 * - Laser scanner effect through "glass"
 * - Verdict display with color coding
 */
export const Scanner: React.FC = () => {
    const [state, setState] = useState<ScanState>('idle');
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);
    const [heatmapOpacity, setHeatmapOpacity] = useState(0); // 0-100 slider

    useEffect(() => {
        const handleMessage = (message: {
            type: string;
            imageUrl?: string;
            isAI?: boolean;
            confidence?: number;
            heatmapData?: number[];
            error?: string;
        }) => {
            switch (message.type) {
                case 'SCANNING':
                    setState('scanning');
                    setTargetImage(message.imageUrl || null);
                    setResult(null);
                    setError(null);
                    break;
                case 'SHOW_RESULT':
                    setState('result');
                    setResult({
                        isAI: message.isAI || false,
                        confidence: message.confidence || 0,
                        heatmapData: message.heatmapData
                    });
                    break;
                case 'ERROR':
                    setState('error');
                    setError(message.error || 'Unknown error');
                    break;
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    // Close handler
    const handleClose = () => {
        setState('idle');
        setResult(null);
        setError(null);
        setTargetImage(null);
        setHeatmapOpacity(0);
    };

    if (state === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center p-8">
            <GlassCard className="pointer-events-auto relative overflow-hidden min-w-[320px] max-w-[400px] p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">UnDiffused</h2>
                        <p className="text-xs text-white/50 tracking-wider uppercase">AI Image Detector</p>
                    </div>
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scanning State */}
                {state === 'scanning' && (
                    <div className="relative">
                        {/* Image Preview (if available) */}
                        {targetImage && (
                            <div className="relative mb-4 rounded-xl overflow-hidden border border-white/10">
                                <img
                                    src={targetImage}
                                    alt="Scanning"
                                    className="w-full h-32 object-cover opacity-50"
                                />
                                {/* Laser Scanner Effect */}
                                <div className="absolute inset-0">
                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                                </div>
                            </div>
                        )}

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow" />
                            <span className="text-sm text-white/70">Analyzing image...</span>
                        </div>
                    </div>
                )}

                {/* Result State */}
                {state === 'result' && result && (
                    <div className="animate-fade-in">
                        {/* Verdict Badge */}
                        <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
              ${result.isAI
                                ? 'bg-red-500/20 border border-red-500/30'
                                : 'bg-green-500/20 border border-green-500/30'
                            }
            `}>
                            <div className={`w-2 h-2 rounded-full ${result.isAI ? 'bg-red-400' : 'bg-green-400'}`} />
                            <span className={`text-sm font-medium ${result.isAI ? 'text-red-400' : 'text-green-400'}`}>
                                {result.isAI ? 'AI-GENERATED' : 'REAL IMAGE'}
                            </span>
                        </div>

                        {/* Confidence Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white/50">
                                <span>Confidence</span>
                                <span>{result.confidence}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${result.isAI ? 'bg-red-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${result.confidence}%` }}
                                />
                            </div>
                        </div>

                        {/* Image Preview with Heatmap */}
                        {targetImage && result.heatmapData && (
                            <div className="mt-4">
                                <div className="relative rounded-xl overflow-hidden border border-white/10">
                                    <img
                                        src={targetImage}
                                        alt="Analyzed"
                                        className="w-full h-40 object-cover"
                                    />
                                    {/* Heatmap Overlay */}
                                    <div
                                        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                                        style={{ opacity: heatmapOpacity / 100 }}
                                    >
                                        <HeatmapCanvas data={result.heatmapData} />
                                    </div>
                                </div>
                                {/* Heatmap Slider */}
                                <div className="mt-3 space-y-2">
                                    <div className="flex justify-between text-xs text-white/50">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Image
                                        </span>
                                        <span className="flex items-center gap-1">
                                            Heatmap
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={heatmapOpacity}
                                        onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-blue-500/50 to-red-500/50"
                                        style={{
                                            background: `linear-gradient(to right, rgba(59, 130, 246, 0.5) ${heatmapOpacity}%, rgba(239, 68, 68, 0.5) ${heatmapOpacity}%)`
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Privacy Notice */}
                        <p className="mt-4 text-[10px] text-white/30 tracking-wide">
                            🔒 All processing done locally on your device
                        </p>
                    </div>
                )}

                {/* Error State */}
                {state === 'error' && (
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
                            <span className="text-sm font-medium text-red-400">Analysis Failed</span>
                        </div>
                        <p className="text-xs text-white/50">{error}</p>
                    </div>
                )}

                {/* Decorative Gradient Edge */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </GlassCard>
        </div>
    );
};

export default Scanner;
