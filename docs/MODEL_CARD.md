# Model card: UnDiffused detector v2

## Model summary

| Field | Value |
|---|---|
| Name | `detector_v2_finetuned` |
| Task | Binary ranking of AI-generated and source images |
| Backbone | `facebook/dinov2-small` |
| Architecture | DINOv2-S/14, patch-token mean pooling, one binary logit head |
| Fine-tuning | Final four transformer blocks plus head |
| Input | RGB image normalised to `[1, 3, 224, 224]` |
| Output | One raw logit, where higher means more likely generated |
| Calibration | Temperature scaling, `T = 1.9077` |
| Decision policy | Likely authentic, inconclusive, likely AI generated |
| Shipping format | Dynamic INT8 ONNX, MatMul operators only |
| Shipping size | 24.9 MB |
| Runtime | ONNX Runtime Web on WASM |
| Licence basis | Apache-2.0 DINOv2 weights; see [third-party notices](../THIRD_PARTY_NOTICES.md) |

The exact graph is
[`public/models/detector_v2_finetuned_int8.onnx`](../public/models/detector_v2_finetuned_int8.onnx).
Its generated interface metadata is stored beside it in
[`detector_v2_finetuned_meta.json`](../public/models/detector_v2_finetuned_meta.json).

## Intended use

The model is intended for exploratory, single-image analysis inside the
UnDiffused Chrome extension. It provides a probabilistic signal that can help a
user decide whether an image deserves closer inspection.

Suitable uses include:

- educational demonstrations of browser-based computer vision;
- engineering research into content-matched evaluation and model deployment;
- preliminary triage of images from covered diffusion families;
- studying calibration, abstention and browser-runtime constraints.

## Out-of-scope use

The model must not be treated as proof that an image is authentic or generated.
It is not suitable as the sole basis for moderation, employment, journalism,
academic misconduct, legal, financial or identity decisions.

It is not validated for:

- every image generator or real-world image distribution;
- Midjourney, Adobe Firefly or autoregressive image models;
- future generators released after the evaluation corpus;
- video, animation or multi-frame evidence;
- camera identification or deterministic provenance;
- adversarially optimised images designed to evade this detector.

Where C2PA or another trustworthy provenance record exists, deterministic
provenance should be considered before a statistical detector.

## Architecture

The backbone converts a 224 by 224 image into a sequence of DINOv2 patch tokens.
The CLS token is excluded and the remaining patch embeddings are mean-pooled.
A dropout layer and one linear head produce a single logit:

```text
image
  -> ImageNet normalisation
  -> DINOv2-S/14 patch encoder
  -> mean of patch tokens
  -> dropout
  -> linear head
  -> one logit
```

The final four encoder blocks and the head were fine-tuned. Earlier experiments
with a frozen DINOv2 representation established that the data protocol could
carry a real signal before a more expensive fine-tune was attempted.

A one-logit head was chosen because label `1` is explicitly generated during
training. The direction of the score is therefore part of the objective rather
than an undocumented output index.

## Training data

The training corpus contains **4,000 content-matched pairs**, or 8,000 images.
Each pair consists of:

- a LAION source image;
- an ELSA_D3 diffusion image generated from that source image's alt-text.

The source image and generated counterpart share a `pair_id`. Splits are made by
that pair identifier, so two versions of the same content cannot land on
opposite sides of a train or evaluation boundary.

Three generator families appear in training and validation:

- Stable Diffusion v1.4;
- DeepFloyd IF-II-L;
- Stable Diffusion 2.1 Base.

Stable Diffusion XL is held out as a generator family. It does not appear in the
training or validation split.

The training corpus is reconstructed from
[`matched_corpus_v1/manifest.json`](benchmark/matched_corpus_v1/manifest.json).
Image bytes are not committed. URLs and SHA-256 hashes preserve identity while
respecting repository size and dataset-licence boundaries.

### Why content matching matters

An earlier model used COCO photographs as real examples and ELSA renders as
generated examples. It appeared to reach 0.990 AUROC on an unseen generator, but
fell to 0.659 on content-matched pairs. The held-out generator preserved the
source-corpus difference, so the model could still succeed by recognising the
dataset rather than authenticity.

