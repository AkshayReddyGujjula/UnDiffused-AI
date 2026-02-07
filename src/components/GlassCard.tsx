import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
}

/**
 * GlassCard Component
 * ====================
 * A reusable "Liquid Glass" container implementing Apple's optical physics design.
 * 
 * Design Specs:
 * - Surface: bg-black/30 (dark, translucent)
 * - Optical Physics: backdrop-blur(24px) saturate(180%) brightness(120%)
 * - Specular Edges: border-white/10 with inner shadow for top-down lighting
 * - Typography: SF Pro / Inter, white, tracking-wide
 */
export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    animate = true
}) => {
    return (
        <div
            className={`
        /* Base Surface */
        bg-black/30
        
        /* Optical Physics - The Magic */
        backdrop-blur-[24px]
        backdrop-saturate-[180%]
        backdrop-brightness-[120%]
        
        /* Specular Edges - Light Simulation */
        border
        border-white/10
        
        /* Inner Glow - Top-down Lighting */
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),_0_8px_32px_rgba(0,0,0,0.4)]
        
        /* Shape */
        rounded-2xl
        
        /* Entry Animation */
        ${animate ? 'animate-glass-in' : ''}
        
        /* Typography Defaults */
        text-white
        font-sans
        tracking-wide
        
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default GlassCard;
