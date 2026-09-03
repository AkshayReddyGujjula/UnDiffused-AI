/**
 * Readiness flag for the content script.
 *
 * The Scanner registers its SCANNING listener inside a React effect, so the
 * listener does not exist until React has mounted. The background worker
 * therefore cannot treat "the content script file has executed" as "the content
 * script can receive a scan request" -- there is a window between the two where
 * a message is silently dropped.
 *
 * This flag closes that window: the background pings until `ready` is true
 * before sending anything.
 */

let scannerReady = false;

export function setScannerReady(value: boolean): void {
    scannerReady = value;
}

export function isScannerReady(): boolean {
    return scannerReady;
}
