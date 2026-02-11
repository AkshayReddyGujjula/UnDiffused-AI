import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { fetchImageAsDataUrl } from '../utils/fetchImageAsDataUrl';
import {
    IconELA, IconNoise, IconClone, IconFFT, IconGradient,
    IconPRNU, IconHighlights, IconAberration, IconCompression, IconMetadata,
    IconImageAnalysis, IconToolSelect
} from './icons/ForensicIcons';

interface ForensicToolsPanelProps {
    targetImage: string;
    onBack: () => void;
    onClose: () => void;
    onMaximize: (image: string, title: string) => void;
}

const TOOLS = [
    { icon: <IconELA size={20} />, title: 'Error Level Analysis', desc: 'Reveals compression inconsistencies', tier: 1 as const, Component: ELATool },
    { icon: <IconNoise size={20} />, title: 'Noise Pattern Analysis', desc: 'Examines sensor noise distribution', tier: 1 as const, Component: NoiseTool },
    { icon: <IconClone size={20} />, title: 'Clone Detection', desc: 'Identifies duplicated regions', tier: 1 as const, Component: CloneTool },
    { icon: <IconFFT size={20} />, title: 'Frequency Domain (FFT)', desc: 'Reveals hidden patterns in frequency space', tier: 1 as const, Component: FFTTool },
    { icon: <IconGradient size={20} />, title: 'Luminance Gradient', desc: 'Examines edge patterns and textures', tier: 1 as const, Component: GradientTool },
    { icon: <IconPRNU size={20} />, title: 'PRNU Analysis', desc: 'Detects camera sensor fingerprint', tier: 1 as const, Component: PRNUTool },
    { icon: <IconHighlights size={20} />, title: 'Specular Highlights', desc: 'Analyses reflections for consistency', tier: 2 as const, Component: HighlightTool },
    { icon: <IconAberration size={20} />, title: 'Chromatic Aberration', desc: 'Detects lens color fringing', tier: 2 as const, Component: AberrationTool },
    { icon: <IconCompression size={20} />, title: 'Compression Artifacts', desc: 'Examines JPEG compression layers', tier: 2 as const, Component: CompressionTool },
    { icon: <IconMetadata size={20} />, title: 'Metadata & EXIF', desc: 'Extracts hidden image data', tier: 2 as const, Component: MetadataTool },
];

export const ForensicToolsPanel: React.FC<ForensicToolsPanelProps> = ({ targetImage, onBack, onMaximize }) => {
    const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
    const [activeToolTitle, setActiveToolTitle] = useState<string | null>(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [sliderDirection, setSliderDirection] = useState<'ltr' | 'rtl'>('ltr');
    const containerRef = useRef<HTMLDivElement>(null);

    // Convert to data URL on mount to bypass CORS for all tools
    const [safeImageUrl, setSafeImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setSafeImageUrl(null);

        fetchImageAsDataUrl(targetImage)
            .then(dataUrl => {
                if (!cancelled) setSafeImageUrl(dataUrl);
            })
            .catch(err => {
                console.error('[ForensicToolsPanel] Failed to fetch image:', err);
                if (!cancelled) {
                    // Fallback: try to use the original URL anyway (works for same-origin / CORS-friendly servers)
                    setSafeImageUrl(targetImage);
                }
            });

        return () => { cancelled = true; };
    }, [targetImage]);

    const handleAnalysisResult = useCallback((canvas: HTMLCanvasElement, toolTitle: string) => {
        setAnalyzedImage(canvas.toDataURL());
        setActiveToolTitle(toolTitle);
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
                    <IconImageAnalysis size={24} color="#f1f5f9" />
                    <h2>Image Analysis</h2>
                </div>

                <button
                    className="forensic-close-btn"
                    onClick={() => onMaximize(analyzedImage || targetImage, activeToolTitle || "Image Fullscreen")}
                    aria-label="Maximize"
                    title="Open in Fullscreen Viewer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                </button>
            </div>

            {/* Comparison View */}
            <div
                className="comparison-container"
                ref={containerRef}
            >
                <img src={safeImageUrl || targetImage} alt="Original" className="comparison-image" />

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
                    <button className="undo-btn" onClick={() => { setAnalyzedImage(null); setActiveToolTitle(null); }} title="Undo Analysis">
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
                    <IconToolSelect size={20} color="#94a3b8" />
                    <h3>Select a tool to analyse</h3>
                </div>
            )}

            {!safeImageUrl && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.7)' }}>
                    <div className="tool-loading" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }}>
                        Preparing image for analysis...
                    </div>
                </div>
            )}

            {safeImageUrl && (
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
                                targetImage={safeImageUrl}
                                onResult={(canvas) => handleAnalysisResult(canvas, tool.title)}
                            />
                        </ToolCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ForensicToolsPanel;
