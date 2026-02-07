import React, { useState, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ResultView, ScanResult } from '../components/ResultView';

type AnalysisState = 'idle' | 'analyzing' | 'result' | 'error';

export const Popup: React.FC = () => {
    const [state, setState] = useState<AnalysisState>('idle');
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);


    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            analyzeFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            analyzeFile(files[0]);
        }
    };

    const analyzeFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please drop an image file');
            setState('error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setTargetImage(dataUrl);
            startAnalysis(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const startAnalysis = (dataUrl: string) => {
        setState('analyzing');
        setError(null);
        setResult(null);


        // Send message to background script to trigger analysis
        chrome.runtime.sendMessage({
            type: 'REQUEST_ANALYSIS',
            url: dataUrl
        }, (response) => {
            if (chrome.runtime.lastError) {
                setError(chrome.runtime.lastError.message || 'Analysis failed');
                setState('error');
            } else if (response.error) {
                setError(response.error);
                setState('error');
            } else {
                setResult(response);
                setState('result');
            }
        });
    };

    const handleClose = () => {
        setState('idle');
        setResult(null);
        setError(null);
        setTargetImage(null);

    };

    return (
        <div className="w-[320px] h-auto min-h-[400px] flex flex-col bg-gray-900 text-white overflow-hidden p-4">
            <GlassCard className="flex-1 relative overflow-hidden flex flex-col p-4">
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
                    {state !== 'idle' && (
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Idle / Drop Zone State */}
                {state === 'idle' && (
                    <div
                        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors duration-200 cursor-pointer relative
                            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}
                        `}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <p className="text-sm text-center text-white/80 font-medium">
                            Drop image here
                        </p>
                        <p className="text-xs text-center text-white/50 mt-1">
                            or click to browse
                        </p>
                    </div>
                )}

                {/* Analyzing State */}
                {state === 'analyzing' && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {targetImage && (
                            <div className="relative mb-6 rounded-xl overflow-hidden border border-white/10 w-full aspect-square">
                                <img
                                    src={targetImage}
                                    alt="Scanning"
                                    className="w-full h-full object-cover opacity-50"
                                />
                                {/* Laser Scanner Effect */}
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
                    />
                )}

                {/* Error State */}
                {state === 'error' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 border border-red-500/30">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Analysis Failed</h3>
                        <p className="text-sm text-white/50 mb-6">{error}</p>
                        <button
                            onClick={() => setState('idle')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};
