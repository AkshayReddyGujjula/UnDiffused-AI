import React, { useState } from 'react';

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    tier: 1 | 2;
    index: number;
    children?: React.ReactNode;
}

/**
 * ToolCard Component
 * ==================
 * Reusable expand/collapse card for forensic tools.
 * Features liquid glass hover effect, staggered entry animation,
 * and smooth expand/collapse transitions.
 */
export const ToolCard: React.FC<ToolCardProps> = ({
    icon,
    title,
    description,
    tier,
    index,
    children
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`tool-card ${isExpanded ? 'tool-card-expanded' : ''}`}
            style={{
                animationDelay: `${index * 80}ms`
            }}
        >
            {/* Header - always visible */}
            <button
                className="tool-card-header"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-label={`${title} - ${description}`}
            >
                <div className="tool-card-icon">
                    {icon}
                </div>
                <div className="tool-card-info">
                    <h3 className="tool-card-title">{title}</h3>
                    <p className="tool-card-desc">{description}</p>
                </div>
                <div className={`tool-card-chevron ${isExpanded ? 'tool-card-chevron-open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </button>

            {/* Tier badge */}
            {tier === 2 && (
                <div className="tool-card-tier-badge">Advanced</div>
            )}

            {/* Expandable content */}
            <div className={`tool-card-content ${isExpanded ? 'tool-card-content-open' : ''}`}>
                <div className="tool-card-content-inner">
                    {children || (
                        <div className="tool-card-placeholder">
                            <p>Tool controls will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolCard;
