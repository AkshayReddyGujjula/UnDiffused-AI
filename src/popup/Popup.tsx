import React, { useState, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';

export const Popup: React.FC = () => {
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
            handleFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please drop an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;

            // Send message to background script to trigger analysis on the active tab
            chrome.runtime.sendMessage({
                type: 'TRIGGER_SCAN_FROM_POPUP',
                url: dataUrl
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to trigger scan:', chrome.runtime.lastError);
                    alert('Failed to trigger scan: ' + chrome.runtime.lastError.message);
                } else if (response && !response.success) {
                    console.error('Scan trigger error:', response.error);
                    alert('Scan failed: ' + response.error);
                } else {
                    // Success! Close the popup so the user sees the main scanner
                    window.close();
                }
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-[320px] h-auto min-h-[300px] flex flex-col bg-[#0d1117] bg-gradient-to-b from-[#1a1c22] to-[#0d1117] text-white p-4">
            <GlassCard className="flex-1 relative flex flex-col p-4 pt-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-lg font-semibold leading-tight m-0">UnDiffused</h2>
                    </div>
                </div>

                {/* Drop Zone */}
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

                <p className="text-xs text-center text-white/30 mt-4">
                    Image will be analyzed in the active tab
                </p>
            </GlassCard>
        </div>
    );
};
