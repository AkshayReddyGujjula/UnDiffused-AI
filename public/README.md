# Runtime assets

Everything in this directory is copied into the extension build.

## Shipped model

- `models/detector_v2_finetuned_int8.onnx` is the 24.9 MB detector loaded by
  `src/content/inference/pipeline.ts`.
- `models/detector_v2_finetuned_meta.json` records its generated tensor and
  preprocessing contract.

The full precision ONNX export is a regenerable intermediate and is deliberately
excluded. To reproduce, export, calibrate, score, and verify the model, follow
`docs/TRAINING_GUIDE.md`.

## Browser runtime

The four files under `wasm/` are ONNX Runtime Web builds selected by the runtime
according to browser SIMD and threading support. They are stored in Git LFS.

Do not replace a model solely because it runs in Python. Before changing the
runtime artifact, require all of the following:

1. Export verification against PyTorch.
2. Scoring of the exact int8 file on the external matched control.
3. Calibration and abstention thresholds fitted for that model.
4. `BROWSER_CHECK_PASS` from `scripts/verify/browser_check.html`.

The tensor names, shape, class meaning, preprocessing values, temperature, and
abstention band must continue to match `src/content/inference/contract.ts`.
