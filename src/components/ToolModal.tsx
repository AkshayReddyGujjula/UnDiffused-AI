import React, { useEffect, useRef } from 'react';

interface ToolModalProps {
    title: string;
    icon: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    controls?: React.ReactNode;
}

/**
 * ToolModal Component
 * ===================
 * Full-screen overlay for detailed tool visualizations.
 * Features elastic entry animation, focus trap, and bottom control bar.
 */
export const ToolModal: React.FC<ToolModalProps> = ({
    title,
    icon,
    isOpen,
    onClose,
    children,
    controls
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Keyboard handling (Escape to close)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="tool-modal-backdrop" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div
                ref={modalRef}
                className="tool-modal"
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                {/* Modal Header */}
                <div className="tool-modal-header">
                    <button
                        className="tool-modal-back"
                        onClick={onClose}
                        aria-label="Back to tools"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <div className="tool-modal-title">
                        <span className="tool-modal-title-icon">{icon}</span>
                        <h2>{title}</h2>
                    </div>
                    <button
                        className="tool-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body - visualization area */}
                <div className="tool-modal-body">
                    {children}
                </div>

                {/* Modal Controls - bottom bar */}
                {controls && (
                    <div className="tool-modal-controls">
                        {controls}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToolModal;
