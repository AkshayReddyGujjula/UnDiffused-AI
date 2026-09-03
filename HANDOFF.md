# Handoff — read this first

State as of 2026-09-03. Branch `stage1-baseline`, pushed to
`github.com/AkshayReddyGujjula/UnDiffused-AI`.

---

## Two machines, and why it matters

| | Path | Role |
|---|---|---|
| **Laptop** | `C:\Users\aksha\Desktop\GitHub\UnDiffused-AI` | Where Claude runs. **No CUDA.** Python 3.14. |
| **Desktop** (HomePC) | `D:\UnDiffused-AI` | GTX 1660 Ti. All training happens here. |

**Claude cannot run commands on the desktop.** Akshay pastes output back. So
desktop instructions must be exact, and **single-line** — MINGW64 bash treats a
wrapped line as a new command, which has already broken one paste (a flag ended
a line, its value became a separate command, and bash tried to execute a JSON
file).

Image datasets are gitignored and must be re-fetched per machine. Only manifests
and models are committed.

---

## What this project is

A Chrome extension that detects AI-generated images on-device. The substance is
not the detector — it is the record of measuring a shipped model, finding it
detected nothing, and rebuilding it under an evaluation protocol strict enough
to catch its own replacement cheating.

**Goal: CV-ready.** Repo + benchmark report + a working demo of the extension.

---

## The four findings (this is the CV material)

1. **The shipped v1 model detected nothing.** Two 87 MB ViT-B/16 checkpoints,
   measured at **0.50 AUROC** — every class index's 95% CI contains 0.5. Through
   the real extension path it caught **0 of 50** generated images and flagged 1
   of 50 photographs. There *was* a genuine output-parsing bug (3-class model
   fell through to a branch indexing `outputData[i]`, reading across class and
   batch boundaries), but fixing it moved AUROC 0.472 → 0.445. **The bug was
   concealing an absence, not a capability.**

2. **A held-out-generator test certified a model that had learned nothing.** The
   first rebuild scored 0.975 in-distribution and **0.990 on held-out SDXL** —
   and 0.659 on content-matched pairs. It had learned *which dataset an image
   came from* (COCO everyday scenes vs ELSA/LAION product shots), not whether it
   was generated. A generator holdout can't detect this: it holds out the
   generator while leaving the corpus seam intact. Training on content-matched
   pairs (each real photo paired with an AI image from that photo's own caption)
   closed the gap from 0.32 to −0.008.

3. **An int8 export that passed every Python check could not load in a browser.**
   `quantize_dynamic` emits `ConvInteger`, for which onnxruntime-web's WASM
   backend has no kernel. Fix: quantize `MatMul` only. Both exporters now refuse
   to write a file containing WASM-unsupported ops.

4. **Verification that bypasses the real code path proves nothing.** The model's
   output is rank-1 `[batch]` (the head ends in `.squeeze(-1)`), but the parser
   required rank-2 and would have thrown on *every scan*. The browser harness
   missed it by reading the raw output buffer instead of calling the parser. It
   now imports the real contract module.

---

## Numbers

| Model | Held-out AUROC | Notes |
|---|---|---|
| v1 shipped | **0.50** | caught 0 of 50 |
| v2 frozen probe (**currently shipping**) | **0.894** | int8, on `matched_control_v1` |
| v2 fine-tuned (**trained, not yet shipped**) | **0.954** | int8, same set; 0.948–0.958 under laundering |

Fine-tune fp32: val 0.9696 · test 0.9602 · **held-out SDXL 0.9720**.
Training: 8 epochs, ~4.3 min/epoch on the 1660 Ti, best epoch 5 auto-saved.

---

## EXACTLY WHERE WE ARE

The fine-tune **won** and is exported, quantized and scored. It is **not yet
shipped**, deliberately.

**Why not:** the extension's three-state thresholds (`likely authentic` < 0.545,
`likely AI` > 0.846) and its claim of "~25% abstention at ~5% FPR" were fitted to
the **probe's** score distribution. The fine-tune was exported *without*
calibration (raw `sigmoid(logit)`), and its ECE rose to ~0.07. Dropping it in
behind the old thresholds would give a real AUROC with **wrong verdict labels and
a false stated FPR** — unacceptable for a project whose whole pitch is calibrated
honesty.

