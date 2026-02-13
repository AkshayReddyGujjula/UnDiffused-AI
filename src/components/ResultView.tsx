import React, { useState } from 'react';

export interface ScanResult {
    isAI: boolean;
    confidence: number;
    heatmapData?: number[];
    heatmapWidth?: number;
    heatmapHeight?: number;
    filterData?: number[];
    cropResults?: { rect: { x: number, y: number, width: number, height: number } }[];
}

interface ResultViewProps {
    result: ScanResult;
    targetImage: string;
    onToolsClick?: () => void;
    onDeepScanClick?: () => void;
    isDeepScanning?: boolean;
    deepScanProgress?: number;
}

export const ResultView: React.FC<ResultViewProps> = ({
    result,
    targetImage,
    onToolsClick,
    onDeepScanClick,
    isDeepScanning = false,
    deepScanProgress = 0
}) => {
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
    const [toolsCursorPos, setToolsCursorPos] = useState({ x: 50, y: 50 });
    const [deepScanCursorPos, setDeepScanCursorPos] = useState({ x: 50, y: 50 });
    const [heatmapOpacity, setHeatmapOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setCursorPos({ x, y });
    };

    const handleToolsMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setToolsCursorPos({ x, y });
    };

    const handleDeepScanMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setDeepScanCursorPos({ x, y });
    };

    const getResultDisplay = () => {
        const { isAI, confidence } = result;

        if (confidence < 66) {
            return {
                label: "Inconclusive",
                containerClass: "bg-white/10 border border-white/20",
                dotClass: "bg-white",
                textClass: "text-white",
                barClass: "bg-white"
            };
        }

        if (isAI) {
            if (confidence >= 90) {
                return {
                    label: "AI Generated",
                    containerClass: "bg-red-500/20 border border-red-500/30",
                    dotClass: "bg-red-400",
                    textClass: "text-red-400",
                    barClass: "bg-red-500"
                };
            }
            return {
                label: "Likely AI Generated",
                containerClass: "bg-red-500/20 border border-red-500/30",
                dotClass: "bg-red-400",
                textClass: "text-red-400",
                barClass: "bg-red-500"
            };
        } else {
            if (confidence >= 90) {
                return {
                    label: "Real Image",
                    containerClass: "bg-green-500/20 border border-green-500/30",
                    dotClass: "bg-green-400",
                    textClass: "text-green-400",
                    barClass: "bg-green-500"
                };
            }
            return {
                label: "Likely a Real Image",
                containerClass: "bg-green-500/20 border border-green-500/30",
                dotClass: "bg-green-400",
                textClass: "text-green-400",
                barClass: "bg-green-500"
            };
        }
    };

    const display = getResultDisplay();

    // Repurposed heatmapOpacity as slider value (0-100)
    // 0 = No crops visible
    // 100 = All crops visible (reveal from left)





    // Normalize opacity/slider to pure reveal progress
    const revealProgress = heatmapOpacity;

    return (
        <div className="animate-fade-in">
            {/* Verdict Badge */}
            <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                ${display.containerClass}
            `}>
                <div className={`w-2 h-2 rounded-full ${display.dotClass}`} />
                <span className={`text-sm font-medium ${display.textClass}`}>
                    {display.label}
                </span>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-white opacity-100 font-medium">Confidence</span>
                    <span className="text-white/50">{result.confidence}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${display.barClass}`}
                        style={{ width: `${result.confidence}%` }}
                    />
                </div>
            </div>

            {/* Image Preview with bottom margin for spacing */}
            {targetImage && (
                <div className="mt-4 mb-4 relative rounded-xl overflow-hidden border border-white/10 bg-black/20 group">
                    <img
                        src={targetImage}
                        alt="Analyzed"
                        className="w-full h-auto max-h-[400px] object-contain block relative z-0"
                    />

                    {/* Crop Visualization Overlay */}
                    {result.cropResults && result.cropResults.length > 0 && result.heatmapWidth && result.heatmapHeight && (
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            {result.cropResults.map((crop, idx) => {
                                // Calculate position percentages
                                const left = (crop.rect.x / result.heatmapWidth!) * 100;
                                const top = (crop.rect.y / result.heatmapHeight!) * 100;
                                const width = (crop.rect.width / result.heatmapWidth!) * 100;
                                const height = (crop.rect.height / result.heatmapHeight!) * 100;

                                // Reveal logic:
                                // Map slider (0-100) to X-axis position (0-100).
                                // If crop's center X is less than slider value, show it.
                                // Determine invalid/default dimensions if missing
                                // (Logic is handled by map calculation)

                                // Reveal logic
                                const centerX = left + (width / 2);
                                const isVisible = centerX <= revealProgress;

                                // Build inline style for robust coloring
                                let borderColor = 'rgba(255, 255, 255, 0.9)';
                                let bgColor = 'rgba(255, 255, 255, 0.2)';

                                if (result.confidence >= 66) {
                                    if (result.isAI) {
                                        borderColor = 'rgba(239, 68, 68, 0.9)'; // Red-500
                                        bgColor = 'rgba(239, 68, 68, 0.3)';
                                    } else {
                                        borderColor = 'rgba(34, 197, 94, 0.9)'; // Green-500
                                        bgColor = 'rgba(34, 197, 94, 0.3)';
                                    }
                                }

                                return (
                                    <div
                                        key={idx}
                                        className="absolute transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                                        style={{
                                            left: `${left}%`,
                                            top: `${top}%`,
                                            width: `${width}%`,
                                            height: `${height}%`,
                                            opacity: isVisible ? 1 : 0,
                                            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                                            border: `1px solid ${borderColor}`,
                                            backgroundColor: bgColor
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Crop Slider Control */}
            {result.cropResults && result.cropResults.length > 0 && (
                <div className="mb-8 px-1 animate-fade-in relative z-10">
                    <div className="relative h-6 flex items-center group">
                        {/* Track */}
                        <div className="absolute inset-x-0 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                            <div
                                className={`h-full ${display.barClass} transition-all duration-100 ease-out`}
                                style={{ width: `${heatmapOpacity}%` }}
                            />
                        </div>

                        {/* Thumb (Visual-only, input covers it) */}
                        <div
                            className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-white/20 pointer-events-none transition-all duration-100 ease-out"
                            style={{
                                left: `calc(${heatmapOpacity}% - 8px)`,
                                boxShadow: `0 0 15px rgba(255,255,255,${0.2 + heatmapOpacity / 200})`
                            }}
                        />

                        {/* Input */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={heatmapOpacity}
                            onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full appearance-none cursor-ew-resize z-20"
                            style={{ opacity: 0, margin: 0 }}
                        />
                    </div>
                </div>
            )}

            {/* Actions Container */}
            <div className="mt-4 flex flex-col gap-3">
                {/* Search with Google Button */}
                <button
                    onClick={async () => {
                        try {
                            const isDataUrl = targetImage.startsWith('data:');

                            // For data URLs or blob URLs, use clipboard fallback
                            if (isDataUrl) {
                                // Convert to blob and copy to clipboard
                                const res = await fetch(targetImage);
                                const blob = await res.blob();

                                await navigator.clipboard.write([
                                    new ClipboardItem({
                                        [blob.type]: blob
                                    })
                                ]);

                                // Open Google Lens upload page
                                window.open('https://lens.google.com/uploadbyurl', '_blank');

                                // Show a brief notification
                                const notification = document.createElement('div');
                                notification.textContent = '📋 Image copied! Press Ctrl+V to paste in Google Lens';
                                notification.style.cssText = `
                                position: fixed;
                                top: 20px;
                                right: 20px;
                                background: rgba(0, 0, 0, 0.9);
                                color: white;
                                padding: 12px 20px;
                                border-radius: 8px;
                                z-index: 999999;
                                font-size: 14px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                backdrop-filter: blur(10px);
                            `;
                                document.body.appendChild(notification);

                                setTimeout(() => {
                                    notification.style.transition = 'opacity 0.3s';
                                    notification.style.opacity = '0';
                                    setTimeout(() => document.body.removeChild(notification), 300);
                                }, 3000);
                            } else {
                                // For standard web URLs, use direct method
                                const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(targetImage)}`;
                                window.open(searchUrl, '_blank');
                            }
                        } catch (err) {
                            console.error('Reverse search failed:', err);
                            // Fallback to direct URL method
                            const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(targetImage)}`;
                            window.open(searchUrl, '_blank');
                        }
                    }}
                    onMouseMove={handleMouseMove}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/20 backdrop-blur-xl flex items-center justify-center gap-3 group shadow-lg hover:scale-[1.05] hover:z-20 transition-all duration-300 relative overflow-hidden"
                    style={{
                        background: `radial-gradient(circle 150px at ${cursorPos.x}% ${cursorPos.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.1) 100%)`,
                        transition: 'background 0.2s ease-out, transform 0.3s ease-out'
                    }}
                >
                    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            className="text-[#4285F4]"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            className="text-[#34A853]"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                            className="text-[#FBBC05]"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            className="text-[#EA4335]"
                        />
                    </svg>
                    <span className="text-base font-semibold text-white/90 group-hover:text-white transition-colors relative z-10">Search with Google</span>
                </button>

                {/* Deep Scan Button */}
                <button
                    onClick={() => {
                        if (onDeepScanClick && !isDeepScanning) onDeepScanClick();
                    }}
                    onMouseMove={handleDeepScanMouseMove}
                    disabled={isDeepScanning}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/20 backdrop-blur-xl flex items-center justify-center gap-3 group shadow-lg hover:scale-[1.05] hover:z-20 transition-all duration-300 relative overflow-hidden disabled:opacity-100 disabled:hover:scale-100 disabled:cursor-wait"
                    style={{
                        background: `radial-gradient(circle 150px at ${deepScanCursorPos.x}% ${deepScanCursorPos.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.1) 100%)`,
                        transition: 'background 0.2s ease-out, transform 0.3s ease-out'
                    }}
                >
                    {isDeepScanning && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                left: 0,
                                width: `${Math.max(5, deepScanProgress)}%`,
                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                backdropFilter: 'blur(12px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                                borderRight: '1.5px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05)',
                                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                zIndex: 5
                            }}
                        >
                            {/* Glass Surface Polish */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '40%',
                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%)'
                            }} />

                            {/* Flowing Water Shimmer */}
                            <style>{`
                                @keyframes fluid-flow {
                                    0% { transform: translateX(-150%) skewX(-30deg); opacity: 0; }
                                    50% { opacity: 1; }
                                    100% { transform: translateX(250%) skewX(-30deg); opacity: 0; }
                                }
                            `}</style>
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                width: '200%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%)',
                                animation: 'fluid-flow 2.5s infinite ease-in-out',
                            }} />
                        </div>
                    )}

                    {isDeepScanning ? (
                        <span className="text-base font-bold text-white relative z-10 flex items-center gap-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                            <span className="animate-pulse">Deep Scanning...</span>
                        </span>
                    ) : (
                        <>
                            <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            <span className="text-base font-semibold text-white/90 group-hover:text-white transition-colors relative z-10">Deep Scan (Slow)</span>
                        </>
                    )}
                </button>

                {/* Tools Button */}
                <button
                    onClick={() => {
                        if (onToolsClick) onToolsClick();
                    }}
                    onMouseMove={handleToolsMouseMove}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/20 backdrop-blur-xl flex items-center justify-center gap-3 group shadow-lg hover:scale-[1.05] hover:z-20 transition-all duration-300 relative overflow-hidden"
                    style={{
                        background: `radial-gradient(circle 150px at ${toolsCursorPos.x}% ${toolsCursorPos.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.1) 100%)`,
                        transition: 'background 0.2s ease-out, transform 0.3s ease-out'
                    }}
                >
                    <svg className="w-5 h-5 text-white/80 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-base font-semibold text-white/90 group-hover:text-white transition-colors relative z-10">Tools</span>
                </button>
            </div>

            {/* Privacy Notice */}
            <p className="mt-6 mb-2 text-[10px] text-white/30 tracking-wide">
                🔒 All processing done locally on your device
            </p>
        </div>
    );
};