Content matching does not remove every confound, but it removes the most obvious
semantic seam. In the matched-trained probe, unmatched and matched performance
differed by less than 0.01.

## Training procedure

The checked-in training script uses:

- binary cross-entropy with logits;
- AdamW optimisation;
- pair-safe deterministic splits;
- light train-time augmentation;
- model selection by validation AUROC;
- a full held-out SDXL split;
- eight epochs and batch size 16 by default;
- seed `20260903` for split reconstruction.

The source of truth is
[`scripts/train/finetune_gpu.py`](../scripts/train/finetune_gpu.py). The practical
GPU workflow is explained in the [training guide](TRAINING_GUIDE.md).

## Export and deployment

The FP32 ONNX export is checked against PyTorch before quantisation. The recorded
maximum absolute divergence was `1.347e-05`, below the `0.001` export tolerance.

The shipping model is 3.55 times smaller than its FP32 form. Dynamic
quantisation is limited to MatMul operators because the browser WASM backend
used by ONNX Runtime Web does not implement the `ConvInteger` operator created
by unrestricted dynamic quantisation. A model that worked under Python
`onnxruntime` failed to load in the browser until the operator set was narrowed.

The recorded maximum per-logit divergence after quantisation is `1.372`. That is
large enough that the quantised model is evaluated directly. FP32 metrics are
not copied onto the smaller graph.

## Evaluation data

The main external benchmark contains **400 content-matched pairs**, or 800
images. It uses the same pair construction but a separate URL offset from the
4,000-pair training corpus. The detector was not trained on these images and the
calibration thresholds were not fitted on them.

The external set covers four diffusion families:

- Stable Diffusion v1.4;
- DeepFloyd IF-II-L;
- Stable Diffusion 2.1 Base;
- Stable Diffusion XL.

The canonical set is pinned by
[`matched_control_v1/manifest.json`](benchmark/matched_control_v1/manifest.json).
The evaluation procedure is defined in [benchmark protocol v2](benchmark/PROTOCOL_V2.md).

## Main results

### External content-matched benchmark

| Metric | Result |
|---|---:|
| AUROC | **0.9543** |
| 95% bootstrap interval | **0.9400 to 0.9668** |
| Accuracy at raw 0.5 threshold | **0.8862** |
| Uncalibrated ECE | **0.0708** |
| Calibrated ECE | **0.0222** |

AUROC measures ranking across every possible threshold. It does not describe one
operating point. The extension's user-facing operating point is the calibrated
three-state band below.

### Per-generator AUROC

| Generator | Training status | AUROC |
|---|---|---:|
| Stable Diffusion v1.4 | represented in training | 0.9411 |
| DeepFloyd IF-II-L | represented in training | 0.9519 |
| Stable Diffusion 2.1 Base | represented in training | 0.9630 |
| Stable Diffusion XL | generator family held out | 0.9617 |

These results share the same external set. They show coverage within the tested
families, not performance on untested generators.

### Laundering robustness

Images in browsers are frequently recompressed, resized or recaptured. The exact
shipping graph was therefore measured after nine transformations:

| Transformation | AUROC | 95% interval |
|---|---:|---:|
| None | 0.9543 | 0.9400 to 0.9668 |
| 512 px normalisation, JPEG q90 | 0.9558 | 0.9424 to 0.9679 |
| JPEG q75 | 0.9550 | 0.9413 to 0.9676 |
| JPEG q50 | 0.9479 | 0.9333 to 0.9615 |
| JPEG q30 | 0.9504 | 0.9373 to 0.9639 |
| Double JPEG | 0.9577 | 0.9444 to 0.9687 |
| Resize chain | 0.9544 | 0.9411 to 0.9674 |
| WebP q75 | 0.9505 | 0.9356 to 0.9634 |
| Screenshot recapture | 0.9566 | 0.9430 to 0.9689 |

The 0.0098 spread is small on this set. It supports robustness to the tested
transformations only. It does not establish adversarial robustness.

Machine-readable results are in
[`v2_finetuned_results.json`](benchmark/v2_finetuned_results.json).

## Calibration and abstention

