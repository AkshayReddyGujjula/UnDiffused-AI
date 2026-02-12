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

type JpegSegment = {
    marker: number;
    data: Uint8Array;
};

const latin1Decoder = new TextDecoder('iso-8859-1');

const readAscii = (bytes: Uint8Array): string => {
    const raw = latin1Decoder.decode(bytes);
    return raw.replace(/\0/g, '').trim();
};

const getDataView = (bytes: Uint8Array): DataView => {
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
};

const parseJpegSegments = (bytes: Uint8Array): JpegSegment[] => {
    const segments: JpegSegment[] = [];
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return segments;

    let offset = 2;
    while (offset + 4 <= bytes.length) {
        if (bytes[offset] !== 0xff) {
            offset++;
            continue;
        }
        while (offset < bytes.length && bytes[offset] === 0xff) offset++;
        if (offset >= bytes.length) break;

        const marker = bytes[offset++];
        if (marker === 0xd9 || marker === 0xda) break;
        if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) continue;

        if (offset + 2 > bytes.length) break;
        const length = (bytes[offset] << 8) | bytes[offset + 1];
        offset += 2;
        if (length < 2 || offset + length - 2 > bytes.length) break;

        const data = bytes.slice(offset, offset + length - 2);
        segments.push({ marker, data });
        offset += length - 2;
    }

    return segments;
};

const parseExifFromApp1 = (app1: Uint8Array): Record<string, string> => {
    const result: Record<string, string> = {};
    if (app1.length < 14) return result;
    const header = readAscii(app1.slice(0, 6));
    if (!header.startsWith('Exif')) return result;

    const tiff = app1.slice(6);
    const dv = getDataView(tiff);
    if (tiff.length < 8) return result;

    const byteOrder = String.fromCharCode(tiff[0], tiff[1]);
    const littleEndian = byteOrder === 'II';
    if (!littleEndian && byteOrder !== 'MM') return result;

    const readU16 = (off: number): number => dv.getUint16(off, littleEndian);
    const readU32 = (off: number): number => dv.getUint32(off, littleEndian);

    if (readU16(2) !== 42) return result;

    const tagNames: Record<number, string> = {
        0x010f: 'Make',
        0x0110: 'Model',
        0x0131: 'Software',
        0x0132: 'DateTime',
        0x013b: 'Artist',
        0x013c: 'HostComputer',
        0x8298: 'Copyright',
        0x9003: 'DateTimeOriginal',
        0x9004: 'DateTimeDigitized',
        0x9291: 'SubSecTimeOriginal',
        0xa430: 'CameraOwnerName',
        0xa434: 'LensModel',
        0xa433: 'LensMake',
        0x0112: 'Orientation'
    };

    const getValue = (type: number, count: number, valueOffsetField: number): string | null => {
        const typeSize: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1 };
        const size = typeSize[type] ?? 0;
        if (size === 0 || count <= 0) return null;
        const total = size * count;

        let valueStart = valueOffsetField;
        if (total > 4) {
            const ptr = readU32(valueOffsetField);
            if (ptr < 0 || ptr + total > tiff.length) return null;
            valueStart = ptr;
        } else {
            if (valueOffsetField + total > tiff.length) return null;
        }

        if (type === 2 || type === 7) {
            const bytes = tiff.slice(valueStart, valueStart + total);
            const text = readAscii(bytes);
            return text || null;
        }

        if (type === 3) {
            if (count === 1) return String(readU16(valueStart));
            const vals: number[] = [];
            for (let i = 0; i < count; i++) vals.push(readU16(valueStart + i * 2));
            return vals.join(', ');
        }

        if (type === 4) {
            if (count === 1) return String(readU32(valueStart));
            const vals: number[] = [];
            for (let i = 0; i < count; i++) vals.push(readU32(valueStart + i * 4));
            return vals.join(', ');
        }

        if (type === 5 && count >= 1) {
            const num = readU32(valueStart);
            const den = readU32(valueStart + 4);
            if (den !== 0) return (num / den).toString();
            return String(num);
        }

        return null;
    };

    const parseIfd = (ifdOffset: number): void => {
        if (ifdOffset <= 0 || ifdOffset + 2 > tiff.length) return;
        const entries = readU16(ifdOffset);
        for (let i = 0; i < entries; i++) {
            const entry = ifdOffset + 2 + i * 12;
            if (entry + 12 > tiff.length) break;

            const tag = readU16(entry);
            const type = readU16(entry + 2);
            const count = readU32(entry + 4);
            const valueOffsetField = entry + 8;

            const name = tagNames[tag];
            if (name) {
                const value = getValue(type, count, valueOffsetField);
                if (value) result[name] = value;
            }

            if (tag === 0x8769 || tag === 0x8825) {
                const subIfd = readU32(valueOffsetField);
                parseIfd(subIfd);
            }
        }

        const nextIfdPtr = ifdOffset + 2 + entries * 12;
        if (nextIfdPtr + 4 <= tiff.length) {
            const next = readU32(nextIfdPtr);
            if (next > 0 && next < tiff.length) parseIfd(next);
        }
    };

    parseIfd(readU32(4));
    return result;
};

