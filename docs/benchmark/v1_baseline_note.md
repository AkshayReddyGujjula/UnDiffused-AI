# What the shipped checkpoints actually do

**Stage 1 result. 2 September 2026.**
Data: [`v1_baseline.json`](v1_baseline.json) · Protocol: [`PROTOCOL.md`](PROTOCOL.md) ·
Robustness sweep: [`normalization_probe.json`](normalization_probe.json)

---

## The short version

The audit predicted one of two outcomes: either the detector worked and we would
learn which class index meant "AI", or it was inverted and had been calling
photographs fake for its entire existence. Neither happened.

**Both checkpoints score at chance.** Across 100 labelled images, every output
index of both models produces an AUROC whose 95% bootstrap interval contains
0.5. There is no AI class to identify, because no index carries signal to
identify it with.

| Model | Index | AUROC (raw) | 95% CI | Reading |
|---|---|---|---|---|
| global (3-class) | 0 | 0.540 | 0.425 to 0.655 | chance |
| global | 1 | 0.437 | 0.324 to 0.554 | chance |
| global | 2 | 0.495 | 0.390 to 0.606 | chance |
| local (2-class) | 0 | 0.520 | 0.408 to 0.628 | chance |
| local | 1 | 0.480 | 0.373 to 0.594 | chance |

The `normalized` variant, in which every image is forced to 512×512 and
re-encoded at JPEG q90 to remove resolution and compression as a shortcut,
reproduces this almost exactly (global 0.529 / 0.458 / 0.485; local 0.520 / 0.480). Nothing was
riding on the confound, because there was nothing to ride.

**This closes the repository's oldest open question, though not the way anyone
expected.** The `worker.ts` comment agonising over whether index 0 or index 1
means AI was arguing about a coin that has no faces. Both guesses were equally
wrong and equally harmless, because neither index ranks generated images above
authentic ones.

## The finding that matters most for users

Running the extension's real path over the same 100 images:

|  | Authentic | Generated |
|---|---|---|
| **called authentic** | 49 | 50 |
| **called AI** | 1 | 0 |

**The extension caught 0 of 50 generated images and flagged 1 of 50
photographs.** Its accuracy of 0.490 is worse than a coin flip and is achieved
entirely by calling almost everything real.

The mechanism is visible in the score distribution. The shipped pipeline's final
probability is squeezed into a narrow band (min 0.221, max 0.655, mean 0.385,
standard deviation 0.052), so it almost never crosses the hardcoded 0.5
threshold. The number shown to the user moves, which makes it look alive, but it
moves within a range that can barely produce a positive verdict.

## Isolating the parsing bug

Three paths were run over identical images so the defect can be priced
separately from everything else.

| Path | AUROC (raw) | Accuracy | TPR on AI | FPR on real |
|---|---|---|---|---|
| **A** corrected single view, global | 0.540 | 0.520 | 0.080 | 0.040 |
| **A** corrected single view, local | 0.520 | 0.520 | 0.000 | 0.000 |
| **B** extension as shipped | 0.472 | 0.490 | 0.000 | 0.020 |
| **C** extension geometry, correct parsing | 0.445 | 0.490 | 0.000 | 0.020 |

**The delta attributable to the parsing bug is 0.472 → 0.445 AUROC. Fixing the
arithmetic makes the shipped number very slightly *worse*.** Both
figures are noise, and their difference is noise too.

This is the honest reading, and it is worth stating plainly because it is not
the satisfying answer: the parsing defect is real, it is unambiguously a bug,
and repairing it recovers nothing, because there is no signal downstream of it
to recover. The bug was hiding an absence, not a capability. Fixing `worker.ts`
is still correct, because code that reads the wrong array positions must not
ship, but it must not be described as a fix to detection quality.

## Two corrections to the audit

Running the code rather than reading it overturned one prediction and sharpened
another.

**The early-exit gate never fires.** Section 3.2 of the strategy document warned
that when the noisy global score falls outside 0.05 to 0.95 the local model is
skipped and the noise is reported directly. Measured early-exit rate: **0.00 on
all 100 images, in both variants.** The buggy global score is confined to a
narrow mid-range, so the gate's condition is always true and the local model
always runs. The gate is still bad design, guarded as it is by a meaningless
number, but it is not currently causing harm, and the audit overstated it.

