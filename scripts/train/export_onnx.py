"""
Export the trained detector to ONNX and write a metadata contract beside it.

Two things this does that the shipped v1 models did not.

**It writes the metadata from the exported model, not by hand.** The V2 branch
generated a `model_global_meta.json` that declared input `"input"` and output
`"output"` when the actual tensors were `pixel_values` and `logits`, and set
`ai_class_index: 1` as a fresh guess. Every value here is read back off the
exported graph, and the class index is a fact about how the head was trained.

**It verifies the export.** Quantization and graph conversion are lossy, so the
ONNX output is compared against PyTorch on real tensors and the maximum
divergence is recorded. An export that silently changed behaviour would
reintroduce exactly the class of bug this project exists to have removed.

Usage:
    python scripts/train/export_onnx.py --checkpoint models/v2/detector_best.pt
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import torch

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from finetune_gpu import Detector, IMAGENET_MEAN, IMAGENET_STD  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--checkpoint", type=Path,
                    default=Path("models/v2/detector_best.pt"))
    ap.add_argument("--out-dir", type=Path, default=Path("public/models"))
    ap.add_argument("--name", default="detector_v2")
    ap.add_argument("--opset", type=int, default=17)
    ap.add_argument("--quantize", action="store_true",
                    help="also emit a dynamic int8 build and measure the cost")
    args = ap.parse_args()

    ckpt = torch.load(args.checkpoint, map_location="cpu")
    saved = ckpt.get("args", {})
    backbone = saved.get("backbone", "facebook/dinov2-small")

    model = Detector(backbone, saved.get("unfreeze_last", 4))
    model.load_state_dict(ckpt["model"])
    model.eval()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    fp32_path = args.out_dir / "{}.onnx".format(args.name)

    dummy = torch.randn(1, 3, 224, 224)
    torch.onnx.export(
        model, (dummy,), str(fp32_path),
        input_names=["pixel_values"], output_names=["logits"],
        dynamic_axes={"pixel_values": {0: "batch_size"},
                      "logits": {0: "batch_size"}},
        opset_version=args.opset, do_constant_folding=True,
    )
    print("exported {} ({:.1f} MB)".format(
        fp32_path.name, fp32_path.stat().st_size / 1e6))

    import onnxruntime as ort
    sess = ort.InferenceSession(str(fp32_path), providers=["CPUExecutionProvider"])
    inp, out = sess.get_inputs()[0], sess.get_outputs()[0]

    # Verify against PyTorch on real tensors rather than trusting the export.
    probe = torch.randn(8, 3, 224, 224)
    with torch.no_grad():
        torch_out = model(probe).numpy().reshape(-1)
    onnx_out = np.asarray(
        sess.run([out.name], {inp.name: probe.numpy()})[0]).reshape(-1)
    max_div = float(np.max(np.abs(torch_out - onnx_out)))
    print("max |torch - onnx| over 8 samples: {:.3e}".format(max_div))

    meta = {
        "name": args.name,
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "source_checkpoint": str(args.checkpoint).replace("\\", "/"),
        "backbone": backbone,
        "trained_val_auroc": ckpt.get("val_auroc"),
        # Read off the graph, never written by hand.
        "input_name": inp.name,
        "input_shape": [str(d) for d in inp.shape],
        "output_name": out.name,
        "output_shape": [str(d) for d in out.shape],
        "num_classes": 1,
        "output_kind": "single logit; P(AI) = sigmoid(logit)",
        "ai_class_index": 0,
        "ai_class_note": ("The head emits one logit trained with BCE against "
                          "label 1 = generated, so a higher logit means more "
                          "likely AI. This is a property of the training "
                          "objective, not an assumption."),
        "mean": IMAGENET_MEAN,
        "std": IMAGENET_STD,
        "input_size": 224,
        "pooling": "mean over patch tokens (excludes CLS)",
        "export_verification": {
            "max_abs_divergence_vs_pytorch": max_div,
            "tolerance": 1e-3,
            "passed": bool(max_div < 1e-3),
        },
    }

    if args.quantize:
        from onnxruntime.quantization import quantize_dynamic, QuantType
        q_path = args.out_dir / "{}_int8.onnx".format(args.name)
        quantize_dynamic(str(fp32_path), str(q_path), weight_type=QuantType.QInt8)
        q_sess = ort.InferenceSession(str(q_path),
                                      providers=["CPUExecutionProvider"])
        q_out = np.asarray(q_sess.run(
            [q_sess.get_outputs()[0].name],
            {q_sess.get_inputs()[0].name: probe.numpy()})[0]).reshape(-1)
        q_div = float(np.max(np.abs(torch_out - q_out)))
        meta["quantized"] = {
            "file": q_path.name,
            "size_mb": round(q_path.stat().st_size / 1e6, 2),
            "compression_vs_fp32": round(
                fp32_path.stat().st_size / q_path.stat().st_size, 2),
            "max_abs_divergence_vs_pytorch": q_div,
            "note": ("Quantization is lossy and is therefore measured rather "
                     "than assumed. Score this file on the benchmark before "
                     "shipping it."),
        }
        print("quantized: {:.1f} MB ({:.1f}x smaller), max divergence {:.3e}".format(
            q_path.stat().st_size / 1e6, meta["quantized"]["compression_vs_fp32"],
            q_div))

    meta_path = args.out_dir / "{}_meta.json".format(args.name)
    meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print("wrote {}".format(meta_path))

    if not meta["export_verification"]["passed"]:
        raise SystemExit(
            "EXPORT VERIFICATION FAILED: ONNX diverges from PyTorch by "
            "{:.3e}. Do not ship this file.".format(max_div))
    print("export verified")


if __name__ == "__main__":
    main()
