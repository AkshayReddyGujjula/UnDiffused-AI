/**
 * UnDiffused Content Script
 * ==========================
 * Injects the Scanner UI into a Shadow DOM for style isolation.
 */


import { createRoot } from 'react-dom/client';
import { Scanner } from './Scanner';
import { injectStyles } from './styles';
import { injectForensicStyles } from './forensic-styles';
import { isScannerReady, deliverScan } from './ready';

/**
 * Receive scan requests at module scope, before React exists.
 *
 * Registered the instant the content script runs, rather than when the Scanner
 * mounts. A request arriving before mount is buffered by the bridge and
 * replayed on mount, so the background can fire and forget instead of polling
 * for readiness -- polling deadlocked whenever an iframe answered first and
 * never mounted a React app of its own.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id !== chrome.runtime.id) return undefined;
    const typed = message as { type?: string; imageUrl?: string } | null;
    if (!typed || typeof typed.type !== 'string') return undefined;

    if (typed.type === 'PING') {
        sendResponse({ alive: true, ready: isScannerReady() });
        return undefined;
    }

    if (typed.type === 'SCANNING' && typeof typed.imageUrl === 'string') {
        deliverScan(typed.imageUrl);
        sendResponse({ received: true });
        return undefined;
    }

    return undefined;
});

// Avoid multiple injections
if (!document.getElementById('undiffused-root')) {
    // Create container element
    const container = document.createElement('div');
    container.id = 'undiffused-root';
    document.body.appendChild(container);

    // Closed, not open. Style isolation is the reason the shadow root exists,
    // but an open root is also readable by the page: `container.shadowRoot`
    // would let hostile page script read the verdict and, when the scanned
    // image came from a local file, its base64 data URL. Nothing in this
    // extension reaches the root from outside; components inside use
    // getRootNode(), which still works when the root is closed.
    const shadow = container.attachShadow({ mode: 'closed' });

    // Inject Tailwind styles into shadow DOM
    injectStyles(shadow);

    // Inject forensic toolkit styles
    injectForensicStyles(shadow);

    // Create React mount point inside shadow
    const mountPoint = document.createElement('div');
    mountPoint.id = 'undiffused-app';
    shadow.appendChild(mountPoint);

    // Create Portal root for floating elements
    const portalRoot = document.createElement('div');
    portalRoot.id = 'undiffused-portal-root';
    Object.assign(portalRoot.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '0',
        zIndex: '2147483647', // Max z-index
        pointerEvents: 'none', // Let clicks pass through
        overflow: 'visible'
    });
    shadow.appendChild(portalRoot);

    // Mount React app
    const root = createRoot(mountPoint);
    root.render(<Scanner />);

    console.log('[UnDiffused] Content script injected');
}
