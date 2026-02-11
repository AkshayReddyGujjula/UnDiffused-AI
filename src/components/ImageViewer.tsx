import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';

interface ImageViewerProps {
    image: string;
    title: string;
    onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ image, title, onClose }) => {
    // Window State
    const [windowState, setWindowState] = useState({
        x: (window.innerWidth - 800) / 2,
        y: (window.innerHeight - 600) / 2,
        width: 800,
        height: 600
    });
    const [isDraggingWindow, setIsDraggingWindow] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    // Image Transform State
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);

    // Refs
    const dragStartRef = useRef({ x: 0, y: 0 });
    const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const panStartRef = useRef({ x: 0, y: 0, imgX: 0, imgY: 0 });
    const contentRef = useRef<HTMLDivElement>(null);

    // --- Window Dragging ---
    const handleWindowMouseDown = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) return; // Only trigger on header background
        setIsDraggingWindow(true);
        dragStartRef.current = { x: e.clientX - windowState.x, y: e.clientY - windowState.y };
    };

    // --- Window Resizing ---
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            width: windowState.width,
            height: windowState.height
        };
    };

    // --- Image Panning ---
    const handleImageMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPanning(true);
        panStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            imgX: transform.x,
            imgY: transform.y
        };
    };

    // --- Global Mouse Move/Up ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingWindow) {
                setWindowState(prev => ({
                    ...prev,
                    x: e.clientX - dragStartRef.current.x,
                    y: e.clientY - dragStartRef.current.y
                }));
            }
            if (isResizing) {
                const deltaX = e.clientX - resizeStartRef.current.x;
                const deltaY = e.clientY - resizeStartRef.current.y;
                setWindowState(prev => ({
                    ...prev,
                    width: Math.max(400, resizeStartRef.current.width + deltaX),
                    height: Math.max(300, resizeStartRef.current.height + deltaY)
                }));
            }
            if (isPanning) {
                const deltaX = (e.clientX - panStartRef.current.x);
                const deltaY = (e.clientY - panStartRef.current.y);
                setTransform(prev => ({
                    ...prev,
                    x: panStartRef.current.imgX + deltaX,
                    y: panStartRef.current.imgY + deltaY
                }));
            }
        };

        const handleMouseUp = () => {
            setIsDraggingWindow(false);
            setIsResizing(false);
            setIsPanning(false);
        };

        if (isDraggingWindow || isResizing || isPanning) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingWindow, isResizing, isPanning]);

    // --- Zoom (Wheel + Pinch) ---
    // --- Zoom (Wheel + Pinch) ---
    // --- Zoom (Wheel + Pinch) ---
    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const rect = element.getBoundingClientRect();

            // Mouse position relative to container center
            const mRelativeX = e.clientX - rect.left - rect.width / 2;
            const mRelativeY = e.clientY - rect.top - rect.height / 2;

            const zoomSensitivity = 0.001;
            const delta = -e.deltaY * zoomSensitivity;

            setTransform(prev => {
                const newScale = Math.min(Math.max(0.1, prev.scale + delta * prev.scale * 5), 10);

                if (newScale === prev.scale) return prev;

                const ratio = newScale / prev.scale;
                const newX = mRelativeX - (mRelativeX - prev.x) * ratio;
                const newY = mRelativeY - (mRelativeY - prev.y) * ratio;

                return { scale: newScale, x: newX, y: newY };
            });
        };

        // Pinch-to-zoom for touch devices
        let lastTouchDist = 0;
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                lastTouchDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );

                const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

                const rect = element.getBoundingClientRect();
                const mRelativeX = midX - rect.left - rect.width / 2;
                const mRelativeY = midY - rect.top - rect.height / 2;

                if (lastTouchDist > 0) {
                    const zoomSensitivity = 0.01;
                    const delta = (dist - lastTouchDist) * zoomSensitivity;

                    setTransform(prev => {
                        const newScale = Math.min(Math.max(0.1, prev.scale + delta * prev.scale), 10);
                        if (newScale === prev.scale) return prev;
                        const ratio = newScale / prev.scale;
                        return {
                            scale: newScale,
                            x: mRelativeX - (mRelativeX - prev.x) * ratio,
                            y: mRelativeY - (mRelativeY - prev.y) * ratio
                        };
                    });
                }
                lastTouchDist = dist;
            }
        };

        const handleTouchEnd = () => {
            lastTouchDist = 0;
        };

        element.addEventListener('wheel', handleWheel, { passive: false });
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('wheel', handleWheel);
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <div
            className="fixed pointer-events-auto"
            style={{
                left: windowState.x,
                top: windowState.y,
                width: windowState.width,
                height: windowState.height,
                zIndex: 2147483647
            }}
        >
            <GlassCard className="w-full h-full flex flex-col overflow-hidden relative shadow-2xl">
                {/* Header / Drag Handle */}
                <div
                    className="h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5"
                    onMouseDown={handleWindowMouseDown}
                >
                    <div className="flex items-center gap-2 pointer-events-none">
                        <span className="text-lg">🔍</span>
                        <h3 className="font-medium text-white/90">{title} Result</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Image Content */}
                <div
                    ref={contentRef}
                    className="flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing"
                    onMouseDown={handleImageMouseDown}
                >
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                        }}
                    >
                        <img
                            src={image}
                            alt="Analyzed Result"
                            className="max-w-none pointer-events-none select-none shadow-lg"
                            style={{ maxWidth: 'none', maxHeight: 'none' }} // Allow growing beyond bounds
                            draggable={false}
                        />
                    </div>

                    {/* Zoom Indicator */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none">
                        {Math.round(transform.scale * 100)}%
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg"
                    onMouseDown={handleResizeMouseDown}
                >
                    <svg className="absolute bottom-1 right-1 w-3 h-3 text-white/40" viewBox="0 0 10 10" fill="currentColor">
                        <path d="M10 10 L10 0 L0 10 Z" />
                    </svg>
                </div>
            </GlassCard>
        </div>
    );
};
