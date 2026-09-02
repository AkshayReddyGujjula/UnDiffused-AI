// Runs the real extension functions (bundled from src/) against pixel data and
// logits dumped by the Python side, then writes the results back as JSON for
// comparison. Any divergence means the Python replica is not faithful.
import { readFileSync, writeFileSync } from 'node:fs';
import {
    computeQualityMap, getAdaptiveCrops, generateGridCrops,
    parseLogitsAsShipped, fuseAsShipped, quadrantCrops
} from './bundle.mjs';

const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = { cases: [] };

for (const c of spec.cases) {
    const raw = readFileSync(c.rgba_path);
    const imageData = {
        width: c.width,
        height: c.height,
        data: new Uint8ClampedArray(raw.buffer, raw.byteOffset, raw.byteLength)
    };

    const qmap = computeQualityMap(imageData);
    const crops = getAdaptiveCrops(c.width, c.height, qmap, 9);

    // Summarise the quality map rather than shipping 300k floats across.
    let sum = 0, min = Infinity, max = -Infinity;
    for (let i = 0; i < qmap.length; i++) {
        sum += qmap[i];
        if (qmap[i] < min) min = qmap[i];
        if (qmap[i] > max) max = qmap[i];
    }

    out.cases.push({
        file: c.file,
        qmap: { mean: sum / qmap.length, min, max, len: qmap.length },
        qmap_samples: c.sample_indices.map(i => qmap[i]),
        adaptive_crops: crops.map(k => ({ x: k.x, y: k.y, width: k.width, height: k.height })),
        grid_crops: generateGridCrops(c.width, c.height).map(k => ({ x: k.x, y: k.y })),
        quadrants: quadrantCrops(c.width, c.height),
        parsed_global: parseLogitsAsShipped(c.global_flat, 4, 3),
        parsed_local: parseLogitsAsShipped(c.local_flat, c.local_batch, 2),
        fused: fuseAsShipped(
            parseLogitsAsShipped(c.global_flat, 4, 3),
            parseLogitsAsShipped(c.local_flat, c.local_batch, 2),
            'default'
        )
    });
}

writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
console.log(`wrote ${process.argv[3]} (${out.cases.length} cases)`);
