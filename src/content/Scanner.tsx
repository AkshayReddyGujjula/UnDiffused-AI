import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ResultView, ScanResult } from '../components/ResultView';

type ScanState = 'idle' | 'scanning' | 'result' | 'error';

/**
 * Scanner Component
 * ==================
 * Main UI overlay showing the scan animation and result.
 * 
 * Features:
 * - Spring physics entry animation
 * - Laser scanner effect through "glass"
 * - Verdict display with color coding
 * - Draggable interface
 */
export const Scanner: React.FC = () => {
    const [state, setState] = useState<ScanState>('idle');
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);

    // Dragging state
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMessage = (message: {
            type: string;
            imageUrl?: string;
            isAI?: boolean;
            confidence?: number;
            heatmapData?: number[];
            filterData?: number[];
            error?: string;
        }) => {
            switch (message.type) {
                case 'SCANNING':
                    setState('scanning');
                    setTargetImage(message.imageUrl || null);
                    setResult(null);
                    setError(null);
                    // Reset position on new scan? Or keep it? keeping it is better UX.
                    break;
                case 'SHOW_RESULT':
                    setState('result');
                    setResult({
                        isAI: message.isAI || false,
                        confidence: message.confidence || 0,
                        heatmapData: message.heatmapData,
                        filterData: message.filterData
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

    // Global drag handlers
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        e.preventDefault();

        const rect = cardRef.current.getBoundingClientRect();
        // Calculate current position if centered
        const currentX = position ? position.x : rect.left;
        const currentY = position ? position.y : rect.top;

        dragOffset.current = {
            x: e.clientX - currentX,
            y: e.clientY - currentY
        };

        // Switch to absolute positioning on first drag
        if (!position) {
            setPosition({ x: currentX, y: currentY });
        }

        setIsDragging(true);
    };

    // Close handler
    const handleClose = () => {
        setState('idle');
        setResult(null);
        setError(null);
        setTargetImage(null);
        // We ideally shouldn't reset position so if they scan again it appears where they left it
        // But if they navigation away, it resets.
    };

    if (state === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[999999] pointer-events-none">
            <div
                ref={cardRef}
                className="pointer-events-auto absolute transition-shadow duration-300"
                style={position ? {
                    left: position.x,
                    top: position.y,
                    boxShadow: isDragging ? '0 20px 40px rgba(0,0,0,0.5)' : undefined
                } : {
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <GlassCard className="relative overflow-hidden min-w-[320px] max-w-[400px] p-6 pt-5">

                    {/* Drag Handle (Top 5% approx) */}
                    <div
                        onMouseDown={handleMouseDown}
                        className="absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group"
                        title="Drag to move"
                    >
                        {/* iOS-style Pill */}
                        <div className={`w-20 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${isDragging ? 'bg-white/80 w-24' : 'group-hover:bg-white/60'}`} />
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4 mt-2">
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
                    {state === 'result' && result && targetImage && (
                        <ResultView
                            result={result}
                            targetImage={targetImage}
                        />
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
        </div>
    );
};

export default Scanner;
