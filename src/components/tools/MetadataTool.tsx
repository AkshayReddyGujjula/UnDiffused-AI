import React, { useState, useCallback } from 'react';
import { ToolActionRow } from './ToolActionRow';

interface MetadataToolProps { targetImage: string; }

interface MetadataInfo {
    camera: Record<string, string>;
    settings: Record<string, string>;
    dates: Record<string, string>;
    software: Record<string, string>;
    verdict: 'authentic' | 'suspicious' | 'ai';
    verdictText: string;
}

/**
 * Metadata & EXIF Viewer
 * =======================
 * Extracts available image metadata. Since we're in a browser context
 * without raw file access, we analyse what's available from the image
 * URL and canvas properties, plus check for known AI signatures.
 */
export const MetadataTool: React.FC<MetadataToolProps> = ({ targetImage }) => {
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [metadata, setMetadata] = useState<MetadataInfo | null>(null);

    const analyse = useCallback(async () => {
        setIsAnalysing(true); setMetadata(null);
        try {
            const img = new Image();
            await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(); img.src = targetImage; });

            // Extract what we can from the URL and image properties
            const url = targetImage;
            const isDataUrl = url.startsWith('data:');
            const isBlobUrl = url.startsWith('blob:');
            const urlObj = !isDataUrl && !isBlobUrl ? new URL(url) : null;
            const filename = urlObj ? urlObj.pathname.split('/').pop() || 'unknown' : 'embedded';
            const ext = filename.split('.').pop()?.toLowerCase() || 'unknown';

            // Try to fetch headers for more metadata
            let contentType = '';
            let contentLength = '';
            let lastModified = '';
            try {
                const resp = await fetch(targetImage, { method: 'HEAD', mode: 'cors' });
                contentType = resp.headers.get('content-type') || '';
                contentLength = resp.headers.get('content-length') || '';
                lastModified = resp.headers.get('last-modified') || '';
            } catch { /* CORS may block */ }

            // Check for AI indicators in URL/filename
            const aiKeywords = ['dall-e', 'midjourney', 'stable-diffusion', 'ai-generated', 'generated',
                'openai', 'stability', 'replicate', 'huggingface', 'diffusion', 'comfyui', 'automatic1111'];
            const urlLower = url.toLowerCase();
            const hasAiIndicator = aiKeywords.some(kw => urlLower.includes(kw));

            // Check known AI image hosting domains
            const aiDomains = ['oaidalleapiprodscus.blob.core.windows.net', 'replicate.delivery',
                'cdn.midjourney.com', 'images.unsplash.com'];
            const isAiDomain = urlObj ? aiDomains.some(d => urlObj.hostname.includes(d)) : false;

            const camera: Record<string, string> = {
                'Source': isDataUrl ? 'Data URL (embedded)' : isBlobUrl ? 'Blob URL (local)' : urlObj?.hostname || 'Unknown',
                'Filename': filename,
                'Format': contentType || ext.toUpperCase(),
                'Dimensions': `${img.naturalWidth} × ${img.naturalHeight}`,
            };

            const settings: Record<string, string> = {
                'Aspect Ratio': (img.naturalWidth / img.naturalHeight).toFixed(2),
                'Total Pixels': `${((img.naturalWidth * img.naturalHeight) / 1e6).toFixed(1)} MP`,
            };
            if (contentLength) settings['File Size'] = `${(parseInt(contentLength) / 1024).toFixed(1)} KB`;

            const dates: Record<string, string> = {};
            if (lastModified) dates['Last Modified'] = lastModified;

            const software: Record<string, string> = {};
            if (hasAiIndicator) software['AI Indicator'] = '⚠️ AI-related keywords found in URL';
            if (isAiDomain) software['Hosting'] = '⚠️ Known AI image hosting platform';

            let verdict: MetadataInfo['verdict'] = 'authentic';
            let verdictText = '✅ No suspicious metadata detected';

            if (hasAiIndicator || isAiDomain) {
                verdict = 'ai';
                verdictText = '❌ AI generation indicators detected in metadata';
            } else if (isDataUrl || isBlobUrl) {
                verdict = 'suspicious';
                verdictText = '⚠️ Embedded/local image — limited metadata available';
            }

            setMetadata({ camera, settings, dates, software, verdict, verdictText });
        } catch (e) { console.error('[Metadata]', e); } finally { setIsAnalysing(false); }
    }, [targetImage]);

    const copyMetadata = () => {
        if (!metadata) return;
        const text = JSON.stringify({ ...metadata.camera, ...metadata.settings, ...metadata.dates, ...metadata.software }, null, 2);
        navigator.clipboard.writeText(text);
    };

    const renderSection = (title: string, icon: string, data: Record<string, string>) => {
        if (Object.keys(data).length === 0) return null;
        return (
            <div className="metadata-section">
                <div className="metadata-section-header">
                    <span>{icon}</span><h4>{title}</h4>
                </div>
                {Object.entries(data).map(([key, value]) => (
                    <div className="metadata-row" key={key}>
                        <span className="metadata-key">{key}</span>
                        <span className={`metadata-value ${value.includes('Not found') ? 'metadata-missing' : ''}`}>{value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (<div>
        <ToolActionRow
            label="Extract Metadata"
            onClick={analyse}
            isAnalysing={isAnalysing}
        />
        {metadata && (<div className="tool-output-area">
            {renderSection('Image Information', '📷', metadata.camera)}
            {renderSection('Properties', '⚙️', metadata.settings)}
            {renderSection('Dates', '📅', metadata.dates)}
            {renderSection('Software & AI Detection', '🖥️', metadata.software)}
            <div className={`tool-verdict ${metadata.verdict === 'authentic' ? 'tool-verdict-safe' : metadata.verdict === 'suspicious' ? 'tool-verdict-suspicious' : 'tool-verdict-danger'}`}>
                {metadata.verdictText}
            </div>
            <button className="tool-export-btn" onClick={copyMetadata} style={{ marginTop: 8 }}>📋 Copy to Clipboard</button>
        </div>)}
    </div>);
};
