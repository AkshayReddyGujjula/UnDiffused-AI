# Where this stands, and what to do next

**Branch:** `stage1-baseline` — committed locally, **not pushed**.
**Last updated:** 2026-09-03, morning.

---

## Read this first

The project works. The extension builds, loads a real model, and returns
calibrated three-state verdicts. The headline is **0.50 → ~0.89 AUROC**, measured
on content-matched pairs.

Three things were found along the way that are worth more than the number, and
all three are written up in the README:

1. The shipped model detected nothing (0.50, caught 0 of 50).
2. A held-out-generator test certified a replacement that had learned to tell
   two *datasets* apart (0.990 on the holdout, 0.659 on matched content).
3. The int8 export passed every Python check and could not load in a browser
   (`ConvInteger` has no WASM kernel).

---

## Your morning, in order

### 1. Push (2 min)

Nothing has left this machine.

```bash
git push -u origin stage1-baseline
```

### 2. Look at the extension (10 min)

```bash
npm install && npm run build
```

`chrome://extensions` → Developer mode → Load unpacked → `dist/`.
Right-click an image → *Scan with UnDiffused*. Try a real photo and an AI image.

Expect a three-state verdict, not a percentage. The first scan takes up to ~30 s
while the 25 MB model is fetched and optimised; after that ~0.7–0.9 s per image.

**If right-click does nothing**, that was a real bug and it is fixed — but the
fix only applies to a freshly loaded build. Reload the extension at
`chrome://extensions`, then reload the tab you are testing on. If it still does
nothing, open the service-worker console (the "service worker" link on the
extension card) and look for `[UnDiffused]` lines; failures now show a red `!`
badge on the toolbar icon with the reason in its tooltip.

### 3. Train on the 1660 Ti (1–2 hrs, mostly waiting)

Follow **[docs/TRAINING_GUIDE.md](docs/TRAINING_GUIDE.md)** exactly. It assumes
no prior knowledge and every command is copy-paste.

This is optional in the sense that you already have a working model — the
shipped one is a *frozen-backbone linear probe*. Fine-tuning the last few
transformer blocks is what the GPU buys you, and the guide's success criterion
is beating **0.884**.

If it doesn't beat it, that is a legitimate result to report, not a failure.
Say so and keep the probe.

### 4. Re-score whatever you train

```bash
python scripts/train/export_probe_onnx.py --quantize   # or export_onnx.py for a fine-tune
python scripts/bench/score_model.py --model public/models/<file>.onnx --meta public/models/<file>_meta.json
```

Then verify it in a browser before believing it:

```bash
python -m http.server 8899
# open http://127.0.0.1:8899/scripts/verify/browser_check.html
```

Look for `BROWSER_CHECK_PASS`. This is the step that caught the `ConvInteger`
bug that every Python check missed.

---

## State

| Piece | Status |
|---|---|
| v1 baseline measured | done — `docs/benchmark/v1_baseline.json` |
| Parsing bug fixed, contract asserted | done — 17 tests passing |
| Laundering suite, holdout, confound control | done — `scripts/bench/laundering.py` |
| Content-matched corpus (4047 pairs) | done — on disk, gitignored, re-fetchable |
| DINOv2 features cached | done — `docs/benchmark/corpus_v1/features/` |
| Calibrated probe + abstention band | done — `docs/benchmark/v2_matched_probe.json` |
| ONNX export, verified twice | done — 24.9 MB int8 |
| Browser runtime verified | done — `BROWSER_CHECK_PASS` |
| Extension rewired to v2 | done — builds clean |
| README rewritten | done |
| Right-click flow fixed | done — on-demand injection, visible failures |
| GPU pipeline smoke-tested | done — full path exercised on CPU |
| GPU fine-tune at scale | **not run** — needs your desktop |
| C2PA provenance layer | not started |

---

## Honest gaps

Worth knowing before you talk about this, because someone will ask.

- **The GPU fine-tune has now been smoke-tested** end to end on CPU (24 pairs,
  2 epochs): loss falls, val AUROC rises, checkpoint and report are written, and
  the ONNX export succeeds and passes the browser-compatibility gate. It has
  still never run at full scale on a GPU, so treat the first real run as the
  first real run. Step 4 of the training guide starts with a 2-minute smoke test
  for exactly this reason.
- **The "real" half of the matched corpus is LAION web imagery** — includes
  graphics, product shots and screenshots, not a clean photographic corpus. It
  makes the score conservative rather than inflated, but it is not ideal.
- **Four generator families, all open-source diffusion.** No Midjourney, no
  Firefly. Cross-family generalisation beyond diffusion is untested.
- **The 25% abstention rate is a real cost**, not a rhetorical flourish.
- **Dead code remains**: `src/offscreen/` is bundled but never instantiated and
  references a model file that does not exist. The audit flagged it; it is still
  there.

---

## If you want to go further

Roughly in order of value per hour:

1. **C2PA / provenance layer.** Deterministic and always correct where a
   signature exists. The metadata tool already parses JPEG APP1/APP13 by hand.
   This is the one layer that cannot be wrong.
2. **More generator families.** The single highest-leverage variable in the
   literature. Midjourney and Firefly samples would materially strengthen the
   claim.
3. **Fine-tune, then distil.** Only worth it after fine-tuning shows a gain.
4. **Trim the package.** `public/wasm/` is ~87 MB of ONNX Runtime binaries;
   most builds are unused.
5. **Narrow permissions further.** `activeTab` has been removed, but content
   scripts still inject on all pages unconditionally. With on-demand injection
   now in place, the declarative content script could be dropped entirely.
