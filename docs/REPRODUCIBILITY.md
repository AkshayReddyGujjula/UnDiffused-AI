# Reproducibility guide

This guide separates checks that work from a clean clone from steps that require
downloaded image bytes, GPU time or manual browser interaction.

## Reproduction matrix

| Goal | Clean clone | Extra requirement | Expected output |
|---|---|---|---|
| Build the extension | Yes | Git LFS model and WASM objects | `dist/` |
| Run contract and URL tests | Yes | Node dependencies | 31 passing tests |
| Check repository integrity | Yes | Git available | JSON, links and Unicode policy pass |
| Verify Git LFS | Yes | Git LFS installed | all tracked objects valid |
| Re-run v1 evaluation | No | fetch the 100-image v1 set | `v1_baseline.json` |
| Re-score shipping v2 | No | fetch the 400-pair external set | `v2_finetuned_results.json` |
| Retrain shipping v2 | No | fetch 4,000 pairs and use a CUDA-capable GPU | checkpoint in `models/v2/` |
| Run browser smoke check | No | generated cases, local HTTP server and manual browser | `BROWSER_CHECK_PASS` plus inspected logs |

## 1. Clone large files correctly

```bash
git clone https://github.com/AkshayReddyGujjula/UnDiffused-AI.git
cd UnDiffused-AI
git lfs install
git lfs pull
git lfs fsck
```

The shipping ONNX graph and ONNX Runtime Web WASM files use Git LFS. A small text
pointer in place of the binary means LFS checkout has not completed.

## 2. JavaScript and extension checks

```bash
npm ci
npm test
npm run build
npm run verify:repo
npm audit --audit-level=low
```

| Command | Purpose |
|---|---|
| `npm test` | bundles and runs model-contract and URL-guard regression tests |
| `npm run build` | type-checks and builds the Manifest V3 extension |
| `npm run verify:repo` | parses JSON, checks local Markdown links and rejects prohibited Unicode dashes |
| `npm audit --audit-level=low` | checks the current npm dependency graph |

Load `dist/` as an unpacked extension for a manual product check.

## 3. Python environment

Create an isolated environment before installing the research stack:

```bash
python -m venv .venv
```

PowerShell:

```powershell
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
pip check
```

The requirements file uses minimum versions rather than a complete lock. Record
`python --version` and `pip freeze` when reproducing a published result because
future resolver output can differ.

## 4. Reconstruct the datasets

### Historical v1 set

```bash
python scripts/bench/fetch_eval_set.py
```

This fetches 50 source images and 50 generated images for the historical v1
measurement. The protocol is [`benchmark/PROTOCOL.md`](benchmark/PROTOCOL.md).

### v2 training corpus

```bash
python scripts/bench/fetch_matched_control.py \
  --pairs 4000 \
  --start-offset 200000 \
  --out docs/benchmark/matched_corpus_v1
```

### v2 external corpus

```bash
python scripts/bench/fetch_matched_control.py \
  --pairs 400 \
  --start-offset 100000 \
  --out docs/benchmark/matched_control_v1
```

The two offsets are intentional. Using the fetcher's default offset for both
commands would contaminate the external check with training records.

Compare downloaded hashes with the committed manifests before trusting a result.
The URLs are third-party sources and may disappear over time.

## 5. Reproduce the historical v1 finding

```bash
python scripts/bench/verify_port/compare.py
cd scripts/bench
python run_baseline.py
cd ../..
```

Expected headline: both archived checkpoints remain within chance-level
confidence intervals, and the shipping v1 path catches 0 of 50 generated images.

The detailed expected values are in
[`benchmark/v1_baseline_note.md`](benchmark/v1_baseline_note.md).

## 6. Train the current architecture

Start with a small smoke test:

```bash
python scripts/train/finetune_gpu.py --epochs 1 --limit-pairs 10
```

Then run the full default training configuration:

```bash
python scripts/train/finetune_gpu.py
```

The default configuration uses eight epochs, batch size 16, the final four
unfrozen blocks and SDXL as the held-out generator. The previous measured run
took about 35 minutes on a GTX 1660 Ti, but timing depends on hardware, library
versions, storage and thermal conditions.

See [Training guide](TRAINING_GUIDE.md) for first-principles explanations and
failure recovery.

## 7. Export the exact browser artefact

```bash
python scripts/train/export_onnx.py \
  --checkpoint models/v2/detector_best.pt \
  --name detector_v2_finetuned \
  --quantize
```

The exporter should:

1. reconstruct the architecture from checkpoint arguments;
2. export an opset 17 FP32 graph;
3. compare FP32 ONNX outputs with PyTorch;
4. create a MatMul-only dynamic INT8 graph;
5. measure the quantisation divergence;
6. derive metadata from the actual graph.

Do not replace the tracked shipping model until the INT8 graph has been scored
and tested in browser WASM.

## 8. Score the shipping graph

```bash
python scripts/bench/score_model.py \
  --model public/models/detector_v2_finetuned_int8.onnx \
  --meta public/models/detector_v2_finetuned_meta.json \
  --eval-sets docs/benchmark/matched_control_v1 \
  --out docs/benchmark/v2_finetuned_results.json
```

The command evaluates identity plus all laundering transforms. Compare the
result with the tracked JSON rather than relying on console rounding.

## 9. Refit calibration without consuming the external set

```bash
python scripts/bench/calibrate_onnx.py
```

The script reconstructs the pair-safe validation split, fits temperature and the
abstention band there, then applies the frozen policy to the external corpus.
Do not tune the band after reading the external result.

## 10. Browser-runtime smoke check

First generate a small local case bundle from fetched external images:

```bash
python scripts/verify/generate_browser_cases.py
npm run verify:bundle
python -m http.server 8899
```

Open:

```text
http://127.0.0.1:8899/scripts/verify/browser_check.html
```

Confirm all of the following manually:

- the session loads with the WASM execution provider;
- input and output names pass the real TypeScript contract;
- generated examples have a higher mean score than source examples;
- no console exception or missing asset appears;
- the page prints `BROWSER_CHECK_PASS`.

This is a runtime smoke test, not an accuracy benchmark. It checks a small local
sample and only requires score direction, so the JSON benchmark remains the
quality source of truth.

The generated `cases.js` and bundled `contract.mjs` are intentionally ignored.

## 11. Evidence that should change together

When a new model is proposed, review these files as one unit:

| Concern | File |
|---|---|
| Shipping graph | `public/models/*_int8.onnx` |
| Generated graph metadata | `public/models/*_meta.json` |
| Runtime contract and thresholds | `src/content/inference/contract.ts` |
| Worker model path | `src/content/inference/pipeline.ts` |
| Packaged web-accessible assets | `manifest.json` |
| External quality | `docs/benchmark/*_results.json` |
| Calibration policy | `docs/benchmark/*_calibration.json` |
| Public claims | `README.md`, `docs/MODEL_CARD.md` |

The model metadata is generated from export but is not loaded dynamically by the
extension. Agreement across these files is verified by review and tests, not by
one runtime configuration source.

## 12. Reproduction limits

- Third-party image URLs may become unavailable.
- Minimum-version Python requirements do not freeze the full environment.
- GPU kernels and hardware can introduce small numerical differences.
- Browser Canvas preprocessing and PIL bicubic preprocessing are not identical.
- The browser smoke check uses generated local cases and needs manual inspection.
- No redistributable image fixture set is committed.
