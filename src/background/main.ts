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
async function analyzeImage(imageUrl: string): Promise<{ isAI: boolean; confidence: number; heatmapData: number[]; filterData: number[] }> {
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
                    resolve({
                        isAI: response.isAI,
                        confidence: response.confidence,
                        heatmapData: response.heatmapData || [],
                        filterData: response.filterData || []
                    });
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
async function sendResultToTab(tabId: number, imageUrl: string, result: { isAI: boolean; confidence: number; heatmapData: number[]; filterData: number[] }): Promise<void> {
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

    const tabId = tab.id;

    // Notify content script to show scanning state (don't block on this)
    try {
        await chrome.tabs.sendMessage(tabId, {
            type: 'SCANNING',
            imageUrl: info.srcUrl
        });
    } catch (e) {
        console.warn('[UnDiffused] Could not notify content script of scanning state:', e);
        // Continue anyway - the content script might not be ready yet
    }

    try {
        const result = await analyzeImage(info.srcUrl);

        // Try to send result to content script
        try {
            await sendResultToTab(tabId, info.srcUrl, result);
        } catch (e) {
            console.warn('[UnDiffused] Could not send result to content script:', e);
            // Show result via notification as fallback
            console.log('[UnDiffused] Result:', result.isAI ? 'AI-GENERATED' : 'REAL', result.confidence + '%');
        }
    } catch (error) {
        console.error('[UnDiffused] Analysis failed:', error);
        try {
            await chrome.tabs.sendMessage(tabId, {
                type: 'ERROR',
                imageUrl: info.srcUrl,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } catch (e) {
            console.warn('[UnDiffused] Could not send error to content script:', e);
        }
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

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'REQUEST_ANALYSIS') {
        analyzeImage(message.url || '')
            .then(result => {
                sendResponse({ success: true, ...result });
            })
            .catch(error => {
                console.error('[UnDiffused] Analysis error:', error);
                sendResponse({ success: false, error: error.message });
            });

        // Return true to indicate async response
        return true;
    }

    // Fetch image and convert to data URL (CORS bypass for content scripts)
    if (message.type === 'FETCH_IMAGE_AS_DATA_URL') {
        const imageUrl = message.url;
        if (!imageUrl) {
            sendResponse({ success: false, error: 'No URL provided' });
            return;
        }

        fetch(imageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    sendResponse({ success: true, dataUrl: reader.result as string });
                };
                reader.onerror = () => {
                    sendResponse({ success: false, error: 'Failed to read blob' });
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error('[UnDiffused] Image fetch error:', error);
                sendResponse({ success: false, error: error.message });
            });

        // Return true to indicate async response
        return true;
    }

    // Handle scan trigger from extension popup
    if (message.type === 'TRIGGER_SCAN_FROM_POPUP') {
        const dataUrl = message.url;

        // Get the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const activeTab = tabs[0];
            if (!activeTab?.id) {
                sendResponse({ success: false, error: 'No active tab found' });
                return;
            }

            try {
                // 1. Notify content script to show "Scanning" state immediately
                await chrome.tabs.sendMessage(activeTab.id, {
                    type: 'SCANNING',
                    imageUrl: dataUrl
                });

                // 2. Perform analysis in background (offscreen)
                const result = await analyzeImage(dataUrl);

                // 3. Send result to content script
                await sendResultToTab(activeTab.id, dataUrl, result);

                sendResponse({ success: true });

            } catch (error: any) {
                console.error('[UnDiffused] Popup scan failed:', error);

                // Notify content script of error
                chrome.tabs.sendMessage(activeTab.id, {
                    type: 'ERROR',
                    error: error.message || 'Analysis failed'
                }).catch(e => console.warn('Could not send error to tab:', e));

                sendResponse({ success: false, error: error.message });
            }
        });

        return true; // Async response
    }
});

console.log('[UnDiffused] Background service worker ready');
