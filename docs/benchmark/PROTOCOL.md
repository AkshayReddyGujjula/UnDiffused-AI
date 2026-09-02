# UnDiffused benchmark protocol v1

Fixed, versioned evaluation procedure. Later numbers are only comparable to
earlier ones if they were produced under the same protocol version, so changes
here bump the version rather than editing in place.

## Scope of v1

v1 answers one question: **what do the two shipped ONNX checkpoints actually
do?** It is deliberately small. It is not a generalisation benchmark, it has no
generator-family holdout, and 100 images cannot support a confident accuracy
claim. It exists to replace assertion with measurement, and to produce the
"before" row that every later result is compared against.

## Evaluation set

`eval_set_v1`, 100 images, 50 per class, fetched by
`scripts/bench/fetch_eval_set.py` with seed `20260902`.

| Half | Source | Why it is trustworthy |
|---|---|---|
| Authentic (50) | COCO val2017, via `rafaelpadilla/coco2017` | Flickr photographs collected 2014–2017. Authenticity is established by collection date — the corpus predates public diffusion models — rather than by inspection. |
| Generated (50) | `elsaEU/ELSA_D3` | Text-to-image renders with the generating model recorded per image. Four families, near-evenly split: DeepFloyd IF-II-L (13), SD 1.4 (13), SD 2.1-base (12), SDXL-base-1.0 (12). |

Image bytes live under `eval_set_v1/real/` and `eval_set_v1/ai/` and are
gitignored. `eval_set_v1/manifest.json` is committed and pins, per image, the
source dataset, row offset, generating model and SHA-256, so the set is
reconstructible from the script alone.

Labels: `0 = authentic`, `1 = generated`.

## Variants

Each image is evaluated twice.

- **raw** — bytes as fetched.
- **normalized** — resized to 512×512 (bicubic) and re-encoded at JPEG q90.

The normalized variant exists as a confound control. The authentic half is web
JPEG at assorted sizes; the generated half is clean renders at 256–640 px. A
classifier can separate those two populations on compression history and
resolution alone, without looking at anything image-forensic. If a score's
AUROC survives normalization, the signal is about content. If it collapses, the
checkpoint was reading encoder artifacts.

## Preprocessing

Matches the extension exactly: 224×224, NCHW, ImageNet mean
`[0.485, 0.456, 0.406]` / std `[0.229, 0.224, 0.225]`, input tensor
`pixel_values`, output tensor `logits`. Crops are resampled with PIL BILINEAR,
which approximates canvas `drawImage`.

## The three paths

| Path | What it is | What it isolates |
|---|---|---|
| **A** — corrected single view | Whole image → 224×224 → both models. Full softmax over all 3 classes (global) and all 2 classes (local). | The checkpoints' intrinsic behaviour, free of cropping and fusion. This is the honest v1 baseline. |
| **B** — extension as shipped | `worker.ts` verbatim: 4 quadrants → global model → the broken flat-index parse → early-exit gate → adaptive crops → local model → `probs[0]` → 25/75 blend → threshold 0.5. | What users actually get today. |
| **C** — extension geometry, correct parsing | Identical crops and fusion to B, but correct softmax and the empirically-determined AI class index. | Separates the parsing defect from the cropping and fusion design. B→C is the cost of the bug; C→A is the cost of everything else. |

## The decisive test

For each output index of each model, compute AUROC of that index's probability
against the true label.

- AUROC meaningfully **above 0.5** → that index is the AI class.
- AUROC ≈ **0.5** → the checkpoint carries no usable signal on this set.
- AUROC consistently **below 0.5** → the index ranks authentic above generated;
  used as the AI class, the detector is inverted.

AUROC is the right instrument here because it is threshold-free: it measures
whether the score *ranks* generated above authentic, independent of where the
decision boundary sits or how miscalibrated the model is.

## Reported statistics

- AUROC per class index, with a **stratified bootstrap 95% interval** (2000
  resamples; 500 for per-generator breakdowns). At n=100 a bare AUROC would
  overstate what the set establishes, so no point estimate is reported without
  its interval.
- Accuracy, TPR and FPR at the extension's hardcoded 0.5 threshold.
- Early-exit rate — the share of images on which the shipped gate skips the
  local model entirely.
- Per-generator AUROC (each generator's images vs all 50 authentic).
- For the global head's third class: mean probability by true label and the
  argmax distribution, as evidence about what the unlabelled class encodes.

## Verification of the extension replica

Path B is a Python port, so it is checked against the real TypeScript rather
than assumed equivalent. `scripts/bench/verify_port/compare.py` bundles the
actual `src/content/inference/saliency.ts` and `crops.ts` with esbuild, runs
them in Node over byte-identical RGBA input, and diffs against the Python.

Current status: quality-map values match **bit-exactly** at every sampled pixel,
min and max match exactly, and all crop rectangles are identical. Output parsing
and score fusion match to 0 or 1.1e-16.

One limitation is stated rather than papered over: `runInference` and the fusion
block are module-private in `worker.ts` (the first closes over an ORT session,
the second lives inside the message handler), so they cannot be imported. Their
bodies are lifted character-for-character into
`scripts/bench/verify_port/entry.ts` and must be kept in sync if `worker.ts`
changes. Everything else is imported from the shipped source directly.

## Reproducing

```bash
python scripts/bench/fetch_eval_set.py
python scripts/bench/verify_port/compare.py
cd scripts/bench && python run_baseline.py
```

Outputs `docs/benchmark/v1_baseline.json` and per-variant logit caches
`logits_raw.npz` / `logits_normalized.npz`, so any re-analysis is free of
further forward passes.

## Known limitations of v1

- n=100. Bootstrap intervals on AUROC are roughly ±0.07 wide at this size.
- Two source corpora only. Source-specific quirks are not fully separable from
  class signal, which is what the normalized variant partially addresses.
- All four generators are open-source diffusion. No Midjourney, no Firefly, no
  autoregressive or newer families.
- No laundering sweep (JPEG quality ladder, resize chains, screenshot
  re-capture). That belongs to protocol v2.
- Resampling is PIL BILINEAR, not Chrome's `drawImage` filter. It is applied
  identically to all paths, so path-to-path deltas are unaffected.
