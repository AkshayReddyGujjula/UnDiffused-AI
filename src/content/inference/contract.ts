import * as ort from 'onnxruntime-web';

/**
 * Model contracts, asserted at load time.
 *
 * Why this file exists: the shipped inference path guessed at the models'
 * interface and was wrong about it for the project's entire history. The global
 * checkpoint emits three class logits; the output parser handled only the one-
 * and two-class cases and silently fell through to a branch that read the wrong
 * array positions. Nothing threw. The UI rendered a confident percentage from
 * mixed-up numbers.
 *
 * That is the defining hazard of ML inference code: wrong indices still produce
 * finite floats, a sigmoid still returns something in [0,1], and a progress bar
 * will happily render it. The only defences are asserting the tensor contract
 * at load time and testing against images whose labels are known. This file is
 * the first; docs/benchmark/ is the second.
 */

export interface ModelContract {
    /** Human-readable id, used in error messages. */
    name: string;
    inputName: string;
    outputName: string;
    numClasses: number;
    /**
     * Which output index corresponds to "AI generated".
     *
     * null means: not established. It is null for both shipped checkpoints and
     * that is a measured fact, not an oversight -- see calibration below.
     * Consumers must not invent a value; a null index means no verdict.
     */
    aiClassIndex: number | null;
    mean: readonly [number, number, number];
    std: readonly [number, number, number];
    inputSize: number;
}

/**
 * Measured state of the shipped checkpoints.
 *
 * Established in docs/benchmark/v1_baseline.json against 100 labelled images
 * (50 COCO val2017 photographs, 50 ELSA_D3 renders across four generator
 * families). Every class index of both models produced an AUROC whose 95%
 * bootstrap interval contained 0.5. A sweep of 5 normalisations x 2 resize
 * policies found no preprocessing that recovered signal.
 *
 * Consequence: these checkpoints cannot support a verdict, and the extension
 * must not present one. This is not caution about a weak model -- it is a
 * refusal to fabricate a number from measured noise.
 */
export const MODEL_CALIBRATION = {
    calibrated: false,
    measuredAuroc: 0.5,
    benchmark: 'docs/benchmark/v1_baseline.json',
    note: 'Shipped checkpoints score at chance; no class index separates generated from authentic.',
} as const;

const IMAGENET_MEAN = [0.485, 0.456, 0.406] as const;
const IMAGENET_STD = [0.229, 0.224, 0.225] as const;

export const MODEL_CONTRACTS: Record<'global' | 'local', ModelContract> = {
    global: {
        name: 'model_global_quantized',
        inputName: 'pixel_values',
        outputName: 'logits',
        numClasses: 3,
        aiClassIndex: null,
        mean: IMAGENET_MEAN,
        std: IMAGENET_STD,
        inputSize: 224,
    },
    local: {
        name: 'model_local_quantized',
        inputName: 'pixel_values',
        outputName: 'logits',
        numClasses: 2,
        aiClassIndex: null,
        mean: IMAGENET_MEAN,
        std: IMAGENET_STD,
        inputSize: 224,
    },
};

export class ModelContractError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ModelContractError';
    }
}

/**
 * Verify a loaded session matches its declared contract. Throws on any
 * mismatch rather than degrading silently.
 *
 * Only the tensor names are checkable at load time; the class count lives in
 * the output shape, whose batch dimension is symbolic, so it is verified from
 * the dims of the first real inference instead (see assertOutputShape).
 */
export function assertModelContract(
    session: ort.InferenceSession,
    contract: ModelContract
): void {
    const inputs = session.inputNames;
    const outputs = session.outputNames;

    if (!inputs.includes(contract.inputName)) {
        throw new ModelContractError(
            `${contract.name}: expected input tensor "${contract.inputName}", ` +
            `model exposes [${inputs.join(', ')}]`
        );
    }
    if (!outputs.includes(contract.outputName)) {
        throw new ModelContractError(
            `${contract.name}: expected output tensor "${contract.outputName}", ` +
            `model exposes [${outputs.join(', ')}]`
        );
    }
    if (inputs.length !== 1 || outputs.length !== 1) {
        throw new ModelContractError(
            `${contract.name}: expected exactly one input and one output, ` +
            `got ${inputs.length} inputs and ${outputs.length} outputs`
        );
    }
}

/**
 * Verify the class count against a real output tensor. Called on the first
 * inference, where the symbolic batch dimension has resolved to a number.
 */
export function assertOutputShape(
    dims: readonly number[],
    contract: ModelContract
): void {
    if (dims.length !== 2) {
        throw new ModelContractError(
            `${contract.name}: expected a rank-2 output [batch, classes], got ` +
            `rank ${dims.length} ([${dims.join(', ')}])`
        );
    }
    if (dims[1] !== contract.numClasses) {
        throw new ModelContractError(
            `${contract.name}: contract declares ${contract.numClasses} classes, ` +
            `model emitted ${dims[1]}. Refusing to guess at the mapping -- this is ` +
            `exactly the failure that shipped for the project's entire history.`
        );
    }
}

/** Numerically stable softmax over a single logit vector. */
export function softmax(logits: number[]): number[] {
    const max = Math.max(...logits);
    const exps = logits.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}

/**
 * Turn a flat [batch * classes] output buffer into one probability
 * distribution per batch item.
 *
 * This is the function the original bug lived in. The old code indexed
 * `outputData[i]` for batch item `i`, which is only correct when there is
 * exactly one class. With the global model's three classes, a batch of four
 * quadrants read flat positions 0,1,2,3 -- the first quadrant's three class
 * logits followed by the second quadrant's first logit -- mixing values across
 * both the class and the batch axis, and then passing the result through a
 * sigmoid as though it were a binary logit.
 *
 * Kept pure and exported so it can be tested without a model, a session or a
 * browser. See tests/parse.test.mjs.
 */
export function logitsToDistributions(
    outputData: Float32Array | number[],
    dims: readonly number[],
    contract: ModelContract
): number[][] {
    assertOutputShape(dims, contract);

    const batchSize = dims[0];
    const classCount = dims[1];
    const distributions: number[][] = [];

    for (let i = 0; i < batchSize; i++) {
        const logits = Array.from(
            outputData.slice(i * classCount, (i + 1) * classCount)
        );
        distributions.push(softmax(logits));
    }
    return distributions;
}

/**
 * Collapse a class distribution to a single "probability this is AI".
 *
 * Returns null when the contract does not establish which index means AI. That
 * is the current state of both shipped checkpoints, and null propagates all the
 * way to the UI rather than being defaulted to something plausible-looking.
 */
export function toAiProbability(
    dist: number[],
    contract: ModelContract
): number | null {
    if (contract.aiClassIndex === null) return null;
    return dist[contract.aiClassIndex];
}
