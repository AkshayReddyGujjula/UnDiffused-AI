import React from 'react';

// Icon Props
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
}

// 1. Error Level Analysis (ELA) - Layers / Magnifying Glass
export const IconELA: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

// 2. Noise Pattern Analysis - Signal / Waveform
export const IconNoise: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 12h2l2-6 4 12 4-12 2 6h4" />
        <circle cx="12" cy="12" r="1" fill={color} stroke="none" />
        <circle cx="4" cy="4" r="1" fill={color} stroke="none" />
        <circle cx="20" cy="20" r="1" fill={color} stroke="none" />
        <circle cx="20" cy="4" r="1" fill={color} stroke="none" />
        <circle cx="4" cy="20" r="1" fill={color} stroke="none" />
    </svg>
);

// 3. Clone Detection - Stamp / Target
export const IconClone: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </svg>
);

// 4. Frequency Domain (FFT) - Spectrum / Wave
export const IconFFT: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 10s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4" />
        <path d="M2 14s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4" style={{ opacity: 0.5 }} />
        <rect x="2" y="6" width="20" height="12" rx="2" strokeOpacity="0.5" />
    </svg>
);

// 5. Luminance Gradient - Gradient / Ramp
export const IconGradient: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 21L21 3" />
        <path d="M3 15L9 21" />
        <path d="M15 3L21 9" />
    </svg>
);

// 6. PRNU Analysis - Camera Sensor / Chip
export const IconPRNU: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
    </svg>
);

// 7. Specular Highlights - Sparkle / Reflection
export const IconHighlights: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5 12 2z" />
        <circle cx="12" cy="12" r="2" opacity="0.5" />
    </svg>
);

// 8. Chromatic Aberration - Split / Prism effect
export const IconAberration: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="9" cy="12" r="6" strokeOpacity="0.8" />
        <circle cx="15" cy="12" r="6" strokeOpacity="0.8" />
        <path d="M12 9a3 3 0 010 6 3 3 0 010-6z" fill={color} fillOpacity="0.2" stroke="none" />
    </svg>
);

// 9. Compression Artifacts - Pixel / Grid
export const IconCompression: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v6h6v6h6" />
        <path d="M3 15h6v6" />
        <rect x="9" y="9" width="6" height="6" strokeOpacity="0.5" />
    </svg>
);

// 10. Metadata & EXIF - Document / Info
export const IconMetadata: React.FC<IconProps> = ({ size = 20, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

// Header Icon - Image Analysis (Minimalist Scan/Focus)
export const IconImageAnalysis: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 8V6a2 2 0 0 1 2-2h2" />
        <path d="M4 16v2a2 2 0 0 0 2 2h2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
        <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 8v-1" opacity="0.5" />
        <path d="M12 17v-1" opacity="0.5" />
        <path d="M8 12h1" opacity="0.5" />
        <path d="M15 12h1" opacity="0.5" />
    </svg>
);

// Selection Icon - Select Tool (Grid / Options)
export const IconToolSelect: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeOpacity="0.4" />
        <path d="M7 17l1.5 1.5 2.5-2.5" />
    </svg>
);
