# UnDiffused: New Implementation V2/V3 Plan

## Document Purpose
This plan defines a full implementation roadmap for **V2** and **V3** of UnDiffused to improve AI-image detection quality from the current baseline (~60%) toward a validated high-accuracy target while remaining fully on-device.

## Hard Product Constraints
- Fully on-device inference (no server-side model execution).
- Max RAM usage: **1.5 GB**.
- Normal scan latency target: **5-6 seconds**.
- Deep scan latency target: **30-40 seconds**.
- Accuracy target: **>95%** on a clearly defined in-domain benchmark.
- You are willing to trade extra compute for better accuracy, as long as latency and memory budgets are respected.

## Why a V2 and V3 Split Is Needed
A single large rewrite is high risk. The current codebase has correctness and calibration issues that can suppress accuracy independent of model quality. V2 should fix correctness + system behavior + measurable gains. V3 should then push robustness/generalization with a more advanced model/training strategy.

---

## Current Critical Findings (Must Be Addressed First)

### 1) Output parsing bug for global model
- `public/models/model_global_quantized.onnx` outputs logits shape `[batch, 3]`.
- Current worker logic (`src/content/inference/worker.ts`) assumes outputs are either 1 or 2 classes.
- Effect: global probability can be miscomputed, corrupting fusion and final decisions.

### 2) Unverified class-index mapping
- AI class index is hardcoded by assumption.
- No explicit label map is loaded with the model.
- Effect: potential inverted or shifted class semantics.

### 3) Hardcoded fusion weights and threshold
- Current fusion uses fixed blending (e.g., `0.25 global + 0.75 local`) and fixed threshold 0.5.
- No learned calibration.
- Effect: unstable operating point across domains.

### 4) Deep-scan crop coverage is weak
- Non-overlapping tiles in deep scan can miss boundary artifacts.
- Effect: false negatives on localized manipulations.

### 5) Stale model path references
- Offscreen worker still references `model_quantized.onnx` while main inference pipeline uses dual models.
- Effect: maintenance drift and potential runtime confusion/regressions.

### 6) Memory strategy can be improved
- Both ~87 MB models are loaded eagerly.
- Effect: avoidable memory pressure and startup cost.

---

## Success Definition and Evaluation Contract
Before implementation, lock these definitions:

1. **Primary metrics**
- AUROC
- F1 at chosen threshold
- False Positive Rate at fixed True Positive Rate (e.g., FPR@95TPR)
- Calibration error (ECE)

2. **Latency metrics**
- End-to-end normal scan p50/p90
- End-to-end deep scan p50/p90
- Model-load cold-start time

3. **Memory metrics**
- Peak memory during cold-load + deep scan
- Steady-state memory after scan completion

4. **Benchmark partitions**
- In-domain test set (targeting your deployment distribution)
- Out-of-domain holdout (unseen generators + heavy compression/transforms)

Note: “>95%” must be tied to a specific benchmark definition. This prevents false confidence.

---

## V2 Plan (Stabilize + Large Accuracy Lift)

## V2 Goals
- Fix correctness and calibration issues end-to-end.
- Improve practical accuracy and consistency under current constraints.
- Deliver a measurable and reproducible uplift with low integration risk.

## V2 Scope Summary
1. Inference correctness hardening.
2. Better dual-model orchestration.
3. Learned fusion/calibration.
4. Improved crop policy for normal/deep scans.
5. Evaluation harness + reproducible benchmarks.
6. Memory and runtime optimizations without changing product architecture dramatically.

## V2 Detailed Workstreams

### Workstream A: Inference correctness and output contracts

#### A1. Add explicit model metadata contract
Create metadata files:
- `public/models/model_global_meta.json`
- `public/models/model_local_meta.json`

Each file should include:
- `input_name`
- `output_name`
- `num_classes`
- `ai_class_index`
- `normalization` (`mean`, `std`)
- `input_size`

Why:
- Removes implicit assumptions in code.
- Prevents future class-index errors.

#### A2. Refactor output parsing in worker
Edit `src/content/inference/worker.ts`:
- Replace hardcoded output-shape logic with metadata-driven parsing.
- Handle classes `>=2` using softmax and `ai_class_index`.
- Handle binary-logit models with sigmoid only when metadata declares binary-logit format.