### Next action (desktop)

```bash
python scripts/bench/calibrate_onnx.py
```

~5 min. Reconstructs the exact training val split (same seed and `pair_id`
grouping as `finetune_gpu.py`), fits a temperature by NLL, picks the band at 5%
FPR under a 25% abstention ceiling, and reports the band's real behaviour on the
external `matched_control_v1`. Prints a `COPY THESE INTO contract.ts` block.

### Then, in order

1. **Laptop:** update `src/content/inference/contract.ts` — add the fitted
   `temperature` (divide the logit by it before `sigmoid` in
   `logitsToAiProbabilities`), set the new `ABSTENTION_BAND` low/high, update
   `DETECTOR_V2_CALIBRATION` numbers.
2. **Laptop:** repoint the extension from `detector_v2_probe_int8.onnx` to
   `detector_v2_finetuned_int8.onnx` in `src/content/inference/pipeline.ts`,
   `manifest.json` (`web_accessible_resources`), and
   `scripts/verify/browser_check.html`. Push.
3. **Desktop:** `git pull && npm run build`
4. **Desktop:** browser check — `python -m http.server 8899`, open
   `http://127.0.0.1:8899/scripts/verify/browser_check.html`, require
   `BROWSER_CHECK_PASS`.
5. **Desktop:** load `dist/` unpacked, confirm right-click scan works, commit,
   push.

---

## Gotchas already paid for — do not rediscover

- **PyTorch CUDA index:** use `cu126`. `cu121` has **no Python 3.14 wheels** and
  fails with `Could not find a version that satisfies the requirement torch
  (from versions: none)` — which looks like a network error and isn't.
- **Single-line commands only** for the desktop (MINGW64 wrapping, above).
- **`score_model.py` from `scripts/bench`** needs an explicit
  `--eval-sets ../../docs/benchmark/matched_control_v1`, or it silently skips
  everything. (Defaults now also resolve against repo root.)
- **Quantize `MatMul` only.** Never let `ConvInteger` into a shipped graph.
- **`dist/` is untracked now.** It was committed before `.gitignore` listed it,
  and every `npm run build` on two machines caused pull conflicts.
- **Right-click needed two fixes:** (a) manifest content scripts only inject on
  page load, so pre-existing tabs have none — now injected on demand via
  `chrome.scripting`; (b) the `SCANNING` listener was `async`, and Chrome only
  keeps a message port open for a literal `true` return, so `sendMessage`
  rejected even on success. Scan requests are now buffered at module scope and
  replayed when React mounts, and both ping and scan are pinned to `frameId: 0`
  so an ad iframe can't answer for the page.

---

## Open gaps — state these, don't hide them

- **Cross-generator beyond four open-source diffusion families is untested.** No
  Midjourney, no Firefly. Akshay observed poor detection on cgdream.ai images —
  that is exactly this gap, and it's the most reproduced finding in the
  literature. Worth quantifying with a real benchmark run.
- **A laptop-vs-desktop verdict discrepancy was never diagnosed.** Same model
  file should give identical `P(AI)`. Compare the `P(AI)=` line in the page
  console (F12) on both. Most likely the laptop was still running an older build.
- **The "real" half of the matched corpus is LAION web imagery** — includes
  graphics, product shots, screenshots. Makes the score conservative, not
  inflated, but it is not a clean photographic corpus.
- **25% abstention is a real cost**, not a rhetorical flourish.
- **`src/offscreen/` is dead code** — bundled, never instantiated, references a
  model file that doesn't exist.
- **Log files got committed** (`train.log`, `score.log`, `fetch.log`,
  `export.log`). Harmless; gitignore them in a cleanup pass.
- **C2PA / provenance layer not started.** Highest-value next feature: it's
  deterministic and cannot be wrong where a signature exists.

---

## Verification commands

```bash
npm test          # 17 regression tests, Node's built-in runner
npm run build     # typecheck + vite build
```

Protocol: `docs/benchmark/PROTOCOL.md` · Results: `docs/benchmark/` ·
Training: `docs/TRAINING_GUIDE.md` (written for a first-time trainer)
