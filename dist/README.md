# Public Assets

This directory contains:
- `models/model_quantized.onnx` - The extension model currently loaded at runtime
- Extension icons

## Generating the Model

Model/tooling scripts live under `scripts/`. Ensure exported ONNX input/output names and class mapping match extension runtime expectations before replacing the bundled model.

Run the training script:

```bash
C:\venv\undiff\Scripts\python.exe scripts/train.py
```

For quick testing with a subset of data:
```bash
C:\venv\undiff\Scripts\python.exe scripts/train.py --test
```