Temperature `1.9077` was fitted by minimising negative log-likelihood on the
training run's validation split. Temperature scaling changes probability
calibration but not AUROC ordering.

The thresholds were then selected on the same validation split against a 5%
false-positive target under a 25% abstention ceiling fixed in advance:

| Probability | User-facing result |
|---:|---|
| below `0.2102` | likely authentic |
| `0.2102` to `0.6482` | inconclusive |
| above `0.6482` | likely AI generated |

| Measurement set | Abstention | FPR on decided authentic | TPR on decided generated |
|---|---:|---:|---:|
| Validation used for fitting, 750 images | 15.87% | 4.97% | 93.85% |
| External, 800 images | **14.25%** | **6.88%** | **93.77%** |

The extension reports the external behaviour. The band was not moved to recover
a neater 5% figure after seeing the external set.

Source: [`v2_finetuned_calibration.json`](benchmark/v2_finetuned_calibration.json).

## Fairness, bias and data quality

The benchmark does not establish demographic fairness. Its labels describe image
origin, not people, but subject distribution can still affect model scores.

Known data-quality issues include:

- LAION source images are web images, not a photography-only corpus;
- some source items are graphics, screenshots or product renders;
- the real and generated halves share approximate semantic content through
  captions, not pixel-perfect scene identity;
- source URLs can disappear even though their expected hashes are preserved;
- only four open-source diffusion families are represented externally.

The LAION label noise should make the task less clean, but it cannot be assumed
to affect every subgroup equally. No subgroup fairness claims are made.

## Privacy

Model inference and forensic processing occur on the user's device. The model,
score and verdict are not sent to a remote inference API.

For remote images, the extension may retrieve the selected public source URL
through its background worker. That network retrieval is not model inference.
The optional Google Lens action is a separate user-triggered external action.
See [Security policy](../SECURITY.md) for the exact boundary.

## Known limitations

- The external benchmark has 400 pairs. It is useful evidence, not population
  coverage for the open web.
- The model is evaluated against known open-source diffusion families only.
- Calibration can drift when browser imagery differs from the validation and
  external sets.
- Approximately one in seven external examples receives no binary answer.
- Regional crop scores are supporting evidence and are not independently
  calibrated.
- Warm latency does not include first-load model download and graph optimisation.
- Dynamic quantisation changes individual logits materially even though the
  measured ranking remains strong.
- No C2PA verification, adversarial training or online model update exists.

## Reproducibility

The full path is documented in [Reproducibility](REPRODUCIBILITY.md). In summary:

```bash
python scripts/bench/fetch_matched_control.py --pairs 4000 --start-offset 200000 --out docs/benchmark/matched_corpus_v1
python scripts/train/finetune_gpu.py
python scripts/train/export_onnx.py --name detector_v2_finetuned --quantize
python scripts/bench/score_model.py --model public/models/detector_v2_finetuned_int8.onnx --meta public/models/detector_v2_finetuned_meta.json --eval-sets docs/benchmark/matched_control_v1
python scripts/bench/calibrate_onnx.py
```

Reproducing the exact external check also requires the canonical 400-pair
manifest and its available source bytes. Python dependencies currently use
minimum versions rather than a fully locked environment, so future library drift
is a stated reproducibility limitation.

## Evidence index

| Claim | Source |
|---|---|
| Model graph interface and compression | [`detector_v2_finetuned_meta.json`](../public/models/detector_v2_finetuned_meta.json) |
| External and laundering results | [`v2_finetuned_results.json`](benchmark/v2_finetuned_results.json) |
| Temperature and abstention behaviour | [`v2_finetuned_calibration.json`](benchmark/v2_finetuned_calibration.json) |
| External image identities | [`matched_control_v1/manifest.json`](benchmark/matched_control_v1/manifest.json) |
| Training image identities | [`matched_corpus_v1/manifest.json`](benchmark/matched_corpus_v1/manifest.json) |
| Training implementation | [`finetune_gpu.py`](../scripts/train/finetune_gpu.py) |
| Export and quantisation checks | [`export_onnx.py`](../scripts/train/export_onnx.py) |
| Runtime parsing and policy | [`contract.ts`](../src/content/inference/contract.ts) |
