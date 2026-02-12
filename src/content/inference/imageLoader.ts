/**
 * Helper to fetch image via background script to bypass CORS.
 */
export async function fetchImageViaBackground(url: string): Promise<ImageBitmap> {
    if (url.startsWith('data:') || url.startsWith('blob:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        return createImageBitmap(blob);
    }

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: 'FETCH_IMAGE_AS_DATA_URL',
            url
        }, async (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (!response || !response.success || !response.dataUrl) {
                reject(new Error(response?.error || 'Failed to fetch image via background script'));
                return;
            }

            try {
                // Fetch the data URL
                const res = await fetch(response.dataUrl);
                const blob = await res.blob();
                const bitmap = await createImageBitmap(blob);
                resolve(bitmap);
            } catch (e) {
                reject(new Error('Failed to create image bitmap: ' + (e as Error).message));
            }
        });
    });
}