**The third class is inert, not mysterious.** Audit finding two lists the
meaning of the global head's third class as unrecorded. It is now measurable:
index 2 is the argmax for **0 of 50** authentic images and **1 of 50** generated
ones, with a mean probability of 0.255 against a uniform 0.333. It is not
encoding a third category; it is a nearly-dead output. Whatever three-way
problem this head was built for, this checkpoint does not express it.

## Why this is the models, not our measurement

A chance-level result is worthless if it comes from feeding the models the wrong
input, and there was a specific reason for suspicion: the tensors are named
`pixel_values` and `logits`, which is HuggingFace `transformers` convention, and
HuggingFace's default `ViTImageProcessor` normalises with mean = std = 0.5
rather than with ImageNet statistics. The extension uses ImageNet statistics.

So the sweep was run: 5 normalisations (ImageNet, 0.5/0.5, CLIP, unit range, raw
0 to 255) × 2 resize policies (squash to 224, short-side resize then centre crop) ×
5 class indices = 50 measurements.

**The strongest separation found anywhere was AUROC 0.341**, which is 0.159
from chance and in the *inverted* direction. Across 50 measurements on a 100-image set, a
maximum deviation of that size is what noise produces. No preprocessing recovers
a detector.

The failure mode is visible in the logits themselves. Under correct
preprocessing the global head's logits have a standard deviation across images
of roughly 0.17 and a total range under 1.0, giving a mean maximum softmax
probability of **0.410 on a three-class head** where chance is 0.333. The local
head reaches 0.633 where chance is 0.500. These are the outputs of a classifier
that has barely learned to prefer one class over another: the signature of an
untrained or destroyed classification head sitting on top of a backbone that is
still responding to input.

One hypothesis remains untestable: dynamic int8 quantization could in principle
have destroyed a working head. It is unlikely, since dynamic int8 on a ViT
typically costs a few points rather than a whole model, and it cannot be
checked, because no fp32 original exists in the repository. It is recorded here as the one alternative
explanation the evidence cannot close.

## Per-generator

All four generator families sit within noise, at n = 12 to 13 each. The intervals
are far too wide to rank them, and the numbers are reported only to show that no
family is separable:

| Generator | n | local | global | as shipped |
|---|---|---|---|---|
| SD 1.4 | 13 | 0.540 | 0.651 | 0.562 |
| DeepFloyd IF-II-L | 13 | 0.452 | 0.465 | 0.326 |
| SD 2.1-base | 12 | 0.645 | 0.458 | 0.597 |
| SDXL-base-1.0 | 12 | 0.447 | 0.583 | 0.410 |

## Confidence in the measurement

The extension replica is verified rather than asserted. `verify_port/compare.py`
bundles the real `saliency.ts` and `crops.ts` with esbuild, runs them in Node
over byte-identical RGBA input, and diffs against the Python: quality-map values
match **bit-exactly** at every sampled pixel, min and max match exactly, all crop
rectangles are identical, and output parsing and fusion match to 0 or 1.1e-16.
The one gap is stated in `PROTOCOL.md`: `runInference` and the fusion block are
module-private in `worker.ts` and are lifted character-for-character rather than
imported.

What this set cannot support: n = 100 gives AUROC intervals roughly ±0.06 wide,
there are only two source corpora, all four generators are open-source
diffusion, and there is no laundering sweep. None of that weakens the negative
result. Establishing that something is *absent* is exactly what a small set can
do, since the models would have to be near-perfectly hidden to score 0.5 while
working. It does mean this set cannot be used to certify a *working* detector
later. That needs protocol v2.

## What follows

1. **The v1 accuracy baseline is 0.50 AUROC.** This is the honest "before" that
   every later result is measured against, and it is a floor that any real
   detector clears trivially. That is the point: the comparison is now anchored
   to a measurement rather than to an assumption.
2. **Fix `worker.ts`, and assert the tensor contract at load time.** Class
   count, tensor names and normalisation constants are read from the model
   rather than hardcoded, so this failure class breaks loudly instead of
   rendering "87% AI" from noise.
3. **Do not restore a confident verdict on these checkpoints.** They have now
   been measured. Shipping a percentage derived from them would be knowingly
   fabricating a number.
4. **The two 87 MB files should be dropped, not retrained.** They have no
   provenance, no label map, and now no measured capability. They currently
   account for the bulk of the extension's 174 MB package.

The claim "the model is weak" is retired. The measured claim is that these
checkpoints do not distinguish generated images from photographs at all, and the
project has never had a working detector to fix.
