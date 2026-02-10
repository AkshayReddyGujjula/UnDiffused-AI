import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ResultView, ScanResult } from '../components/ResultView';
import { ForensicToolsPanel } from '../components/ForensicToolsPanel';
import { ImageViewer } from '../components/ImageViewer';

type ScanState = 'idle' | 'scanning' | 'result' | 'tools' | 'error';

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

    // New Feature: Fullscreen Image Viewer
    const [viewingImage, setViewingImage] = useState<{ url: string; title: string } | null>(null);

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
            if (!isDragging || !cardRef.current) return;

            let newX = e.clientX - dragOffset.current.x;
            let newY = e.clientY - dragOffset.current.y;

            // Constrain to viewport (Chrome tab parameters)
            // User requested strict containment within viewport
            const rect = cardRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Strict bounds: 0 to (Viewport - WindowSize)
            const maxX = Math.max(0, viewportWidth - rect.width);
            const maxY = Math.max(0, viewportHeight - rect.height);

            // Clamp Position
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            setPosition({ x: newX, y: newY });
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
        // Check if clicking scrollbar/content area - allow default behavior
        // But since we are dragging from handle only (pill), this is fine.
        // Wait, handleMouseDown is passed to the PILL div only.
        // e.preventDefault(); // Prevent text selection during drag

        const rect = cardRef.current.getBoundingClientRect();

        // If we are currently centered (position is null), we need to set the initial absolute position
        // to exactly where the element currently is, to prevent jumping.
        const currentX = rect.left;
        const currentY = rect.top;

        dragOffset.current = {
            x: e.clientX - currentX,
            y: e.clientY - currentY
        };

        // Switch to absolute positioning immediately prevents snap
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
        // Reset position on close so next open is centered (per user request for centering)
        setPosition(null);
        setViewingImage(null); // Close viewer too
    };

    if (state === 'idle') return null;

    // Calculate safe dimensions
    const toolsWidth = state === 'tools' ? 800 : 400;

    return (
        <React.Fragment>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>



            <div
                className="fixed inset-0 z-[999999] pointer-events-none"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: position ? 0 : 20,
                }}
            >
                <div
                    ref={cardRef}
                    className="pointer-events-auto transition-shadow duration-300"
                    style={position ? {
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                        boxShadow: isDragging ? '0 20px 40px rgba(0,0,0,0.5)' : undefined,
                    } : {
                        position: 'relative',
                    }}
                >
                    <GlassCard className="relative overflow-hidden transition-all duration-300">
                        {/* Inline styles for critical sizing — guarantees viewport containment */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: 'calc(100vh - 80px)',
                            maxWidth: 'calc(100vw - 40px)',
                            width: toolsWidth,
                        }}>

                            {/* Drag Handle (Top 5% approx) */}
                            <div
                                onMouseDown={handleMouseDown}
                                className="absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group"
                                title="Drag to move"
                            >
                                {/* iOS-style Pill */}
                                <div className={`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${isDragging ? 'bg-white/80 w-16' : 'group-hover:bg-white/60'}`} />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 mt-0 shrink-0" style={{ padding: '24px 24px 0 24px' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h2 className="text-lg font-semibold leading-tight m-0">UnDiffused</h2>
                                    </div>
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

                            {/* Scrollable Content Area */}
                            <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 24px 24px 24px' }}>
                                {/* Scanning State */}
                                {state === 'scanning' && (
                                    <div className="relative">
                                        {targetImage && (
                                            <div className="relative mb-4 rounded-xl overflow-hidden border border-white/10">
                                                <img
                                                    src={targetImage}
                                                    alt="Scanning"
                                                    className="w-full h-32 object-cover opacity-50"
                                                />
                                                <div className="absolute inset-0">
                                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                                                </div>
                                            </div>
                                        )}
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
                                        onToolsClick={() => setState('tools')}
                                    />
                                )}

                                {/* Tools State */}
                                {state === 'tools' && targetImage && (
                                    <ForensicToolsPanel
                                        targetImage={targetImage}
                                        onBack={() => setState('result')}
                                        onClose={handleClose}
                                        onMaximize={(img, title) => setViewingImage({ url: img, title })}
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
                            </div>
                        </div>

                        {/* Decorative Gradient Edge */}
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </GlassCard>
                </div>
            </div>
            {/* Fullscreen Image Viewer Overlay - Rendered LAST for stacking order */}
            {viewingImage && (
                <ImageViewer
                    image={viewingImage.url}
                    title={viewingImage.title}
                    onClose={() => setViewingImage(null)}
                />
            )}
        </React.Fragment>
    );
};

export default Scanner;
