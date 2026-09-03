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


// ---------------------------------------------------------------------------
// v2 detector: frozen DINOv2-small backbone + calibrated linear probe
// ---------------------------------------------------------------------------

/**
 * The v2 contract. Unlike the two v1 checkpoints, every value here was read off
 * the exported graph by scripts/train/export_onnx.py rather than written by
 * hand, and the model has been scored on a stated benchmark.
 *
 * The head emits a single logit, so there is no class-index question to get
 * wrong: P(AI) = sigmoid(logit / temperature).
 *
 * `temperature` is on the contract rather than hardcoded in the parser on
 * purpose. The two v2 models differ in where calibration lives: the frozen
 * probe had its temperature folded into the linear layer at export time and so
 * emits an already-calibrated logit (temperature 1.0 here), while the
 * fine-tuned graph emits a raw one and is scaled at read time. A bare divisor
 * inside logitsToAiProbabilities would silently double-apply the moment anyone
 * repointed at the probe. Binding the divisor to the model that needs it makes
 * that class of mistake impossible rather than merely unlikely.
 */
export type CalibratedContract = ModelContract & {
    singleLogit: true;
    temperature: number;
};

export const DETECTOR_V2: CalibratedContract = {
    name: 'detector_v2_finetuned',
    inputName: 'pixel_values',
    outputName: 'logits',
    numClasses: 1,
    aiClassIndex: 0,
    mean: IMAGENET_MEAN,
    std: IMAGENET_STD,
    inputSize: 224,
    singleLogit: true,
    // Fitted by NLL on the reconstructed training validation split (750 images,
    // same seed and pair_id grouping as finetune_gpu.py, SDXL held out).
    // Lowered ECE from 0.0608 to 0.0237. See
    // docs/benchmark/v2_finetuned_calibration.json.
    temperature: 1.9077,
};

/**
 * The previously shipped frozen probe, kept as a contract so that repointing
 * back to it is a one-line change that carries its own calibration with it.
 * Its temperature is 1.0 because export_probe_onnx.py folded 1.4137 into the
 * graph's final linear layer -- that logit arrives calibrated.
 */
export const DETECTOR_V2_PROBE: CalibratedContract = {
    name: 'detector_v2_probe',
    inputName: 'pixel_values',
    outputName: 'logits',
    numClasses: 1,
    aiClassIndex: 0,
    mean: IMAGENET_MEAN,
    std: IMAGENET_STD,
    inputSize: 224,
    singleLogit: true,
    temperature: 1.0,
};

/**
 * Measured performance of DETECTOR_V2, from
 * docs/benchmark/v2_finetuned_results.json (scores) and
 * docs/benchmark/v2_finetuned_calibration.json (temperature and band).
 *
 * Every figure is measured on the shipped int8 file, not on the fp32 checkpoint
 * it was exported from, because int8 quantization is lossy and the browser runs
 * the int8 graph. The fp32 fine-tune scored 0.9602 on its own test split and
 * 0.9720 on held-out SDXL; those are training-side numbers and belong in the
 * training record, not in the contract the extension asserts.
 *
 * `matchedAuroc` is the headline: 800 content-matched pairs in
 * matched_control_v1, external to training, each real photograph paired with a
 * render made from that same photograph's caption, so content is held constant
 * and only authenticity varies.
 *
 * `heldoutGeneratorAuroc` is the SDXL subset of that same external set. SDXL
 * was excluded from training entirely.
 *
 * `shortcutGap` is deliberately null. The probe's -0.008 gap was measured by
 * scoring it on an unmatched corpus as well as a matched one; that comparison
 * has not been re-run for the fine-tune. The fine-tune was trained on the same
 * content-matched pairs, so the structural argument carries over -- but the
 * number does not, and carrying forward a figure measured on a different model
 * is the exact move this file exists to prevent.
 */
export const DETECTOR_V2_CALIBRATION = {
    calibrated: true,
    matchedAuroc: 0.9543,
    matchedAurocCi95: [0.94, 0.9668],
    heldoutGeneratorAuroc: 0.9617,
    calibratedEce: 0.0222,
    unmatchedAuroc: null,
    shortcutGap: null,
    previousShippedAuroc: 0.894,
    v1ShippedAuroc: 0.5,
    benchmark: 'docs/benchmark/v2_finetuned_results.json',
    calibrationRecord: 'docs/benchmark/v2_finetuned_calibration.json',
} as const;

