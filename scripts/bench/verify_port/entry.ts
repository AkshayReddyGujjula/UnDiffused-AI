// Re-exports the *real* extension functions so the Python port can be diffed
// against them. Nothing is reimplemented here: these are the shipped modules.
export { computeQualityMap } from '../../../src/content/inference/saliency';
export { getAdaptiveCrops, generateGridCrops } from '../../../src/content/inference/crops';

// --- Verbatim lift from src/content/inference/worker.ts -------------------
// runInference() and the fusion block are module-private in worker.ts (the
// former closes over an ort session, the latter lives inside the message
// handler), so they cannot be imported. The bodies below are copied
// character-for-character from that file; only the surrounding signatures are
// new. Keep them in sync if worker.ts changes.

function softmax(logits: number[]): number[] {
    const max = Math.max(...logits);
    const exps = logits.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}

function sigmoid(logit: number): number {
    return 1 / (1 + Math.exp(-logit));
}

export function parseLogitsAsShipped(flat: number[], batchSize: number, classCount: number): number[] {
    const outputData = flat;
    const probabilities: number[] = [];
    for (let i = 0; i < batchSize; i++) {
        if (classCount === 2) {
            const logits = Array.from(outputData.slice(i * 2, (i + 1) * 2));
            const probs = softmax(logits);
            probabilities.push(probs[0]);
        } else {
            const raw = outputData[i];
            const val = raw >= 0 && raw <= 1 ? raw : sigmoid(raw);
            probabilities.push(val);
        }
    }
    return probabilities;
}

export function fuseAsShipped(globalBatchProbs: number[], localScoresIn: number[], mode: string) {
    const globalAiProb = globalBatchProbs.reduce((a, b) => a + b, 0) / globalBatchProbs.length;
    let finalAiProb = globalAiProb;
    let resultLocalProb: number | undefined = undefined;
    const isUncertain = globalAiProb > 0.05 && globalAiProb < 0.95;

    if (mode === 'deep' || isUncertain) {
        const localScores = [...localScoresIn];
        if (localScores.length > 0) {
            localScores.sort((a, b) => b - a);
            let localAiProb = 0;
            if (localScores.length >= 3) {
                const top3 = localScores.slice(0, 3);
                localAiProb = top3.reduce((a, b) => a + b, 0) / 3;
            } else if (localScores.length > 0) {
                localAiProb = localScores[0];
            }
            finalAiProb = (0.25 * globalAiProb) + (0.75 * localAiProb);
            resultLocalProb = localAiProb;
        }
    }
    return { finalAiProb, globalAiProb, localAiProb: resultLocalProb };
}

export function quadrantCrops(width: number, height: number) {
    const halfW = Math.floor(width / 2);
    const halfH = Math.floor(height / 2);
    return [
        { x: 0, y: 0, width: halfW, height: halfH, label: 'Global_TL' },
        { x: halfW, y: 0, width: halfW, height: halfH, label: 'Global_TR' },
        { x: 0, y: halfH, width: halfW, height: halfH, label: 'Global_BL' },
        { x: halfW, y: halfH, width: halfW, height: halfH, label: 'Global_BR' }
    ];
}
