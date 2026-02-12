/**
 * UnDiffused Background Service Worker
 * =====================================
 * Handles context menu, offscreen document lifecycle, and message routing.
 */



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
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
