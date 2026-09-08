# Changelog

This file records notable public milestones. Detailed reasoning and commit links
are in [`docs/ENGINEERING_JOURNEY.md`](docs/ENGINEERING_JOURNEY.md).

## Unreleased

### Added

- Public architecture, model card, decision log and reproducibility guide.
- Branded repository visuals and a recruiter-friendly README.
- Continuous integration for tests, build, dependency audit, repository hygiene
  and Python syntax, plus a manual full Git LFS integrity job.
- Contribution guide, security policy, citation metadata and issue templates.
- Reproducible generation of local browser smoke-test cases.

### Corrected

- External benchmark wording now consistently says 400 pairs and 800 images.
- Privacy wording distinguishes local inference from remote source retrieval and
  the optional Google Lens action.
- Runtime documentation distinguishes the whole-image verdict from additional
  crop evidence passes.
- Training commands use a non-overlapping offset for the 4,000-pair corpus.

## 3 September 2026: shipping fine-tuned detector

### Added

- Fine-tuned DINOv2-S/14 detector with the final four blocks unfrozen.
- 24.9 MB MatMul-only dynamic INT8 ONNX graph for browser WASM.
- Temperature scaling and a three-state abstention policy.
- External 400-pair content-matched evaluation across four diffusion families.
- JPEG, WebP, resize, double-compression and screenshot robustness results.
- URL admission controls and private-address regression tests.
- Apache 2.0 project licensing and third-party notices.

### Measured

- 0.9543 external AUROC with a 0.9400 to 0.9668 bootstrap interval.
- 0.0222 calibrated expected calibration error.
- 14.25% external abstention, 6.88% false positives on decided authentic images
  and 93.77% true positives on decided generated images.

## 2 to 3 September 2026: evidence-led rebuild

### Added

- Direct measurement of the archived v1 checkpoints and extension path.
- Correct N-class output parsing and model interface assertions.
- Content-matched corpus construction and pair-safe split logic.
- Confound probes demonstrating shortcut learning.
- DINOv2 frozen-probe baseline and GPU fine-tuning pipeline.
- ONNX export comparison against PyTorch and browser-runtime smoke testing.

### Learned

- The v1 models performed at chance and caught 0 of 50 generated examples.
- A 0.990 held-out-generator result fell to 0.659 under content matching.
- Python-compatible `ConvInteger` quantisation did not run in browser WASM.
- A browser check that bypassed the real TypeScript parser missed a shipping
  failure.

## 14 May 2026: first inference redesign

- Reworked output correctness, learned fusion experiments and crop geometry.
- Established the code path that the September audit later measured directly.

## 6 to 14 February 2026: prototype

- Created the Chrome extension, popup, context-menu workflow and scanner UI.
- Added draggable and full-screen analysis surfaces.
- Added reverse-image search and a ten-tool forensic workspace.
- Introduced the original dual-model ONNX pipeline.
