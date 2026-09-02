# NEXT_STEPS — autonomous overnight run

Rewritten after every milestone so work resumes exactly where it stopped,
whether that resumption is Claude after a usage-limit reset or a human reading
this in the morning.

**Branch:** `stage1-baseline` (local only — do not push without asking)
**Last updated:** 2026-09-02 21:55 UTC

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
| 2 — measurement harness | **DONE** | `laundering.py` (9 transforms), `probe_confound.py`, holdout wired into `fetch_corpus.py` |
| 3 — data (scaled) | downloading | `fetch_corpus.py` running; SDXL held out entirely |
| 4 — DINOv2 feature extraction (scaled) | harness ready | `extract_features.py`; eval-set features cached; 0.117 s/img on CPU |
| 5 — head + calibration + abstention band | not started | |
| worker.ts fix + contract assert | **DONE** | `src/content/inference/contract.ts`, `tests/parse.test.mjs` (12 passing), `npm run build` clean |

## Stage 1 headline (do not re-derive — it is settled)

Both shipped checkpoints score **at chance**. Every class index of both models
has a 95% bootstrap CI containing 0.5. The extension caught **0 of 50**
generated images and flagged **1 of 50** photographs. No preprocessing in a
50-measurement sweep recovers signal (strongest deviation AUROC 0.341, inverted,
consistent with noise). The parsing bug is real but repairing it changes
0.472 → 0.445 AUROC: it was hiding an absence, not a capability.

## OPEN RISK — read this first on resume

The feasibility probe put DINOv2-small at **0.91 AUROC** on the same 100 images
where the shipped checkpoints scored 0.50, and it held flat (0.905–0.910)
through every laundering transform including JPEG q30 and a screenshot
simulation.

**That flatness is a warning, not a triumph.** Generator artefacts are
high-frequency and should degrade under recompression; semantic content does
not. COCO is everyday scenes, while ELSA prompts come from LAION web alt-text
(posters, product shots, news imagery). The probe may be separating
"COCO-style scene" from "LAION-style scene" and never looking at authenticity
at all.

`fetch_matched_control.py` builds the decisive control: each ELSA_D3 row's
`url` field is the LAION original whose alt-text became the generation prompt,
so downloading it yields a real image from the *same content distribution* as
the render in that row. Content held constant, only authenticity varies.

- If the probe still scores ~0.9 there, the signal is real.
- **If it falls towards chance, the 0.91 is an artefact of corpus mismatch and
  must not be reported as a detection result.**

Do not publish any headline number before this control has been run.

## Immediate next actions, in order

1. ~~Fix `worker.ts`~~ — **DONE.** Parsing extracted to `contract.ts` as pure
   `logitsToDistributions` (strides by class count), contract asserted at load
   and on first output shape, `aiClassIndex: null` propagates to a
   `model_unavailable` status so the UI shows "No model verdict" instead of a
   fabricated percentage. `npm test` runs 12 regression tests via Node's built-in
   runner (no new deps).
2. ~~Stage 2 harness~~ — **DONE.** `laundering.py` has 9 transforms
   (identity, the confound control, a JPEG quality ladder, double JPEG, resize
   chain, WebP, screenshot). `probe_confound.py` runs the full suite. ECE and
   FPR@95TPR still to add in Stage 5's report.
3. **Stage 3 data (scaled)** — `fetch_corpus.py` is running (2500 real + 2500
   AI, SDXL held out entirely to `test_heldout`, eval_set_v1 row offsets
   excluded to prevent leakage). Watch for HTTP 429; the retry/backoff handles
   it but paging is slow.
3b. **Matched-content control** — `fetch_matched_control.py` running, 400 pairs.
   This gates everything downstream. See OPEN RISK above.
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
