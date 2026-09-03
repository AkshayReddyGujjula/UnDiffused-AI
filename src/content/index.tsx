/**
 * UnDiffused Content Script
 * ==========================
 * Injects the Scanner UI into a Shadow DOM for style isolation.
 */


import { createRoot } from 'react-dom/client';
import { Scanner } from './Scanner';
import { injectStyles } from './styles';
import { injectForensicStyles } from './forensic-styles';
import { isScannerReady } from './ready';

/**
 * Answer readiness pings from the background worker.
 *
 * Registered at module scope so it exists the instant the content script runs,
 * rather than after React mounts. The background injects this script into tabs
 * that predate the extension being loaded, then polls PING until `ready` is
 * true before sending a scan request. Without this the first right-click after
 * an extension reload silently does nothing.
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if ((message as { type?: string })?.type === 'PING') {
        sendResponse({ alive: true, ready: isScannerReady() });
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

    // Create Shadow DOM for style isolation
    const shadow = container.attachShadow({ mode: 'open' });

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
