import React, { useState, useRef, useCallback } from 'react';
import { ToolCard } from './ToolCard';
import { ELATool } from './tools/ELATool';
import { NoiseTool } from './tools/NoiseTool';
import { CloneTool } from './tools/CloneTool';
import { FFTTool } from './tools/FFTTool';
import { GradientTool } from './tools/GradientTool';
import { PRNUTool } from './tools/PRNUTool';
import { HighlightTool } from './tools/HighlightTool';
import { AberrationTool } from './tools/AberrationTool';
import { CompressionTool } from './tools/CompressionTool';
import { MetadataTool } from './tools/MetadataTool';

interface ForensicToolsPanelProps {
    targetImage: string;
    onBack: () => void;
    onClose: () => void;
}

const TOOLS = [
    { icon: '🔬', title: 'Error Level Analysis', desc: 'Reveals compression inconsistencies', tier: 1 as const, Component: ELATool },
    { icon: '📡', title: 'Noise Pattern Analysis', desc: 'Examines sensor noise distribution', tier: 1 as const, Component: NoiseTool },
    { icon: '🎯', title: 'Clone Detection', desc: 'Identifies duplicated regions', tier: 1 as const, Component: CloneTool },
    { icon: '🌊', title: 'Frequency Domain (FFT)', desc: 'Reveals hidden patterns in frequency space', tier: 1 as const, Component: FFTTool },
    { icon: '📐', title: 'Luminance Gradient', desc: 'Examines edge patterns and textures', tier: 1 as const, Component: GradientTool },
    { icon: '📷', title: 'PRNU Analysis', desc: 'Detects camera sensor fingerprint', tier: 1 as const, Component: PRNUTool },
    { icon: '✨', title: 'Specular Highlights', desc: 'Analyses reflections for consistency', tier: 2 as const, Component: HighlightTool },
    { icon: '🌈', title: 'Chromatic Aberration', desc: 'Detects lens color fringing', tier: 2 as const, Component: AberrationTool },
    { icon: '🔳', title: 'Compression Artifacts', desc: 'Examines JPEG compression layers', tier: 2 as const, Component: CompressionTool },
    { icon: '📋', title: 'Metadata & EXIF', desc: 'Extracts hidden image data', tier: 2 as const, Component: MetadataTool },
];

export const ForensicToolsPanel: React.FC<ForensicToolsPanelProps> = ({ targetImage, onBack, onClose }) => {
    const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [sliderDirection, setSliderDirection] = useState<'ltr' | 'rtl'>('ltr');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleAnalysisResult = useCallback((canvas: HTMLCanvasElement) => {
        setAnalyzedImage(canvas.toDataURL());
    }, []);



    return (
        <div className="forensic-panel animate-fade-in">
            <div className="forensic-header">
                <button className="forensic-back-btn" onClick={onBack} aria-label="Back to results">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Back</span>
                </button>
                <div className="forensic-title">
                    <span>🔍</span>
                    <h2>Forensic Analysis</h2>
                </div>
                <button className="forensic-close-btn" onClick={onClose} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Comparison View */}
            <div
                className="comparison-container"
                ref={containerRef}
            >
                <img src={targetImage} alt="Original" className="comparison-image" />

                {analyzedImage && (
                    <div
                        className="comparison-overlay"
                        style={{
                            width: `${sliderDirection === 'ltr' ? sliderPosition : 100 - sliderPosition}%`,
                            left: sliderDirection === 'ltr' ? 0 : 'auto',
                            right: sliderDirection === 'rtl' ? 0 : 'auto',
                            borderRight: sliderDirection === 'ltr' ? '2px solid #fff' : 'none',
                            borderLeft: sliderDirection === 'rtl' ? '2px solid #fff' : 'none'
                        }}
                    >
                        <img
                            src={analyzedImage}
                            alt="Analyzed"
                            className="comparison-image"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: sliderDirection === 'ltr' ? 0 : 'auto',
                                right: sliderDirection === 'rtl' ? 0 : 'auto',
                                width: containerRef.current?.offsetWidth || '100%',
                                height: '100%',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                )}

                {/* Slider Handle (Visual only, simpler than dragging logic implementation for now) */}
                {analyzedImage && (
                    <div
                        className="comparison-slider-handle"
                        style={{ left: `${sliderPosition}%` }}
                    />
                )}
            </div>

            {/* Controls */}
            {analyzedImage && (
                <div className="comparison-actions">
                    <button className="undo-btn" onClick={() => setAnalyzedImage(null)} title="Undo Analysis">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12" />
                            <path d="M3 3v9h9" />
                        </svg>
                    </button>

                    <input
                        type="range"
                        className="tool-slider"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        style={{ flex: 1, margin: '0 12px' }}
                    />

                    <button
                        className="flip-btn"
                        onClick={() => setSliderDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr')}
                        title="Flip Direction"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 21v-7a4 4 0 0 1 4-4h12" />
                            <path d="M16 6l4 4-4 4" />
                        </svg>
                    </button>
                </div>
            )}

            {!analyzedImage && (
                <div className="forensic-section-title">
                    <span>📊</span>
                    <h3>Select a tool to analyse</h3>
                </div>
            )}

            <div className="forensic-tools-grid">
                {TOOLS.map((tool, index) => (
                    <ToolCard
                        key={tool.title}
                        icon={tool.icon}
                        title={tool.title}
                        description={tool.desc}
                        tier={tool.tier}
                        index={index}
                    >
                        <tool.Component
                            targetImage={targetImage}
                            onResult={handleAnalysisResult}
                        />
                    </ToolCard>
                ))}
            </div>
        </div>
    );
};

export default ForensicToolsPanel;
