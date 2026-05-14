import * as ort from 'onnxruntime-web';

export interface ModelMeta {
    input_name: string;
    output_name: string;
    num_classes: number;
    ai_class_index: number;
    output_format: 'softmax' | 'sigmoid' | 'binary_logit';
    normalization: {
        mean: [number, number, number];
        std: [number, number, number];
    };
    input_size: number;
}

export async function loadModelMeta(url: string): Promise<ModelMeta> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to load model meta from ${url}: ${resp.status}`);
    const json = await resp.json() as ModelMeta;
    assertMetaShape(json, url);
    return json;
}

function assertMetaShape(meta: ModelMeta, url: string): void {
    const required: (keyof ModelMeta)[] = [
        'input_name', 'output_name', 'num_classes', 'ai_class_index',
        'output_format', 'normalization', 'input_size'
    ];
    for (const key of required) {
        if (meta[key] === undefined || meta[key] === null) {
            throw new Error(`ModelMeta at ${url} is missing required field: ${key}`);
        }
    }
    if (meta.ai_class_index >= meta.num_classes) {
        throw new Error(
            `ModelMeta at ${url}: ai_class_index ${meta.ai_class_index} is out of range for num_classes ${meta.num_classes}`
        );
    }
    if (!Array.isArray(meta.normalization.mean) || meta.normalization.mean.length !== 3) {
        throw new Error(`ModelMeta at ${url}: normalization.mean must be an array of 3 numbers`);
    }
    if (!Array.isArray(meta.normalization.std) || meta.normalization.std.length !== 3) {
        throw new Error(`ModelMeta at ${url}: normalization.std must be an array of 3 numbers`);
    }
}

export function validateSession(
    session: ort.InferenceSession,
    meta: ModelMeta,
    label: string
): void {
    if (!session.inputNames.includes(meta.input_name)) {
        throw new Error(
            `[${label}] Model input name mismatch: expected "${meta.input_name}", ` +
            `got [${session.inputNames.join(', ')}]`
        );
    }
    if (!session.outputNames.includes(meta.output_name)) {
        throw new Error(
            `[${label}] Model output name mismatch: expected "${meta.output_name}", ` +
            `got [${session.outputNames.join(', ')}]`
        );
    }
}

export function extractAiProbability(
    outputData: Float32Array,
    batchIndex: number,
    meta: ModelMeta
): number {
    const { num_classes, ai_class_index, output_format } = meta;

    if (output_format === 'binary_logit' || num_classes === 1) {
        const logit = outputData[batchIndex];
        return sigmoid(logit);
    }

    const logits: number[] = [];
    for (let c = 0; c < num_classes; c++) {
        logits.push(outputData[batchIndex * num_classes + c]);
    }
    const probs = softmax(logits);
    return probs[ai_class_index];
}

function softmax(logits: number[]): number[] {
    const max = Math.max(...logits);
    const exps = logits.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}

function sigmoid(logit: number): number {
    return 1 / (1 + Math.exp(-logit));
}