Why:
- Directly fixes score corruption and unstable behavior.

#### A3. Add strict runtime assertions
In `src/content/inference/worker.ts`:
- Validate input/output tensor names and dimensions at model load.
- Fail fast with precise error if mismatch occurs.

Why:
- Prevents silent mis-inference after model swaps.

---

### Workstream B: Dual-model runtime orchestration (latency + memory)

#### B1. Lazy-load local model
In `src/content/inference/worker.ts`:
- Load global model at init.
- Load local model only when needed (uncertain global or deep scan).

Why:
- Lowers cold-start memory and improves initial responsiveness.

#### B2. Add uncertainty gate policy
Implement gate logic:
- If `global_ai_prob <= low_threshold` or `>= high_threshold`, fast-exit in normal mode.
- Otherwise run local scan.

Initial suggested thresholds:
- `low_threshold = 0.15`
- `high_threshold = 0.85`

Tune these on validation set.

Why:
- Preserves accuracy while reducing average compute.

#### B3. Optional model eviction timer
If memory pressure appears:
- Unload local session after idle timeout (e.g., 2-3 minutes).
- Recreate when required.

Why:
- Keeps memory below 1.5 GB on long browsing sessions.

---

### Workstream C: Crop policy redesign (especially deep scan)

#### C1. Normal scan crop budget
Update crop generation in `src/content/inference/crops.ts`:
- Use adaptive crop ranking.
- Cap normal scan to **10-12 local crops**.
- Ensure at least 1 center + edge diversity.

Why:
- Better signal coverage with predictable runtime.

#### C2. Deep scan overlapping tiling
For deep mode:
- Use overlap stride (e.g., 112 for 224 crop) instead of non-overlap.
- Add cap (e.g., max 80-120 tiles) based on image size and saliency ranking.

Why:
- Captures localized artifacts near tile boundaries without exploding latency.

#### C3. Priority-first deep scan
Process highest-priority tiles first (by saliency/uncertainty score).
- Early-stop if confidence saturates beyond high certainty.

Why:
- Improves average deep scan time while retaining thoroughness.

---

### Workstream D: Learned fusion and probability calibration

#### D1. Replace fixed weighted blend with trained fusion head
Train a tiny logistic regression (or small MLP if needed) offline using features:
- Global AI prob/logit margin
- Local top-1/top-3/top-5 means
- Local score variance
- Fraction of tiles above high-AI threshold
- Image-level quality stats (optional)

Ship coefficients in:
- `public/models/fusion_v2.json`

Implement in:
- `src/content/inference/worker.ts` (or new `src/content/inference/fusion.ts`)

Why:
- Learned fusion is almost always better than hand-tuned weights.

#### D2. Temperature scaling / calibration
Calibrate final score on validation set and apply at runtime.
Store parameters in `fusion_v2.json`.

Why:
- Improves reliability of confidence outputs and threshold stability.

#### D3. Threshold selection by objective
Choose default threshold by selected objective:
- Max F1, or
- constrained FPR.

Document threshold provenance in benchmark report.

---

### Workstream E: Data and training pipeline for V2 models

#### E1. Rebuild reproducible training scripts directory
Add project-level scripts (missing right now) under:
- `scripts/train_global.py`
- `scripts/train_local.py`
- `scripts/export_onnx.py`
- `scripts/quantize_onnx.py`
- `scripts/eval.py`
- `scripts/train_fusion.py`

Why:
- Current repo contains requirements but missing training pipeline source.

#### E2. Dataset strategy
Build datasets with strict split hygiene:
- Real images from diverse camera pipelines and web compressions.
- AI images across multiple generators and versions.
- Holdout split by generator family for generalization checks.
- Duplicate near-match removal across splits.

Why:
- Prevents leakage and fake performance inflation.

#### E3. Augmentation policy
Apply realistic transforms:
- JPEG quality sweeps
- Resize up/down
- Blur/noise
- Screenshot-like resampling
- Color/contrast shifts

Why:
- Forces detector to learn robust cues, not compression shortcuts.

