/**
 * UnDiffused Content Script
 * ==========================
 * Injects the Scanner UI into a Shadow DOM for style isolation.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Scanner } from './Scanner';
import { injectStyles } from './styles';

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

    // Create React mount point inside shadow
    const mountPoint = document.createElement('div');
    mountPoint.id = 'undiffused-app';
    shadow.appendChild(mountPoint);

    // Mount React app
    const root = createRoot(mountPoint);
    root.render(<Scanner />);

    console.log('[UnDiffused] Content script injected');
}
