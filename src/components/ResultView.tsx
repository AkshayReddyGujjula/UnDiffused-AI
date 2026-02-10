import React, { useState } from 'react';
import { HeatmapCanvas } from './HeatmapCanvas';
import { FilterCanvas } from './FilterCanvas';

export interface ScanResult {
    isAI: boolean;
    confidence: number;
    heatmapData?: number[];
    filterData?: number[];
}

interface ResultViewProps {
    result: ScanResult;
    targetImage: string;
}

export const ResultView: React.FC<ResultViewProps> = ({
    result,
    targetImage
}) => {
    const [heatmapOpacity, setHeatmapOpacity] = useState(0);
    const [filterOpacity, setFilterOpacity] = useState(0);

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

            {/* Image Preview with Overlays */}
            {targetImage && (
                <div className="mt-4">
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20">
                        <img
                            src={targetImage}
                            alt="Analyzed"
                            className="w-full h-auto max-h-[400px] object-contain block"
                        />

                        {/* Heatmap Overlay */}
                        {result.heatmapData && (
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                                style={{ opacity: heatmapOpacity / 100 }}
                            >
                                <HeatmapCanvas data={result.heatmapData} />
                            </div>
                        )}

                        {/* High Pass Filter Overlay */}
                        {result.filterData && (
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity duration-150 mix-blend-screen"
                                style={{ opacity: filterOpacity / 100 }}
                            >
                                <FilterCanvas data={result.filterData} />
                            </div>
                        )}
                    </div>

                    {/* Heatmap Slider */}
                    {result.heatmapData && (
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
                                    <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
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
                    )}

                    {/* High Pass Filter Slider */}
                    {result.filterData && (
                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                    High Pass Filter
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={filterOpacity}
                                onChange={(e) => setFilterOpacity(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, rgba(59, 130, 246, 0.3) ${filterOpacity}%, rgba(34, 211, 238, 0.5) ${filterOpacity}%)`
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <button
                onClick={() => {
                    const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(targetImage)}`;
                    window.open(searchUrl, '_blank');
                }}
                className="w-full py-3 mt-8 rounded-xl bg-white/20 hover:bg-white/25 border border-white/20 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">Search with Google</span>
            </button>

            {/* Privacy Notice */}
            <p className="mt-6 text-[10px] text-white/30 tracking-wide">
                🔒 All processing done locally on your device
            </p>
        </div>
    );
};