#### E4. Hard negative mining loop
After each training cycle:
- collect misclassified samples
- upweight in next round

Why:
- Improves decision boundaries quickly in practical scenarios.

---

### Workstream F: Benchmark and QA harness

#### F1. Add reproducible benchmark reports
Output to:
- `benchmarks/v2_baseline.json`
- `benchmarks/v2_candidate_*.json`

Include:
- AUROC, F1, calibration, confusion matrix
- normal/deep latency stats
- scan-size buckets

#### F2. Add inference regression tests
Add tests for:
- class parsing correctness (2-class and 3-class outputs)
- fusion math consistency
- crop-count constraints by mode

Potential files:
- `src/content/inference/__tests__/worker-parsing.test.ts`
- `src/content/inference/__tests__/fusion.test.ts`
- `src/content/inference/__tests__/crops.test.ts`

#### F3. Golden-sample suite
Keep a small fixed image set in repo or private artifact bucket with expected outputs.

Why:
- Prevents accidental degradation across future changes.

---

## V2 Milestones and Acceptance Criteria

### M1. Correctness complete
- All model outputs parsed via metadata contract.
- No hardcoded class assumptions.
- Unit tests pass for parsing.

### M2. Runtime policy complete
- Local model lazy-loaded.
- Normal scan p90 within 5-6s target on reference machine.
- Deep scan p90 within 30-40s with crop cap.

### M3. Accuracy uplift complete
- Significant lift over current baseline on in-domain benchmark.
- Confidence calibration improves ECE.

### M4. V2 release gate
- Memory peak < 1.5 GB
- No critical regressions in UX flow
- Benchmark report attached to release

---

## V3 Plan (Robustness + 95% Target Push)

## V3 Goals
- Push toward >95% on in-domain benchmark with stronger out-of-domain resilience.
- Reduce brittleness to unseen generators and heavy post-processing.
- Keep on-device constraints intact using smarter architectures and distillation.

## V3 Scope Summary
1. Multi-expert detector architecture.
2. Distillation to efficient runtime models.
3. Advanced uncertainty handling and abstention policy.
4. Expanded robustness validation.

## V3 Detailed Workstreams

### Workstream G: Multi-expert architecture

#### G1. Replace same-family dual model with diverse experts
Design three complementary branches:
1. **Global semantic branch** (full-image cues)
2. **Local forensic branch** (patch-level artifacts)
3. **Frequency/residual branch** (DCT/high-frequency residual cues)

Why:
- Diversity reduces correlated failure modes.

#### G2. Hierarchical gating
Execution order:
1. Global branch first
2. If uncertain, trigger local branch
3. If still uncertain, trigger forensic frequency branch

Why:
- Controls compute while maximizing difficult-case accuracy.

#### G3. Unified meta-fusion head v3
Use a slightly richer fusion model than V2 logistic regression (still small enough for CPU).
- Option: gradient-boosted shallow model converted to plain math rules, or tiny MLP.

---

### Workstream H: Teacher-student distillation

#### H1. Train larger teacher ensemble offline
Teacher can be heavy (not shipped) and includes richer backbones and augmentations.

#### H2. Distill to deployable student models
Distill teacher outputs into runtime branches.
- Target smaller model footprints and better calibration.

Why:
- Gains some ensemble accuracy while keeping on-device inference feasible.

---

### Workstream I: Robustness engineering

#### I1. Explicit post-processing stress curriculum
Train/evaluate under:
- recompression cascades
- resize chains
- screenshot re-capture
- partial crops
- text overlays

#### I2. OOD and abstention mode
Add “uncertain” state when confidence is unreliable.
- UI can surface: “Needs deep scan” or “Low confidence.”

Why:
- Avoids overconfident wrong predictions in edge cases.

#### I3. Generator-family holdout benchmarking
Ensure final reported metrics include unseen generator families.

---

### Workstream J: Runtime platform upgrades

#### J1. Add optional WebGPU path
- Prefer WebGPU if available.
- Fall back to WASM automatically.

Why:
- Better throughput for deep scan on supported hardware.

#### J2. Convert ONNX to ORT format and re-optimize
- Reduce load and execution overhead.

