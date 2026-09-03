/**
 * Regression tests for the output-parsing defect.
 *
 * The bug that shipped: for a [batch, classes] output with classes !== 2, the
 * parser read `outputData[i]` for batch item `i`. With the global model's three
 * classes and a batch of four quadrants, that read flat positions 0,1,2,3 --
 * the first quadrant's three class logits followed by the second quadrant's
 * first logit -- and then squashed the raw value through a sigmoid as though it
 * were a binary logit.
 *
 * These tests exist because the audit's conclusion was that ML inference code
 * fails silently: wrong indices still yield finite numbers, and a UI will
 * render "87% AI" from meaningless input without complaint. A test against
 * known inputs is one of only two defences (the other is the load-time contract
 * assertion, also covered here).
 *
 * Run: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
    MODEL_CONTRACTS,
    MODEL_CALIBRATION,
    ModelContractError,
    softmax,
    logitsToDistributions,
    toAiProbability,
    assertOutputShape,
    logitsToAiProbabilities,
    sigmoid,
    DETECTOR_V2,
    DETECTOR_V2_PROBE,
    ABSTENTION_BAND,
    toVerdict,
} from './bundle.mjs';

const GLOBAL = MODEL_CONTRACTS.global;
const LOCAL = MODEL_CONTRACTS.local;

test('softmax is a normalised distribution and is shift-invariant', () => {
    const p = softmax([2, 1, 0.1]);
    assert.equal(p.length, 3);
    assert.ok(Math.abs(p.reduce((a, b) => a + b, 0) - 1) < 1e-12);
    assert.ok(p[0] > p[1] && p[1] > p[2]);

    const shifted = softmax([1002, 1001, 1000.1]);
    p.forEach((v, i) => assert.ok(Math.abs(v - shifted[i]) < 1e-12));
});

test('softmax does not overflow on large logits', () => {
    const p = softmax([1000, 999]);
    assert.ok(Number.isFinite(p[0]) && Number.isFinite(p[1]));
    assert.ok(Math.abs(p[0] + p[1] - 1) < 1e-12);
});

test('3-class output strides by class count, not by 1 (THE BUG)', () => {
    // Four quadrants, three classes. Each row is deliberately distinct so a
    // stride error cannot coincidentally produce the right answer.
    const logits = new Float32Array([
        3, 0, 0,   // quadrant 0 -> class 0 dominant
        0, 3, 0,   // quadrant 1 -> class 1 dominant
        0, 0, 3,   // quadrant 2 -> class 2 dominant
        1, 1, 1,   // quadrant 3 -> uniform
    ]);

    const dists = logitsToDistributions(logits, [4, 3], GLOBAL);

    assert.equal(dists.length, 4, 'one distribution per batch item');
    dists.forEach(d => {
        assert.equal(d.length, 3);
        assert.ok(Math.abs(d.reduce((a, b) => a + b, 0) - 1) < 1e-12);
    });

    assert.equal(dists[0].indexOf(Math.max(...dists[0])), 0);
    assert.equal(dists[1].indexOf(Math.max(...dists[1])), 1);
    assert.equal(dists[2].indexOf(Math.max(...dists[2])), 2);
    dists[3].forEach(v => assert.ok(Math.abs(v - 1 / 3) < 1e-12));

    // The shipped code would have produced sigmoid-ish values derived from
    // flat[0..3] = [3, 0, 0, 0], i.e. near-identical numbers for three
    // obviously different quadrants. Assert we are not doing that.
    const first = dists.map(d => d[0]);
    assert.notEqual(first[0].toFixed(6), first[1].toFixed(6));
});

test('2-class output is parsed independently of the 3-class path', () => {
    const logits = new Float32Array([2, 0, 0, 2]);
    const dists = logitsToDistributions(logits, [2, 2], LOCAL);
    assert.equal(dists.length, 2);
    assert.ok(dists[0][0] > dists[0][1]);
    assert.ok(dists[1][1] > dists[1][0]);
});

test('batch of one is handled', () => {
    const dists = logitsToDistributions(new Float32Array([1, 2, 3]), [1, 3], GLOBAL);
    assert.equal(dists.length, 1);
    assert.equal(dists[0].indexOf(Math.max(...dists[0])), 2);
});

test('plain number[] input works as well as Float32Array', () => {
    const a = logitsToDistributions([1, 2, 3], [1, 3], GLOBAL);
    const b = logitsToDistributions(new Float32Array([1, 2, 3]), [1, 3], GLOBAL);
    a[0].forEach((v, i) => assert.ok(Math.abs(v - b[0][i]) < 1e-12));
});

test('a class-count mismatch throws instead of guessing', () => {
    // A 2-class tensor handed to the 3-class contract is exactly the situation
    // the old code swallowed. It must now be loud.
    assert.throws(
        () => logitsToDistributions(new Float32Array([1, 2]), [1, 2], GLOBAL),
        ModelContractError
    );
    assert.throws(() => assertOutputShape([4, 5], GLOBAL), ModelContractError);
});

test('a non rank-2 output throws', () => {
    assert.throws(() => assertOutputShape([4], GLOBAL), ModelContractError);
    assert.throws(() => assertOutputShape([1, 3, 3], GLOBAL), ModelContractError);
});

test('toAiProbability returns null while no AI class is established', () => {
    // Both shipped checkpoints measured at chance, so aiClassIndex is null.
    // The pipeline must surface that as "no verdict", never as a default.
    assert.equal(GLOBAL.aiClassIndex, null);
    assert.equal(LOCAL.aiClassIndex, null);
    assert.equal(toAiProbability([0.2, 0.3, 0.5], GLOBAL), null);
    assert.equal(toAiProbability([0.4, 0.6], LOCAL), null);
});

test('toAiProbability reads the declared index once one is established', () => {
    const calibrated = { ...LOCAL, aiClassIndex: 1 };
    assert.equal(toAiProbability([0.4, 0.6], calibrated), 0.6);
});

test('calibration flag reflects the measured baseline', () => {
    // Guards against someone flipping this on without a new benchmark.
    assert.equal(MODEL_CALIBRATION.calibrated, false);
    assert.equal(MODEL_CALIBRATION.measuredAuroc, 0.5);
});

test('contracts match the shipped ONNX graphs', () => {
    // These are read off the actual model binaries; see
    // docs/benchmark/v1_baseline.json -> models.
    assert.equal(GLOBAL.inputName, 'pixel_values');
    assert.equal(GLOBAL.outputName, 'logits');
    assert.equal(GLOBAL.numClasses, 3);
    assert.equal(LOCAL.numClasses, 2);
    assert.deepEqual([...GLOBAL.mean], [0.485, 0.456, 0.406]);
    assert.deepEqual([...GLOBAL.std], [0.229, 0.224, 0.225]);
});

// --- detector_v2 single-logit head -----------------------------------------
// The exported head ends in .squeeze(-1), so ONNX reports [batch], not
// [batch, 1]. Requiring rank 2 threw ModelContractError on every scan, and the
// in-page harness missed it by reading the raw output buffer directly instead
// of going through this parser. These pin both accepted shapes.

test('rank-1 [batch] output is accepted (the shape the model actually emits)', () => {
    // Temperature 1 is passed explicitly: this pins shape handling, which must
    // not shift when a recalibration changes the shipped temperature.
    const p = logitsToAiProbabilities(new Float32Array([0, 2, -2]), [3], 1);
    assert.equal(p.length, 3);
    assert.ok(Math.abs(p[0] - 0.5) < 1e-12);
    assert.ok(p[1] > 0.85 && p[2] < 0.15);
});

test('rank-2 [batch, 1] output is also accepted', () => {
    const a = logitsToAiProbabilities(new Float32Array([0, 2, -2]), [3, 1], 1);
    const b = logitsToAiProbabilities(new Float32Array([0, 2, -2]), [3], 1);
    a.forEach((v, i) => assert.ok(Math.abs(v - b[i]) < 1e-12));
});

test('a multi-class shape is rejected rather than silently misread', () => {
    assert.throws(() => logitsToAiProbabilities(new Float32Array([1, 2, 3, 4]), [2, 2]),
                  ModelContractError);
    assert.throws(() => logitsToAiProbabilities(new Float32Array([1]), [1, 1, 1]),
                  ModelContractError);
});

test('a short output buffer throws instead of reading undefined', () => {
    assert.throws(() => logitsToAiProbabilities(new Float32Array([1]), [4]),
                  ModelContractError);
});

test('sigmoid maps a logit to P(AI) and is monotonic', () => {
    assert.ok(Math.abs(sigmoid(0) - 0.5) < 1e-12);
    assert.ok(sigmoid(3) > sigmoid(1) && sigmoid(1) > sigmoid(-1));
});


// --- temperature scaling ----------------------------------------------------
// The fine-tuned graph emits a raw logit; the probe's graph had its temperature
// folded in at export. The divisor therefore lives on the contract, not in the
// parser, so that repointing between the two cannot double-apply it. These pin
// that arrangement -- a silently double-scaled probability is exactly the kind
// of finite, plausible-looking wrong number this suite exists to catch.

test('the shipped temperature is applied by default', () => {
    const [p] = logitsToAiProbabilities(new Float32Array([2]), [1]);
    assert.ok(Math.abs(p - sigmoid(2 / DETECTOR_V2.temperature)) < 1e-12);
    // Temperature > 1 pulls confidence toward 0.5, so it must differ from raw.
    assert.ok(p < sigmoid(2));
});

test('temperature > 1 shrinks confidence without reordering scores', () => {
    const logits = new Float32Array([-3, -0.5, 0, 0.5, 3]);
    const hot = logitsToAiProbabilities(logits, [5], 1);
    const cal = logitsToAiProbabilities(logits, [5], DETECTOR_V2.temperature);

    for (let i = 1; i < hot.length; i++) {
        assert.ok(cal[i] > cal[i - 1], 'ranking must be preserved');
    }
    // AUROC is rank-based, so calibration cannot change it -- only the verdict
    // thresholds it is read against.
    assert.ok(Math.abs(cal[2] - 0.5) < 1e-12);
    assert.ok(cal[0] > hot[0] && cal[4] < hot[4]);
});

test('the probe contract declares temperature 1 because its graph folds it in', () => {
    assert.equal(DETECTOR_V2_PROBE.temperature, 1);
    assert.equal(DETECTOR_V2_PROBE.name, 'detector_v2_probe');
    assert.equal(DETECTOR_V2.name, 'detector_v2_finetuned');
    assert.ok(DETECTOR_V2.temperature > 1);
});

test('a non-finite logit throws instead of becoming a confident verdict', () => {
    // sigmoid(Infinity) is exactly 1 and sigmoid(-Infinity) exactly 0, so an
    // overflowed output would render as maximum confidence. NaN is worse: every
    // comparison in toVerdict is false, so it falls through to 'inconclusive'
    // while the result still carries status 'ok'.
    for (const bad of [NaN, Infinity, -Infinity]) {
        assert.throws(() => logitsToAiProbabilities(new Float32Array([0, bad]), [2]),
                      ModelContractError, `logit ${bad} must be rejected`);
    }
    // Confirm the failure mode this replaces: NaN really did map to a verdict.
    assert.equal(toVerdict(NaN), 'inconclusive');
});

test('a non-positive or non-finite temperature throws instead of inverting', () => {
    for (const bad of [0, -1, NaN, Infinity]) {
        assert.throws(() => logitsToAiProbabilities(new Float32Array([1]), [1], bad),
                      ModelContractError, `temperature ${bad} must be rejected`);
    }
});


// --- the abstention band ----------------------------------------------------

test('the band is ordered and maps to three states', () => {
    assert.ok(ABSTENTION_BAND.low < ABSTENTION_BAND.high);
    assert.equal(toVerdict(ABSTENTION_BAND.low - 1e-6), 'likely_authentic');
    assert.equal(toVerdict(ABSTENTION_BAND.high + 1e-6), 'likely_ai');
    assert.equal(toVerdict((ABSTENTION_BAND.low + ABSTENTION_BAND.high) / 2),
                 'inconclusive');
    // Both edges are inclusive of the inconclusive band: an image landing
    // exactly on a threshold gets no verdict rather than the adjacent one.
    assert.equal(toVerdict(ABSTENTION_BAND.low), 'inconclusive');
    assert.equal(toVerdict(ABSTENTION_BAND.high), 'inconclusive');
});

test('the band reports its external measurement, not its fitting-set numbers', () => {
    // The band was fitted to 5% FPR on validation and measures 6.88% on the
    // external set. Shipping the 4.97% would be quoting a fitting-set number as
    // a deployment number. This pins which one the UI is allowed to read.
    assert.equal(ABSTENTION_BAND.measuredFpr, 0.0688);
    assert.ok(ABSTENTION_BAND.measuredFpr > ABSTENTION_BAND.fittedOnVal.fpr,
              'the external FPR is the honest, larger number');
    assert.ok(ABSTENTION_BAND.fittedOnVal.fpr <= ABSTENTION_BAND.fittedOnVal.targetFpr);
    assert.ok(ABSTENTION_BAND.measuredAbstainRate < ABSTENTION_BAND.fittedOnVal.maxAbstain);
    assert.match(ABSTENTION_BAND.measuredOn, /matched_control_v1/);
});
