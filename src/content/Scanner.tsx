import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ResultView, ScanResult } from '../components/ResultView';
import { ForensicToolsPanel } from '../components/ForensicToolsPanel';
import { ImageViewer } from '../components/ImageViewer';
import { runMultiCropInference, cancelAllInferences } from './inference/pipeline';
import { fetchImageViaBackground } from './inference/imageLoader';

type ScanState = 'idle' | 'scanning' | 'result' | 'tools' | 'error';

export const Scanner: React.FC = () => {
    const [state, setState] = useState<ScanState>('idle');
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);
    const [viewingImage, setViewingImage] = useState<{ url: string; title: string } | null>(null);

    // Deep Scan State
    const [isDeepScanning, setIsDeepScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    // Dragging state
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    // Cache the bitmap to re-use for Deep Scan
    const imageBitmapRef = useRef<ImageBitmap | null>(null);
    const scanTokenRef = useRef(0);
    const isShuttingDownRef = useRef(false);

    const runScan = async (url: string, mode: 'default' | 'deep') => {
        if (isShuttingDownRef.current) {
            return;
        }
        const scanToken = ++scanTokenRef.current;

        try {
            if (mode === 'default') {
                setState('scanning');
                setIsDeepScanning(false);
            } else {
                setIsDeepScanning(true);
                setProgress(0);
            }

            // Load image if not cached or if URL changed
            // NOTE: We transfer the bitmap to the worker, so it becomes unusable. 
            // We must re-fetch/create it for every scan if cache is empty.
            let bitmap = imageBitmapRef.current;
            if (!bitmap || targetImage !== url) {
                bitmap = await fetchImageViaBackground(url);
            }

            // We do NOT cache it here because we are about to transfer it.
            // If we wanted to cache, we'd need to .clone() it, but that's expensive for memory.
            // Better to re-fetch/re-create for the rare case of re-scanning.
            imageBitmapRef.current = null; // Clear cache as we're giving it away

            const start = performance.now();

            // This transfers the bitmap to the worker
            const res = await runMultiCropInference(bitmap, mode, (processed, total) => {
                if (total > 0) {
                    const p = Math.floor((processed / total) * 100);
                    // console.log(`[Scanner] Progress: ${p}% (${processed}/${total})`);
                    setProgress(p);
                }
            });

            const end = performance.now();

            res.inferenceTime = end - start;
            if (scanToken !== scanTokenRef.current) {
                return;
            }

            setResult({
                isAI: res.isAI,
                confidence: res.confidence,
                heatmapData: [],
                filterData: []
            });
            setState('result');
            setIsDeepScanning(false);

        } catch (e: any) {
            if (scanToken !== scanTokenRef.current) {
                return;
            }
            console.error('[UnDiffused] Analysis failed:', e);
            setError(e.message || 'Failed to analyze image');
            setState('error');
            setIsDeepScanning(false);
            imageBitmapRef.current = null;
        }
    };

    useEffect(() => {
        const handleMessage = async (
            message: unknown,
            sender: chrome.runtime.MessageSender
        ) => {
            if (sender.id && sender.id !== chrome.runtime.id) {
                return;
            }
            if (!message || typeof message !== 'object') {
                return;
            }

            const typed = message as { type?: string; imageUrl?: string };
            if (typeof typed.type !== 'string') {
                return;
            }

            if (typed.type === 'SCANNING' && typeof typed.imageUrl === 'string') {
                isShuttingDownRef.current = false;
                scanTokenRef.current += 1;
                setTargetImage(typed.imageUrl);
                setResult(null);
                setError(null);
                // Reset cache on new scan
                imageBitmapRef.current = null;
                runScan(typed.imageUrl, 'default');
            } else if (typed.type === 'ERROR') {
                setState('error');
                setError('An error occurred in background');
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    // ... (Drag handlers truncated for brevity, assume same as before) ...
    // Re-implementing Drag Consumers because Replace requires full block

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !cardRef.current) return;
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;
            const rect = cardRef.current.getBoundingClientRect();
            const maxX = Math.max(0, window.innerWidth - rect.width);
            const maxY = Math.max(0, window.innerHeight - rect.height);
            setPosition({ x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) });
        };
        const handleMouseUp = () => setIsDragging(false);
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
        const rect = cardRef.current.getBoundingClientRect();
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        if (!position) setPosition({ x: rect.left, y: rect.top });
        setIsDragging(true);
    };

    const handleClose = () => {
        isShuttingDownRef.current = true;
        scanTokenRef.current += 1;
        cancelAllInferences('User closed scanner');
        setState('idle');
        setResult(null);
        setError(null);
        setTargetImage(null);
        setIsDeepScanning(false);
        setProgress(0);
        setPosition(null);
        setViewingImage(null);
        imageBitmapRef.current = null;
    };

    if (state === 'idle') return null;

    const toolsWidth = state === 'tools' ? 800 : 400;

    return (
        <React.Fragment>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: 'calc(100vh - 80px)',
                            maxWidth: 'calc(100vw - 40px)',
                            width: toolsWidth,
                        }}>

                            {/* Drag Handle */}
                            <div
                                onMouseDown={handleMouseDown}
                                className="absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group"
                            >
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
                                <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10">
                                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 24px 24px 24px' }}>
                                {/* Scanning State (Initial) */}
                                {state === 'scanning' && !result && (
                                    <div className="relative">
                                        {targetImage && (
                                            <div className="relative mb-4 rounded-xl overflow-hidden border border-white/10">
                                                <img src={targetImage} className="w-full h-32 object-cover opacity-50" />
                                                <div className="absolute inset-0">
                                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow" />
                                            <div className="flex flex-col">
                                                <span className="text-sm text-white/70">
                                                    Analyzing image...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Result State */}
                                {state === 'result' && result && (
                                    <div className="flex flex-col gap-4">
                                        <ResultView
                                            result={result}
                                            targetImage={targetImage || ''}
                                            onToolsClick={() => setState('tools')}
                                            onDeepScanClick={() => targetImage && runScan(targetImage, 'deep')}
                                            isDeepScanning={isDeepScanning}
                                            deepScanProgress={progress}
                                        />
                                    </div>
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

                        {/* Edge Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </GlassCard>
                </div>
            </div>

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
