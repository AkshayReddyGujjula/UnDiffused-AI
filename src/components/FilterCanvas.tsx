import React, { useRef, useEffect, useCallback } from 'react';

const FILTER_SIZE = 128;

/**
 * FilterCanvas - Renders high-pass filter data (features) as grayscale overlay
 */
export const FilterCanvas: React.FC<{ data: number[] }> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawFilter = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length !== FILTER_SIZE * FILTER_SIZE) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match display size for sharp rendering
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // 1. Create a small offscreen canvas for the raw 128x128 data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = FILTER_SIZE;
        tempCanvas.height = FILTER_SIZE;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // 2. Create ImageData to manipulate pixels directly
        const imgData = tempCtx.createImageData(FILTER_SIZE, FILTER_SIZE);
        const pixels = imgData.data;

        for (let i = 0; i < data.length; i++) {
            const value = data[i]; // 0-255
            const idx = i * 4;

            // Grayscale green-ish or blue-ish visualization?
            // "Show what the AI is seeing" -> Grayscale or 'Matrix' style?
            // Let's stick to high-contrast grayscale/green for "AI vision"

            pixels[idx] = 0;       // R
            pixels[idx + 1] = 255; // G (Green look)
            pixels[idx + 2] = 0;   // B
            // Use value as alpha to just show the edges/activations
            // Or just grayscale:
            // pixels[idx] = value;
            // pixels[idx + 1] = value;
            // pixels[idx + 2] = value;
            // pixels[idx + 3] = 255;

            // User likely wants an OVERLAY. 
            // If we use grayscale, it might just look like the BW image.
            // High pass filter highlights edges.
            // Let's use a "thermal" or "matrix" look overlay.
            // Green edges on transparent.

            pixels[idx] = 255;     // R
            pixels[idx + 1] = 255; // G 
            pixels[idx + 2] = 255; // B
            pixels[idx + 3] = value; // Alpha proportional to intensity
        }

        tempCtx.putImageData(imgData, 0, 0);

        // 3. Draw onto main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false; // Pixelated for 'digital' feel or smooth? Smooth is probably better.
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

    }, [data]);

    useEffect(() => {
        drawFilter();
        window.addEventListener('resize', drawFilter);
        return () => window.removeEventListener('resize', drawFilter);
    }, [drawFilter]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    );
};
