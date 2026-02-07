/**
 * UnDiffused Background Service Worker
 * =====================================
 * Handles context menu, offscreen document lifecycle, and message routing.
 */

// Track offscreen document state
let offscreenReady = false;

/**
 * Create offscreen document for ONNX inference
 */
async function ensureOffscreenDocument(): Promise<void> {
    if (offscreenReady) return;

    // Check if offscreen document already exists
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [chrome.runtime.getURL('src/offscreen/offscreen.html')]
    });

    if (existingContexts.length > 0) {
        offscreenReady = true;
        return;
    }

    // Create new offscreen document
    await chrome.offscreen.createDocument({
        url: 'src/offscreen/offscreen.html',
        reasons: [chrome.offscreen.Reason.WORKERS],
        justification: 'ONNX inference for AI image detection'
    });

    offscreenReady = true;
    console.log('[UnDiffused] Offscreen document created');
}

/**
 * Analyze image via offscreen document
 */
async function analyzeImage(imageUrl: string): Promise<{ isAI: boolean; confidence: number }> {
    await ensureOffscreenDocument();

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: 'ANALYZE', url: imageUrl },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (response?.success) {
                    resolve({ isAI: response.isAI, confidence: response.confidence });
                } else {
                    reject(new Error(response?.error || 'Analysis failed'));
                }
            }
        );
    });
}

/**
 * Send result to content script
 */
async function sendResultToTab(tabId: number, imageUrl: string, result: { isAI: boolean; confidence: number }): Promise<void> {
    try {
        await chrome.tabs.sendMessage(tabId, {
            type: 'SHOW_RESULT',
            imageUrl,
            ...result
        });
    } catch (error) {
        console.error('[UnDiffused] Failed to send result to tab:', error);
    }
}

/**
 * Handle context menu click
 */
async function handleContextMenuClick(
    info: chrome.contextMenus.OnClickData,
    tab?: chrome.tabs.Tab
): Promise<void> {
    if (info.menuItemId !== 'undiffused-scan') return;
    if (!info.srcUrl || !tab?.id) return;

    console.log('[UnDiffused] Scanning:', info.srcUrl);

    // Notify content script to show scanning state
    await chrome.tabs.sendMessage(tab.id, {
        type: 'SCANNING',
        imageUrl: info.srcUrl
    });

    try {
        const result = await analyzeImage(info.srcUrl);
        await sendResultToTab(tab.id, info.srcUrl, result);
    } catch (error) {
        console.error('[UnDiffused] Analysis failed:', error);
        await chrome.tabs.sendMessage(tab.id, {
            type: 'ERROR',
            imageUrl: info.srcUrl,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

// Create context menu on extension install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'undiffused-scan',
        title: '🔍 Scan with UnDiffused',
        contexts: ['image']
    });

    console.log('[UnDiffused] Context menu created');
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

console.log('[UnDiffused] Background service worker ready');
