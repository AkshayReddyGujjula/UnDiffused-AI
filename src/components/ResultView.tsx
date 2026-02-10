import React, { useState } from 'react';

export interface ScanResult {
    isAI: boolean;
    confidence: number;
    heatmapData?: number[];
    filterData?: number[];
}

interface ResultViewProps {
    result: ScanResult;
    targetImage: string;
    onToolsClick?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
    result,
    targetImage,
    onToolsClick
}) => {
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
    const [toolsCursorPos, setToolsCursorPos] = useState({ x: 50, y: 50 });

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

    return (
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
                <div className="flex justify-between text-xs">
                    <span className="text-white opacity-100 font-medium">Confidence</span>
                    <span className="text-white/50">{result.confidence}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${result.isAI ? 'bg-red-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${result.confidence}%` }}
                    />
                </div>
            </div>

            {/* Image Preview with bottom margin for spacing */}
            {targetImage && (
                <div className="mt-4 mb-2 relative rounded-xl overflow-hidden border border-white/10 bg-black/20">
                    <img
                        src={targetImage}
                        alt="Analyzed"
                        className="w-full h-auto max-h-[400px] object-contain block"
                    />
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
