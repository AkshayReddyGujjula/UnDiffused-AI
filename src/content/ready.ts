/**
 * Bridge between the content script's entry point and the React app.
 *
 * The problem this solves: the Scanner registers its SCANNING listener inside a
 * React effect, so there is a window between "the content script has executed"
 * and "the content script can act on a scan request". A message sent in that
 * window is dropped silently.
 *
 * The first attempt had the background poll a readiness flag before sending.
 * That turned a dropped message into a deadlock -- chrome.tabs.sendMessage
 * delivers to every frame in the tab, so an iframe whose React app never mounts
 * can answer the ping first and report `ready: false` indefinitely, and the scan
 * never gets sent at all. "Content script injected but never became ready."
 *
 * Buffering removes the race rather than trying to time around it. A request
 * that arrives early is held and replayed the moment the Scanner mounts, so the
 * background never has to know whether React is up.
 */

type ScanHandler = (imageUrl: string) => void;

let handler: ScanHandler | null = null;
let pending: string | null = null;

/** Called by the Scanner on mount. Immediately drains any buffered request. */
export function registerScanHandler(fn: ScanHandler): void {
    handler = fn;
    if (pending !== null) {
        const url = pending;
        pending = null;
        fn(url);
    }
}

export function unregisterScanHandler(): void {
    handler = null;
}

/**
 * Deliver a scan request, buffering it if the Scanner has not mounted yet.
 * Only the most recent request is kept: an older queued scan is stale by
 * definition once a newer one arrives.
 */
export function deliverScan(imageUrl: string): void {
    if (handler) {
        handler(imageUrl);
    } else {
        pending = imageUrl;
    }
}

/** Diagnostic only. The background no longer gates on this. */
export function isScannerReady(): boolean {
    return handler !== null;
}
