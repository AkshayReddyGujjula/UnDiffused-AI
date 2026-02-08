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

            {/* Privacy Notice */}
            <p className="mt-4 text-[10px] text-white/30 tracking-wide">
                🔒 All processing done locally on your device
            </p>
        </div>
    );
};
