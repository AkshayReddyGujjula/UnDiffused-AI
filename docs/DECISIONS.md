# Engineering decisions

This log records the choices that shape the shipping system. Each entry includes
the problem, decision, trade-off and repository evidence so the architecture can
be reviewed without reverse-engineering intent from source code.

## Decision summary

| ID | Decision | Status |
|---|---|---|
| D1 | Run inference locally in the browser | Accepted |
| D2 | Train and evaluate with content-matched pairs | Accepted |
| D3 | Use DINOv2-S/14 as the visual backbone | Accepted |
| D4 | Mean-pool patch tokens and fine-tune the final four blocks | Accepted |
| D5 | Use one raw logit and a strict model contract | Accepted |
| D6 | Expose a calibrated abstention region | Accepted |
| D7 | Quantise MatMul only for browser WASM | Accepted |
| D8 | Keep the verdict whole-image and crop evidence separate | Accepted |
| D9 | Isolate the page UI in a closed Shadow DOM | Accepted |
| D10 | Keep image bytes out of Git and version their manifests | Accepted |

## D1: local browser inference

**Context.** A hosted inference endpoint would make deployment easier and allow
larger models, but every scanned image would leave the device. It would also add
backend cost, account security and service availability to a browser extension.

**Decision.** Package the model and ONNX Runtime Web inside the extension. Run
preprocessing and inference in a dedicated Web Worker using WASM.

**Why.** The project can make a precise privacy claim: there is no image upload
or remote inference service. The worker keeps heavy computation off the page's
main thread.

**Trade-offs.** Model size, operator support and latency are constrained by the
browser. Remote image URLs may still need a credential-free background fetch,
and the optional Google Lens action is external.

**Evidence.** [`pipeline.ts`](../src/content/inference/pipeline.ts),
[`worker.ts`](../src/content/inference/worker.ts),
[`manifest.json`](../manifest.json).

## D2: content-matched training and evaluation

**Context.** A COCO-versus-ELSA probe scored 0.990 on a held-out generator but
only 0.659 when subject matter was controlled. The generator holdout preserved a
visible corpus seam.

**Decision.** Pair each LAION source image with an ELSA generation made from its
caption. Split by `pair_id`, not by individual image. Keep a separate 400-pair
external set at another URL offset.

**Why.** Matching makes semantic content less useful as a shortcut and prevents
two versions of one subject leaking across train and test.

**Trade-offs.** Captions only approximate content matching. LAION originals have
label noise and the protocol still represents a limited set of sources.

**Evidence.** [`finetune_gpu.py`](../scripts/train/finetune_gpu.py),
[`PROTOCOL_V2.md`](benchmark/PROTOCOL_V2.md),
[`matched_corpus_v1/manifest.json`](benchmark/matched_corpus_v1/manifest.json).

## D3: DINOv2-S/14 backbone

**Context.** The two v1 ViT-B/16 checkpoints occupied 174 MB and measured at
chance. The replacement needed useful visual features, a clear licence and a
size compatible with extension distribution.

**Decision.** Use `facebook/dinov2-small` as the backbone.

**Why.** The small DINOv2 variant provided strong transferable representations,
an Apache-2.0 licence basis and a tractable browser artefact after quantisation.
A frozen probe could cheaply validate the data design before fine-tuning.

**Trade-offs.** A general representation can still learn dataset shortcuts. The
backbone is not specialised for image forensics, and its 224-pixel input discards
fine detail.

**Evidence.** [`detector_v2_finetuned_meta.json`](../public/models/detector_v2_finetuned_meta.json),
[`train_matched_probe.py`](../scripts/bench/train_matched_probe.py).

## D4: patch-mean pooling and partial fine-tuning

**Context.** A detector needs information distributed across the image. On the
matched data, patch-token means performed better than relying only on the CLS
token. A frozen probe reached a credible baseline but left capacity unused.

**Decision.** Exclude CLS, mean-pool patch tokens and fine-tune the final four
transformer blocks plus the binary head.

**Why.** Patch means expose distributed visual evidence. Partial fine-tuning
adapts higher-level features without the cost and overfitting risk of updating
the full trunk.

**Trade-offs.** Mean pooling loses explicit spatial relationships. Fine-tuning
increases training cost and makes the result more data-dependent.

**Evidence.** [`finetune_gpu.py`](../scripts/train/finetune_gpu.py),
[`v2_head_mean.json`](benchmark/v2_head_mean.json).

## D5: one logit and a strict contract

