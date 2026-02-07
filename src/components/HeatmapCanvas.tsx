import React, { useRef, useEffect, useCallback } from 'react';

const HEATMAP_SIZE = 32;

/**
 * HeatmapCanvas - Renders gradient variance as red-transparent overlay
 */
export const HeatmapCanvas: React.FC<{ data: number[] }> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawHeatmap = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length !== HEATMAP_SIZE * HEATMAP_SIZE) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match display size for sharp rendering
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // enable smoothing for that "blurry" heatmap look
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 1. Create a small offscreen canvas for the raw 32x32 data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = HEATMAP_SIZE;
        tempCanvas.height = HEATMAP_SIZE;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // 2. Create ImageData to manipulate pixels directly
        const imgData = tempCtx.createImageData(HEATMAP_SIZE, HEATMAP_SIZE);
        const pixels = imgData.data;

        for (let i = 0; i < data.length; i++) {
            const value = data[i];
            // Normalize value to visualize it better
            // Ideally value is 0-1.

            // Map value to Red channel with Alpha
            // We want high values to be very visible red
            const alpha = Math.min(255, Math.floor(Math.pow(value, 0.6) * 200));

            const idx = i * 4;
            pixels[idx] = 239;     // R (Red-500)
            pixels[idx + 1] = 68;  // G
            pixels[idx + 2] = 68;  // B
            pixels[idx + 3] = alpha; // A
        }

        tempCtx.putImageData(imgData, 0, 0);

        // 3. Draw the small canvas stretched onto the main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

    }, [data]);

    useEffect(() => {
        drawHeatmap();
        window.addEventListener('resize', drawHeatmap);
        return () => window.removeEventListener('resize', drawHeatmap);
    }, [drawHeatmap]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        // Removed mix-blend-mode to avoid weird darkening effects
        />
    );
};
