import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface LiquidOption<T extends string | number> {
    label: string;
    value: T;
}

interface LiquidSelectProps<T extends string | number> {
    value: T;
    onChange: (value: T) => void;
    options: LiquidOption<T>[];
    placeholder?: string;
    disabled?: boolean;
}

/**
 * LiquidSelect Component
 * =======================
 * A custom dropdown component styled with liquid glass aesthetics.
 * Uses a React Portal to render the dropdown menu outside any
 * overflow:hidden / transform ancestors so it never gets clipped.
 */
export function LiquidSelect<T extends string | number>({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    disabled = false
}: LiquidSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    // Find or create the portal container inside the Shadow DOM.
    // This must be a direct child of the ShadowRoot so it escapes
    // all overflow:hidden and transform ancestors.
    const getPortalContainer = useCallback((): HTMLElement => {
        // Walk up from the trigger to find the ShadowRoot
        const rootNode = triggerRef.current?.getRootNode();
        if (rootNode && rootNode instanceof ShadowRoot) {
            let portal = rootNode.querySelector('#undiffused-portal-root') as HTMLElement | null;
            if (!portal) {
                // Create one if it doesn't exist
                portal = document.createElement('div');
                portal.id = 'undiffused-portal-root';
                Object.assign(portal.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '0',
                    height: '0',
                    overflow: 'visible',
                    zIndex: '2147483647',
                    pointerEvents: 'none',
                });
                rootNode.appendChild(portal);
            }
            return portal;
        }
        // Fallback: use body (shouldn't happen in normal operation)
        return document.body;
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (newValue: T) => {
        onChange(newValue);
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (disabled) return;

        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 6,
                left: rect.left,
                width: rect.width,
            });
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    // Close on click outside — works in Shadow DOM by listening on
    // the root node and checking both the trigger and portal menu.
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: Event) => {
            const target = event.target as Node;
            if (triggerRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setIsOpen(false);
        };

        // Listen on the shadow root (or document) so we catch all clicks
        const root = triggerRef.current?.getRootNode() || document;
        root.addEventListener('mousedown', handleClickOutside);
        return () => root.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on scroll / resize to prevent stale positioning
    useEffect(() => {
        if (!isOpen) return;
        const close = () => setIsOpen(false);
        window.addEventListener('resize', close);
        window.addEventListener('scroll', close, { capture: true });
        return () => {
            window.removeEventListener('resize', close);
            window.removeEventListener('scroll', close, { capture: true });
        };
    }, [isOpen]);

    // The dropdown menu rendered via portal
    const dropdownMenu = (
        <div
            ref={menuRef}
            className="liquid-select-menu"
            role="listbox"
            style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                zIndex: 2147483647,
                pointerEvents: 'auto',
            }}
        >
            {options.map((option) => (
                <div
                    key={String(option.value)}
                    className={`liquid-select-option ${option.value === value ? 'selected' : ''}`}
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                >
                    <span>{option.label}</span>
                    {option.value === value && (
                        <svg
                            className="liquid-select-icon"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="liquid-select-container">
            <button
                ref={triggerRef}
                type="button"
                className={`liquid-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleToggle}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && createPortal(dropdownMenu, getPortalContainer())}
        </div>
    );
}

export default LiquidSelect;
