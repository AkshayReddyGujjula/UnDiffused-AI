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
| v2 frozen probe | **0.894** | int8, on `matched_control_v1` |
| v2 fine-tuned (**now shipping**) | **0.954** | int8, same set; 0.948–0.958 under laundering |

Calibration of the shipped fine-tune (`docs/benchmark/v2_finetuned_calibration.json`):
temperature **1.9077**, band **0.2102 / 0.6482**, ECE 0.061 → **0.022**.

Fine-tune fp32: val 0.9696 · test 0.9602 · **held-out SDXL 0.9720**.
Training: 8 epochs, ~4.3 min/epoch on the 1660 Ti, best epoch 5 auto-saved.

---

## EXACTLY WHERE WE ARE

The fine-tune won, was calibrated, and **is now the shipped model** on the
laptop side. Calibration ran on the desktop and produced temperature **1.9077**
and band **0.2102 / 0.6482**; both are in `contract.ts`.

Done on the laptop (committed, pushed):

- `contract.ts` — `DETECTOR_V2` renamed to `detector_v2_finetuned` and given a
  `temperature` field; `DETECTOR_V2_PROBE` added alongside it with
  `temperature: 1.0`. `logitsToAiProbabilities` now takes a temperature,
  defaulting to the shipped model's, and rejects a non-positive one.
- `ABSTENTION_BAND` — new thresholds. The `measured*` fields carry the
  **external** numbers (abstain 14.25%, FPR **6.88%**, TPR 93.77%), not the
  validation fit's 4.97% FPR. The val fit is kept in `fittedOnVal` as provenance.
- `DETECTOR_V2_CALIBRATION` — re-measured; `shortcutGap` and `unmatchedAuroc`
  are now `null` because that comparison has not been re-run for this model.
- Model path repointed in `pipeline.ts`, `manifest.json`, `browser_check.html`.
- `browser_check.html` no longer hardcodes thresholds; it reads `ABSTENTION_BAND`.
- README re-stated against the fine-tune's numbers.
- 23 tests pass (was 17); `npm run build` clean.

### Why the temperature lives on the contract, not in the parser

The probe's graph has its temperature **folded in** at export; the fine-tune's
does not. A bare `logit / 1.9077` inside `logitsToAiProbabilities` would
double-apply the moment anyone repointed at the probe, and would do so silently
— the output stays in [0, 1] and looks fine. The divisor therefore travels with
the model contract, and a test pins that.

### Remaining, on the desktop, in order

1. `git pull`
2. `npm run build`
3. `npm run verify:bundle` — **required**, and easy to miss:
   `scripts/verify/contract.mjs` is gitignored and regenerated from
   `contract.ts`. Skip it and the browser check silently verifies the *old*
   thresholds.
4. `python -m http.server 8899` then open
   `http://127.0.0.1:8899/scripts/verify/browser_check.html` — require
   `BROWSER_CHECK_PASS`, and sanity-check that the logged `P(AI)` values are
   spread across the new band rather than clustered above 0.648.
5. Load `dist/` unpacked at `chrome://extensions` (reload the extension **and**
   the test tab), confirm right-click scan works, then commit and push.

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
- **`npm run verify:bundle` after every `contract.ts` change.**
  `scripts/verify/contract.mjs` is gitignored and built from `contract.ts`.
  A stale one makes `browser_check.html` verify thresholds that are no longer
  shipped, and it still prints `BROWSER_CHECK_PASS`.
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
