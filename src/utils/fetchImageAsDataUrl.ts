/**
 * Fetches an image URL via the background service worker to bypass CORS,
 * then returns it as a base64 data URL that can safely be drawn on canvas.
 *
 * If the image is already a data URL, it is returned as-is.
 */
export async function fetchImageAsDataUrl(imageUrl: string): Promise<string> {
    // Already a data URL or blob URL — no CORS issue
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
        return imageUrl;
    }

    return new Promise<string>((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: 'FETCH_IMAGE_AS_DATA_URL', url: imageUrl },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                if (response?.success && response.dataUrl) {
                    resolve(response.dataUrl);
                } else {
                    reject(new Error(response?.error || 'Failed to fetch image via background'));
                }
            }
        );
    });
}
