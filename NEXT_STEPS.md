# NEXT_STEPS — autonomous overnight run

Rewritten after every milestone so work resumes exactly where it stopped,
whether that resumption is Claude after a usage-limit reset or a human reading
this in the morning.

**Branch:** `stage1-baseline` (local only — do not push without asking)
**Last updated:** 2026-09-02 21:00 UTC

## Locked direction (agreed with Akshay before he slept)

- Target: **Stages 2–5 of the strategy doc, scaled to CPU.**
- Git: commit to this branch after each milestone. **No pushing.**
- Extension: fix the parsing bug + assert the tensor contract at load time.
  **Do not re-enable a confident verdict** on the shipped checkpoints — they
  have been measured as noise.
- Hardware reality: **no CUDA.** `torch 2.10.0+cpu`, `cuda.is_available() == False`.
  591 GB free disk. Everything must be sized for CPU.

## Status

| Stage | State | Evidence |
|---|---|---|
| 1 — ground truth on shipped models | **DONE** | `docs/benchmark/v1_baseline.json`, `v1_baseline_note.md` |
| 2 — measurement harness | in progress | `docs/benchmark/PROTOCOL.md` exists; laundering + holdout not yet built |
| 3 — data (scaled) | not started | |
| 4 — DINOv2 feature extraction (scaled) | not started | |
| 5 — head + calibration + abstention band | not started | |
| worker.ts fix + contract assert | not started | |

## Stage 1 headline (do not re-derive — it is settled)

Both shipped checkpoints score **at chance**. Every class index of both models
has a 95% bootstrap CI containing 0.5. The extension caught **0 of 50**
generated images and flagged **1 of 50** photographs. No preprocessing in a
50-measurement sweep recovers signal (strongest deviation AUROC 0.341, inverted,
consistent with noise). The parsing bug is real but repairing it changes
0.472 → 0.445 AUROC: it was hiding an absence, not a capability.

## Immediate next actions, in order

1. **Fix `src/content/inference/worker.ts`** — correct the N-class softmax
   parse, and add a load-time assertion on tensor names / class count /
   normalisation constants that throws rather than guessing. Keep the verdict
   suppressed.
2. **Stage 2 harness** — extend `scripts/bench/` with:
   generator-family holdout splits; laundering augmentations at eval time (JPEG
   quality ladder, resize chains, screenshot re-capture); ECE alongside AUROC
   and FPR@95TPR.
3. **Stage 3 data (scaled)** — stream ~5–6k images via the HF rows API using the
   existing `fetch_eval_set.py` machinery. Real half from COCO; generated half
   from ELSA_D3 across all four generators. **Hold one generator family out
   entirely** for the cross-generator test. Never write more than needed to disk.
4. **Stage 4 features (scaled)** — frozen DINOv2 ViT-S/14 forward pass, CPU,
   cache embeddings to `.npy`. Budget ~0.1–0.2 s/image on CPU, so ~6k images is
   15–20 min. Cache is the whole point: every later experiment is then seconds.
5. **Stage 5 head** — logistic regression on cached embeddings, temperature
   scaling on a held-out split, abstention band chosen against a target FPR with
   an abstention ceiling of ~25%. Report against the v1 baseline of 0.50.

## Rules for the autonomous run

- Commit after every milestone; never leave the tree dirty across a wakeup.
- Update the Status table above *before* committing, so a cold resume is cheap.
- Cache every expensive computation to disk immediately (the Stage 1 run lost a
  full inference pass to an analysis-time crash before this rule existed).
- If a step is blocked, write the blocker here and move to the next independent
  step rather than stalling.
- Report unfavourable results as readily as favourable ones. The Stage 1 note
  sets the standard: it corrected two of the audit's own predictions.