**Context.** v1 had unrecorded class meanings and incorrect flat indexing for a
three-class output. Later, a valid rank-one ONNX output was rejected because the
parser assumed rank two.

**Decision.** Train one binary logit where label `1` is generated. Bind input and
output names, dimensions, calibration and finite-value checks to the model
contract. Fail initialisation or inference when the contract differs.

**Why.** The score direction follows from the training objective. Model swaps
cannot silently reinterpret classes or invalid values.

**Trade-offs.** Contract values are still repeated across a few build and
runtime files. Metadata is generated but not dynamically loaded by the extension.

**Evidence.** [`contract.ts`](../src/content/inference/contract.ts),
[`export_onnx.py`](../scripts/train/export_onnx.py),
[`parse.test.mjs`](../tests/parse.test.mjs).

## D6: calibrated abstention

**Context.** A binary badge forces a verdict even near the decision boundary.
Calling an authentic image generated is the more damaging error for the intended
use.

**Decision.** Fit temperature scaling on validation, then choose a two-threshold
band against a 5% validation false-positive target and 25% maximum abstention
ceiling. Render the middle region as inconclusive.

**Why.** The UI communicates uncertainty and the operating point reflects the
asymmetric cost of false accusations.

**Trade-offs.** 14.25% of the external set receives no binary answer. The
external false-positive rate is 6.88%, not the 5% achieved on the fitting set.

**Evidence.** [`calibrate_onnx.py`](../scripts/bench/calibrate_onnx.py),
[`v2_finetuned_calibration.json`](benchmark/v2_finetuned_calibration.json).

## D7: MatMul-only dynamic quantisation

**Context.** Quantising every supported operator produced `ConvInteger` in the
patch embedder. Python ONNX Runtime loaded it, but ONNX Runtime Web WASM did not.

**Decision.** Dynamically quantise MatMul operators only and keep convolutions in
FP32.

**Why.** This retains most size savings while using the operator set implemented
by the actual deployment runtime.

**Trade-offs.** The file is roughly 0.7 MB larger than the unusable fully
quantised export. Quantisation changes individual logits, so the exact INT8 graph
must be benchmarked and calibrated.

**Evidence.** [`export_onnx.py`](../scripts/train/export_onnx.py),
[`detector_v2_finetuned_meta.json`](../public/models/detector_v2_finetuned_meta.json).

## D8: whole-image verdict, crop evidence

**Context.** Multi-crop voting can make a detector look more complex while
mixing uncalibrated local scores into the product decision. The model was trained
on whole images, so small crops can be out of distribution.

**Decision.** Use one whole-image pass for the calibrated verdict. Run selected
crops only to populate the regional evidence view.

**Why.** There is one auditable score path. Crop failures can be non-fatal and
cannot change a valid verdict.

**Trade-offs.** The overlay is suggestive rather than causal. Deep Scan adds
compute without changing the classification.

**Evidence.** [`worker.ts`](../src/content/inference/worker.ts),
[`pipeline.ts`](../src/content/inference/pipeline.ts).

## D9: closed Shadow DOM

**Context.** The scanner is injected into arbitrary web pages. Host styles must
not break it, and page scripts should not be able to read a verdict or local
image data through `element.shadowRoot`.

**Decision.** Render the React application inside a closed Shadow DOM and inject
its styles into that root.

**Why.** This creates both a styling boundary and a modest data-exposure boundary
without adding another frame or window.

**Trade-offs.** Closed roots are harder to inspect during debugging. They do not
isolate every browser resource or prevent the page controlling its surrounding
layout.

**Evidence.** [`index.tsx`](../src/content/index.tsx).

## D10: manifests instead of dataset bytes

**Context.** Training and evaluation images are large, have independent licence
terms and should not be casually republished inside a source repository.

**Decision.** Exclude image bytes from Git. Commit source URLs, labels, pair IDs,
generator metadata and SHA-256 hashes in versioned manifests.

**Why.** The repository preserves data identity and split logic without
pretending to relicense third-party media.

**Trade-offs.** URLs can disappear. Hashes verify bytes when available but cannot
restore an unavailable source.

**Evidence.** [`fetch_matched_control.py`](../scripts/bench/fetch_matched_control.py),
[`matched_control_v1/manifest.json`](benchmark/matched_control_v1/manifest.json),
[`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md).

## Adding a decision

Add an entry when a change alters a public claim, data boundary, model contract,
security boundary or deployment target. Include rejected alternatives and a
link to the code or measurement that made the decision testable.