const parseXmpFromApp1 = (app1: Uint8Array): Record<string, string> => {
    const result: Record<string, string> = {};
    const prefix = 'http://ns.adobe.com/xap/1.0/';
    const asText = latin1Decoder.decode(app1);
    if (!asText.startsWith(prefix)) return result;

    const nullPos = asText.indexOf('\0');
    const xml = nullPos >= 0 ? asText.slice(nullPos + 1) : '';
    if (!xml) return result;

    const extract = (label: string, regex: RegExp): void => {
        const m = xml.match(regex);
        if (m?.[1]) result[label] = m[1].trim();
    };

    extract('CreatorTool', /<xmp:CreatorTool>([^<]+)<\/xmp:CreatorTool>/i);
    extract('ModifyDate', /<xmp:ModifyDate>([^<]+)<\/xmp:ModifyDate>/i);
    extract('MetadataDate', /<xmp:MetadataDate>([^<]+)<\/xmp:MetadataDate>/i);
    extract('SoftwareAgent', /<xmpMM:DerivedFrom[^>]*stEvt:softwareAgent="([^"]+)"/i);

    return result;
};

const parseIptcFromApp13 = (app13: Uint8Array): Record<string, string> => {
    const result: Record<string, string> = {};
    const text = latin1Decoder.decode(app13.slice(0, 14));
    if (!text.startsWith('Photoshop 3.0')) return result;

    const datasetNames: Record<number, string> = {
        5: 'ObjectName',
        55: 'DateCreated',
        80: 'Byline',
        90: 'City',
        101: 'Country',
        116: 'CopyrightNotice',
        120: 'Caption'
    };

    for (let i = 0; i + 5 < app13.length; i++) {
        if (app13[i] !== 0x1c || app13[i + 1] !== 0x02) continue;
        const dataset = app13[i + 2];
        const length = (app13[i + 3] << 8) | app13[i + 4];
        const start = i + 5;
        const end = start + length;
        if (end > app13.length) continue;

        const key = datasetNames[dataset];
        if (!key) continue;

        const value = readAscii(app13.slice(start, end));
        if (value) result[key] = value;
        i = end - 1;
    }

    return result;
};