/**
 * The abstention band, chosen on the reconstructed training validation split
 * against a 5% false-positive target under a 25% abstention ceiling fixed in
 * advance. Thresholds apply to the *calibrated* probability, sigmoid(logit / T),
 * so they move if the temperature moves.
 *
 * Below `low` -> likely authentic. Above `high` -> likely AI generated.
 * Between -> inconclusive, and the extension says so rather than guessing.
 *
 * The `measured*` fields are the band's behaviour on matched_control_v1 -- 800
 * pairs external to both training and the fit -- and NOT the validation numbers
 * it was fitted against. Those differ, and the difference matters:
 *
 *     fitted on val (750 imgs):  abstain 15.87%  FPR 4.97%  TPR 93.85%
 *     measured external (800):   abstain 14.25%  FPR 6.88%  TPR 93.77%
 *
 * A band fitted to hit 5% delivers 6.9% on data it has never seen. Reporting
 * the 4.97% would be quoting a fitting-set number as a deployment number, which
 * is a smaller version of the failure this whole repository documents. The
 * external figure is what the extension claims; the val fit is kept below only
 * as provenance for how the thresholds were chosen.
 *
 * Re-fitting the band on matched_control_v1 would recover the advertised 5%,
 * and was rejected: it would consume the only clean external measurement of the
 * shipped thresholds in exchange for a nicer-sounding number.
 *
 * Wrongly calling a genuine photograph fake is the more damaging error, which
 * is why the band is tuned to FPR rather than accuracy.
 */
export const ABSTENTION_BAND = {
    low: 0.2102,
    high: 0.6482,
    // Measured on matched_control_v1 (n=800), external to training and to the fit.
    measuredAbstainRate: 0.1425,
    measuredFpr: 0.0688,
    measuredTpr: 0.9377,
    measuredOn: 'matched_control_v1 (n=800), external',
    // Provenance: what the fit itself reported on the validation split.
    fittedOnVal: {
        abstainRate: 0.1587,
        fpr: 0.0497,
        tpr: 0.9385,
        targetFpr: 0.05,
        maxAbstain: 0.25,
        n: 750,
    },
} as const;

export type Verdict = 'likely_authentic' | 'inconclusive' | 'likely_ai';

/** Map a calibrated P(AI) to one of three states. Never a bare percentage. */
export function toVerdict(pAi: number): Verdict {
    if (pAi < ABSTENTION_BAND.low) return 'likely_authentic';
    if (pAi > ABSTENTION_BAND.high) return 'likely_ai';
    return 'inconclusive';
}

/** P(AI) from a single-logit head. */
export function sigmoid(logit: number): number {
    return 1 / (1 + Math.exp(-logit));
}

/**
 * Read a [batch, 1] output into per-image *calibrated* AI probabilities.
 *
 * Shares the striding discipline of logitsToDistributions: index by
 * `i * classCount`, never by `i`.
 *
 * `temperature` defaults to the shipped model's, so a caller that passes a raw
 * graph output gets the calibrated probability without having to remember.
 * Scoring a different model means passing that model's temperature; a model
 * whose calibration is already folded into its graph passes 1.
 */
export function logitsToAiProbabilities(
    outputData: Float32Array | number[],
    dims: readonly number[],
    temperature: number = DETECTOR_V2.temperature
): number[] {
    // The exported head ends in .squeeze(-1), so ONNX reports the output as
    // rank-1 [batch] rather than rank-2 [batch, 1]. Both are accepted: they
    // carry one logit per image either way, and rejecting the rank-1 form threw
    // ModelContractError on every scan while an in-page harness that read the
    // raw buffer still looked fine.
    const isRank1 = dims.length === 1;
    const isRank2Single = dims.length === 2 && dims[1] === 1;

    if (!isRank1 && !isRank2Single) {
        throw new ModelContractError(
            `detector_v2: expected [batch] or [batch, 1], got [${dims.join(', ')}]`
        );
    }

    const batch = dims[0];
    if (outputData.length < batch) {
        throw new ModelContractError(
            `detector_v2: output buffer holds ${outputData.length} values for a ` +
            `batch of ${batch}`
        );
    }

    if (!Number.isFinite(temperature) || temperature <= 0) {
        throw new ModelContractError(
            `detector_v2: temperature must be a finite positive number, got ` +
            `${temperature}. A zero or negative divisor would explode or invert ` +
            `the verdict while still returning a plausible-looking number in [0,1].`
        );
    }

    const out: number[] = [];
    for (let i = 0; i < batch; i++) {
        const logit = Number(outputData[i]);
        // A non-finite logit must not become a verdict. sigmoid(Infinity) is
        // exactly 1 and sigmoid(-Infinity) exactly 0, so an overflowed or
        // corrupted output would render as maximum confidence; NaN is worse
        // still, because every comparison in toVerdict is false and it falls
        // through to "inconclusive" while the result is still reported with
        // status "ok". Both are the same failure this file was written to
        // prevent: a broken number that survives all the way to the UI wearing
        // the costume of a real one.
        if (!Number.isFinite(logit)) {
            throw new ModelContractError(
                `detector_v2: model emitted a non-finite logit (${logit}) at ` +
                `batch index ${i}. Refusing to convert it into a probability.`
            );
        }
        out.push(sigmoid(logit / temperature));
    }
    return out;
}
