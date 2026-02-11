import React from 'react';

interface ToolActionRowProps {
    label: string;
    onClick: () => void;
    isAnalysing?: boolean;
    disabled?: boolean;
    onHelpClick?: () => void;
}

export const ToolActionRow: React.FC<ToolActionRowProps> = ({
    label,
    onClick,
    isAnalysing = false,
    disabled = false,
    onHelpClick
}) => {
    return (
        <div className="tool-action-row">
            <button
                className={`tool-analyse-btn ${isAnalysing ? 'tool-loading' : ''}`}
                onClick={onClick}
                disabled={disabled || isAnalysing}
            >
                {isAnalysing ? 'Analysing...' : label}
            </button>
            <button
                className="tool-help-btn"
                onClick={onHelpClick}
                title="How does this tool work?"
            >
                <span className="tool-help-icon">?</span>
            </button>
        </div>
    );
};