const bytesFromDataUrl = (dataUrl: string): Uint8Array => {
    const comma = dataUrl.indexOf(',');
    if (comma === -1) throw new Error('Invalid data URL');
    const base64 = dataUrl.slice(comma + 1);
    const bin = atob(base64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
};

/**
 * Metadata & EXIF Viewer
 * =======================
 * Extracts EXIF, IPTC and XMP metadata directly from JPEG bytes when available.
 */
export const MetadataTool: React.FC<MetadataToolProps> = ({ targetImage }) => {
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [metadata, setMetadata] = useState<MetadataInfo | null>(null);

    const analyse = useCallback(async () => {
        setIsAnalysing(true);
        setMetadata(null);
        try {
            const img = new Image();
            await new Promise<void>((res, rej) => {
                img.onload = () => res();
                img.onerror = () => rej(new Error('Failed to load image'));
                img.src = targetImage;
            });

            let bytes: Uint8Array | null = null;
            if (targetImage.startsWith('data:')) {
                bytes = bytesFromDataUrl(targetImage);
            } else {
                try {
                    const resp = await fetch(targetImage, { mode: 'cors' });
                    const buffer = await resp.arrayBuffer();
                    bytes = new Uint8Array(buffer);
                } catch {
                    bytes = null;
                }
            }

            const isDataUrl = targetImage.startsWith('data:');
            const isBlobUrl = targetImage.startsWith('blob:');
            const urlObj = !isDataUrl && !isBlobUrl ? new URL(targetImage) : null;
            const filename = urlObj ? urlObj.pathname.split('/').pop() || 'unknown' : 'embedded';
            const ext = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() || 'unknown' : 'unknown';

            let contentType = '';
            let contentLength = '';
            let lastModified = '';
            if (!isDataUrl) {
                try {
                    const head = await fetch(targetImage, { method: 'HEAD', mode: 'cors' });
                    contentType = head.headers.get('content-type') || '';
                    contentLength = head.headers.get('content-length') || '';
                    lastModified = head.headers.get('last-modified') || '';
                } catch {
                    // Ignore header failures (CORS).
                }
            } else {
                const header = targetImage.slice(5, targetImage.indexOf(';'));
                contentType = header || '';
                contentLength = String(bytes?.length ?? '');
            }

            const exif: Record<string, string> = {};
            const xmp: Record<string, string> = {};
            const iptc: Record<string, string> = {};

            if (bytes) {
                const segments = parseJpegSegments(bytes);
                for (const seg of segments) {
                    if (seg.marker === 0xe1) {
                        Object.assign(exif, parseExifFromApp1(seg.data));
                        Object.assign(xmp, parseXmpFromApp1(seg.data));
                    } else if (seg.marker === 0xed) {
                        Object.assign(iptc, parseIptcFromApp13(seg.data));
                    }
                }
            }

            const camera: Record<string, string> = {
                Source: isDataUrl ? 'Data URL' : isBlobUrl ? 'Blob URL' : urlObj?.hostname || 'Unknown',
                Filename: filename,
                Format: contentType || ext.toUpperCase(),
                Dimensions: `${img.naturalWidth} x ${img.naturalHeight}`
            };
            if (exif.Make) camera.Make = exif.Make;
            if (exif.Model) camera.Model = exif.Model;
            if (exif.LensModel) camera.LensModel = exif.LensModel;

            const settings: Record<string, string> = {
                'Aspect Ratio': (img.naturalWidth / img.naturalHeight).toFixed(2),
                'Total Pixels': `${((img.naturalWidth * img.naturalHeight) / 1e6).toFixed(1)} MP`
            };
            if (contentLength) settings['File Size'] = `${(parseInt(contentLength, 10) / 1024).toFixed(1)} KB`;
            if (bytes) settings['Byte Length'] = `${bytes.length}`;
            if (exif.Orientation) settings.Orientation = exif.Orientation;

            const dates: Record<string, string> = {};
            if (exif.DateTimeOriginal) dates.DateTimeOriginal = exif.DateTimeOriginal;
            if (exif.DateTimeDigitized) dates.DateTimeDigitized = exif.DateTimeDigitized;
            if (exif.DateTime) dates.DateTime = exif.DateTime;
            if (xmp.ModifyDate) dates.XmpModifyDate = xmp.ModifyDate;
            if (xmp.MetadataDate) dates.XmpMetadataDate = xmp.MetadataDate;
            if (iptc.DateCreated) dates.IptcDateCreated = iptc.DateCreated;
            if (lastModified) dates.LastModifiedHeader = lastModified;

            const software: Record<string, string> = {};
            if (exif.Software) software.ExifSoftware = exif.Software;
            if (xmp.CreatorTool) software.XmpCreatorTool = xmp.CreatorTool;
            if (xmp.SoftwareAgent) software.XmpSoftwareAgent = xmp.SoftwareAgent;
            if (iptc.ObjectName) software.IptcObjectName = iptc.ObjectName;

            const softwareStrings = Object.values(software).map((v) => v.toLowerCase());
            const aiKeywords = [
                'stable diffusion', 'midjourney', 'dall-e', 'dalle',
                'comfyui', 'automatic1111', 'invokeai', 'fooocus'
            ];
            const editKeywords = ['photoshop', 'gimp', 'lightroom', 'canva', 'snapseed', 'pixlr'];

            const aiHit = aiKeywords.find((kw) => softwareStrings.some((s) => s.includes(kw)));
            const editHit = editKeywords.find((kw) => softwareStrings.some((s) => s.includes(kw)));

            let verdict: MetadataInfo['verdict'] = 'authentic';
            let verdictText = 'No suspicious software tags found';

            if (aiHit) {
                verdict = 'ai';
                verdictText = `AI-related software tag detected: ${aiHit}`;
            } else if (editHit) {
                verdict = 'suspicious';
                verdictText = `Editing software tag detected: ${editHit}`;
            } else if (!bytes || (Object.keys(exif).length + Object.keys(xmp).length + Object.keys(iptc).length === 0)) {
                verdict = 'suspicious';
                verdictText = 'No embedded EXIF/IPTC/XMP metadata found';
            }

            if (Object.keys(software).length === 0) {
                software['Software Tags'] = 'Not found';
            }

            if (Object.keys(dates).length === 0) {
                dates['Date Tags'] = 'Not found';
            }

            setMetadata({ camera, settings, dates, software, verdict, verdictText });
        } catch (e) {
            console.error('[Metadata]', e);
        } finally {
            setIsAnalysing(false);
        }
    }, [targetImage]);

    const copyMetadata = () => {
        if (!metadata) return;
        const text = JSON.stringify({ ...metadata.camera, ...metadata.settings, ...metadata.dates, ...metadata.software }, null, 2);
        navigator.clipboard.writeText(text).catch(() => {
            // Ignore clipboard permissions failure.
        });
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
            {renderSection('Image Information', 'IMG', metadata.camera)}
            {renderSection('Properties', 'CFG', metadata.settings)}
            {renderSection('Dates', 'DATE', metadata.dates)}
            {renderSection('Software', 'SW', metadata.software)}
            <div className={`tool-verdict ${metadata.verdict === 'authentic' ? 'tool-verdict-safe' : metadata.verdict === 'suspicious' ? 'tool-verdict-suspicious' : 'tool-verdict-danger'}`}>
                {metadata.verdictText}
            </div>
            <button className="tool-export-btn" onClick={copyMetadata} style={{ marginTop: 8 }}>Copy to Clipboard</button>
        </div>)}
    </div>);
};