#### J3. Memory-optimized tensor lifecycle
- Reuse tensor buffers where practical.
- Avoid unnecessary allocations in crop loops.

---

## V3 Milestones and Acceptance Criteria

### M1. Architecture integration complete
- 3-branch experts integrated with hierarchical gating.
- Stable runtime within memory constraints.

### M2. Distillation complete
- Student models replace heavy candidates with minimal quality loss.

### M3. Robustness validation complete
- Strong gains on transformed and unseen-generator test suites.
- Better calibrated confidence and abstention handling.

### M4. V3 release gate
- In-domain target near/above 95% (as defined).
- Deep-scan p90 and memory targets still met.

---

## Proposed File-by-File Change Plan

### Existing files to modify (V2 first)
- `src/content/inference/worker.ts`
  - metadata-driven output parsing
  - lazy loading
  - fusion refactor
  - uncertainty gate
- `src/content/inference/pipeline.ts`
  - mode config pass-through
  - improved progress semantics
- `src/content/inference/crops.ts`
  - overlapping deep tiles
  - crop caps and priority
- `src/content/inference/types.ts`
  - extend result schema for calibration/debug fields
- `src/content/Scanner.tsx`
  - optional uncertain-state UI hooks
- `src/offscreen/worker.ts`
  - remove stale single-model path or align with active pipeline
- `README.md` and `public/README.md`
  - align docs with dual-model runtime and training scripts

### New files to add
- `src/content/inference/fusion.ts`
- `src/content/inference/modelMeta.ts`
- `public/models/model_global_meta.json`
- `public/models/model_local_meta.json`
- `public/models/fusion_v2.json`
- `scripts/train_global.py`
- `scripts/train_local.py`
- `scripts/train_fusion.py`
- `scripts/export_onnx.py`
- `scripts/quantize_onnx.py`
- `scripts/eval.py`
- `docs/benchmark_protocol.md`
- `docs/v2_v3_release_checklist.md`

---

## Rollout Strategy

## Phase 0: Baseline capture (no behavior changes)
- Lock current benchmark numbers and latency/memory profile.

## Phase 1: Correctness patch release
- Fix output parsing + class mapping + metadata.
- Re-benchmark immediately to quantify pure correctness gains.

## Phase 2: V2 fusion and crop policy
- Introduce learned fusion and improved deep-scan tiling.
- Tune thresholds against validation objective.

## Phase 3: V2 production hardening
- Add tests, documentation, and release checklist.

## Phase 4: V3 research branch
- Multi-expert + distillation + robust curriculum.

## Phase 5: V3 integration and launch
- Integrate best candidate, run full benchmark suite, ship if release gates pass.

---

## Risk Register and Mitigations

1. **Risk:** Overfitting to known generators.
- Mitigation: generator-family holdout and OOD benchmark required for release.

2. **Risk:** Accuracy gains break latency targets.
- Mitigation: hierarchical gating + crop caps + early stopping.

3. **Risk:** Quantization degrades calibration.
- Mitigation: post-quantization calibration and threshold retuning.

4. **Risk:** Memory spikes during deep scan.
- Mitigation: lazy load, model eviction, tensor reuse, bounded batch sizes.

5. **Risk:** Team uncertainty due to missing training scripts.
- Mitigation: rebuild scripts first and document end-to-end reproducible commands.

---

## Concrete Release Checklist (Both V2 and V3)
- [ ] Model metadata contracts validated at startup.
- [ ] Class mapping verified on labeled sanity samples.
- [ ] Fusion calibration file versioned with model artifacts.
- [ ] Normal scan p90 <= 6s on reference hardware.
- [ ] Deep scan p90 <= 40s on reference hardware.
- [ ] Peak RAM < 1.5 GB.
- [ ] Benchmark report archived and compared with previous release.
- [ ] Regression tests pass.
- [ ] Documentation updated.

---

## Final Recommendation
- Proceed with V2 immediately; it likely delivers the largest short-term gain because current inference correctness and calibration issues can heavily suppress performance.
- Treat V3 as a robustness and generalization program after V2 metrics stabilize.
- Keep “95%” as a benchmark-specific release gate, not a universal claim.