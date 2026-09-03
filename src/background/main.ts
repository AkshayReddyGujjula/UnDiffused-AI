/**
 * UnDiffused Background Service Worker
 * =====================================
 * Context menu, content-script lifecycle, and message routing.
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

import { isBlockedHost, isValidImageUrl } from './urlGuard';

function isBackgroundMessage(message: unknown): message is BackgroundMessage {
    if (!message || typeof message !== 'object') return false;
    const candidate = message as Partial<BackgroundMessage>;
    return (
        (candidate.type === 'FETCH_IMAGE_AS_DATA_URL' || candidate.type === 'TRIGGER_SCAN_FROM_POPUP') &&
        typeof candidate.url === 'string'
    );
}

/**
 * Ensure the tab has a live, listening content script, injecting one if needed.
 *
 * Manifest-declared content scripts are injected only when a page loads. Every
 * tab that was already open when the extension was installed, reloaded or
 * updated therefore has none, and chrome.tabs.sendMessage fails with
 * "Could not establish connection. Receiving end does not exist."
 *
 * The previous version caught that and logged a warning, so from the user's
 * side right-click did nothing at all. This injects on demand, then waits for
 * the Scanner to actually mount -- its SCANNING listener is registered inside a
 * React effect, so "the script has run" and "the script can receive a scan"
 * are two different moments, and a message sent between them is dropped.
 */
async function ensureContentScript(tabId: number): Promise<boolean> {
    // frameId 0 pins this to the top frame. Without it, sendMessage fans out to
    // every frame in the tab and the first reply wins, so an ad iframe can
    // answer on behalf of the page.
    const ping = async (): Promise<{ alive?: boolean } | null> => {
        try {
            return await chrome.tabs.sendMessage(tabId, { type: 'PING' },
                                                 { frameId: 0 });
        } catch {
            return null;
        }
    };

    if ((await ping())?.alive) return true;

    const files = chrome.runtime.getManifest().content_scripts?.[0]?.js;
    if (!files?.length) {
        console.error('[UnDiffused] No content script declared in the manifest.');
        return false;
    }
    try {
        await chrome.scripting.executeScript({
            target: { tabId, frameIds: [0] }, files
        });
    } catch (e) {
        // Restricted pages cannot be scripted at all: chrome://, the Chrome Web
        // Store, the PDF viewer, and file:// without the opt-in.
        console.error('[UnDiffused] Cannot inject into this tab:', e);
        return false;
    }

    // Only wait for the listener to exist, not for React to mount. A request
    // arriving before mount is buffered by the content script and replayed.
    for (let attempt = 0; attempt < 30; attempt++) {
        if ((await ping())?.alive) return true;
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.error('[UnDiffused] Content script injected but never responded.');
    return false;
}

/**
 * Surface a failure to the user instead of only to the console.
 *
 * A scan that silently does nothing is indistinguishable from a broken
 * extension, which is exactly how the previous bug presented.
 */
function reportUnavailable(reason: string): void {
    console.error('[UnDiffused]', reason);
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
    chrome.action.setTitle({ title: 'UnDiffused: ' + reason });
    setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
        chrome.action.setTitle({ title: 'UnDiffused' });
    }, 6000);
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

    const ready = await ensureContentScript(tab.id);
    if (!ready) {
        reportUnavailable('cannot scan on this page - try reloading the tab');
        return;
    }

    try {
        await chrome.tabs.sendMessage(tab.id, {
            type: 'SCANNING',
            imageUrl: info.srcUrl
        }, { frameId: 0 });
    } catch (e) {
        // Readiness was already confirmed by ensureContentScript, so a closed
        // message port here means the listener acknowledged and moved on rather
        // than that the scan failed. Only a genuine connection loss is an error.
        const msg = String((e as Error)?.message ?? e);
        if (msg.includes('message port closed')) {
            console.debug('[UnDiffused] port closed after dispatch (scan is running)');
            return;
        }
        console.error('[UnDiffused] sendMessage failed after readiness:', e);
        reportUnavailable('scan request failed - try reloading the tab');
    }
}

/**
 * Register the context menu.
 *
 * removeAll() first because create() throws "Cannot create item with duplicate
 * id" when the entry already exists, which happens on reload.
 */
function registerContextMenu(): void {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'undiffused-scan',
            title: 'Scan with UnDiffused',
            contexts: ['image']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('[UnDiffused] Context menu:', chrome.runtime.lastError.message);
            } else {
                console.log('[UnDiffused] Context menu created');
            }
        });
    });
}

chrome.runtime.onInstalled.addListener(registerContextMenu);
// The service worker is torn down when idle and menus must survive a browser
// restart, which onInstalled does not cover.
chrome.runtime.onStartup.addListener(registerContextMenu);

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Require a positive identity match. The previous form was
    // `sender.id && sender.id !== chrome.runtime.id`, which let a message with
    // no sender.id through the check entirely.
    if (sender.id !== chrome.runtime.id) {
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

        // credentials 'omit': this worker can reach any origin the user has
        // cookies for, and the URL is page-controlled. Sending ambient
        // credentials would let a page pull authenticated content it could not
        // read itself.
        fetch(imageUrl, { credentials: 'omit', redirect: 'follow' })
            .then(response => {
                // Re-check the host the response actually came from. Validating
                // only the URL we asked for leaves the guard trivially
                // bypassable: a permitted public host can answer 302 with a
                // Location inside the blocked ranges, and fetch follows it. A
                // service worker cannot inspect the hops (redirect 'manual'
                // yields an opaque response with no readable Location), so the
                // check happens on the final response.url instead, before the
                // body is read.
                //
                // Residual, stated rather than hidden: the request itself is
                // still issued, so a blind GET to an internal address remains
                // possible. What this prevents is the response coming back.
                try {
                    if (isBlockedHost(new URL(response.url).hostname)) {
                        throw new Error('Redirected to a blocked host');
                    }
                } catch (e) {
                    throw e instanceof Error ? e : new Error('Bad response URL');
                }
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

        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const activeTab = tabs[0];
            if (!activeTab?.id) {
                sendResponse({ success: false, error: 'No active tab found' });
                return;
            }

            try {
                const ready = await ensureContentScript(activeTab.id);
                if (!ready) {
                    reportUnavailable('cannot scan on this page - try reloading the tab');
                    sendResponse({ success: false, error: 'Content script unavailable' });
                    return;
                }

                await chrome.tabs.sendMessage(activeTab.id, {
                    type: 'SCANNING',
                    imageUrl: dataUrl
                }, { frameId: 0 });

                sendResponse({ success: true });

            } catch (error: any) {
                console.error('[UnDiffused] Popup scan failed:', error);

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
