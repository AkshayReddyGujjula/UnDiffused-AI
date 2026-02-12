/**
 * UnDiffused Background Service Worker
 * =====================================
 * Handles context menu, offscreen document lifecycle, and message routing.
 */

type FetchImageMessage = {
    type: 'FETCH_IMAGE_AS_DATA_URL';
    url: string;
};

type TriggerScanMessage = {
    type: 'TRIGGER_SCAN_FROM_POPUP';
    url: string;
};

type BackgroundMessage = FetchImageMessage | TriggerScanMessage;

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'data:', 'blob:']);

function isBackgroundMessage(message: unknown): message is BackgroundMessage {
    if (!message || typeof message !== 'object') return false;
    const candidate = message as Partial<BackgroundMessage>;
    return (
        (candidate.type === 'FETCH_IMAGE_AS_DATA_URL' || candidate.type === 'TRIGGER_SCAN_FROM_POPUP') &&
        typeof candidate.url === 'string'
    );
}

function isValidImageUrl(rawUrl: string): boolean {
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
        return true;
    }

    try {
        const parsed = new URL(rawUrl);
        return ALLOWED_PROTOCOLS.has(parsed.protocol);
    } catch {
        return false;
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

    console.log('[UnDiffused] Triggering scan for:', info.srcUrl);

    // Notify content script to start scanning
    // The content script will handle the inference locally
    try {
        await chrome.tabs.sendMessage(tab.id, {
            type: 'SCANNING',
            imageUrl: info.srcUrl
        });
    } catch (e) {
        console.warn('[UnDiffused] Could not notify content script:', e);
        // If content script isn't loaded (e.g. extension updated/reloaded), 
        // we might need to inject it or alert user to refresh.
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
// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id && sender.id !== chrome.runtime.id) {
        sendResponse({ success: false, error: 'Unauthorized sender' });
        return;
    }

    if (!isBackgroundMessage(message)) {
        sendResponse({ success: false, error: 'Invalid message format' });
        return;
    }

    // Fetch image and convert to data URL (CORS bypass for content scripts)
    if (message.type === 'FETCH_IMAGE_AS_DATA_URL') {
        const imageUrl = message.url;
        if (!isValidImageUrl(imageUrl)) {
            sendResponse({ success: false, error: 'Invalid URL provided' });
            return;
        }

        if (imageUrl.startsWith('data:')) {
            sendResponse({ success: true, dataUrl: imageUrl });
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
        if (!isValidImageUrl(dataUrl)) {
            sendResponse({ success: false, error: 'Invalid URL provided' });
            return;
        }

        // Get the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const activeTab = tabs[0];
            if (!activeTab?.id) {
                sendResponse({ success: false, error: 'No active tab found' });
                return;
            }

            try {
                // Notify content script to show "Scanning" state immediately
                // The content script will handle the inference itself
                await chrome.tabs.sendMessage(activeTab.id, {
                    type: 'SCANNING',
                    imageUrl: dataUrl
                });

                sendResponse({ success: true });

            } catch (error: any) {
                console.error('[UnDiffused] Popup scan failed:', error);

                // Notify content script of error
                chrome.tabs.sendMessage(activeTab.id, {
                    type: 'ERROR',
                    error: error.message || 'Scan trigger failed'
                }).catch(e => console.warn('Could not send error to tab:', e));

                sendResponse({ success: false, error: error.message });
            }
        });

        return true; // Async response
    }
});

console.log('[UnDiffused] Background service worker ready');
