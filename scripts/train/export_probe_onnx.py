"""
Export the frozen-backbone linear probe as a single ONNX file.

Why this exists separately from export_onnx.py: the probe is trained by
scikit-learn on cached features, so there is no PyTorch checkpoint to export.
This script rebuilds the equivalent network in torch -- frozen DINOv2 trunk,
patch-mean pooling, one linear layer -- and transplants the fitted coefficients
into it.

Two things get folded into the linear layer so the exported graph needs no
preprocessing beyond ImageNet normalisation:

    StandardScaler   p = sigmoid(w . ((x - mu) / sigma) + b)
                       = sigmoid((w / sigma) . x + (b - sum(w * mu / sigma)))

    temperature      dividing the logit by T is the same as scaling w and b by
                     1/T, so the exported model emits calibrated logits directly

The transplant is verified against scikit-learn on real cached features before
anything is written, because a silent mismatch here would be precisely the class
of bug this project exists to have removed.

Usage:
    python scripts/train/export_probe_onnx.py
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

# torch.onnx logs progress with emoji, which crashes a Windows cp1252 console.
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

import numpy as np
import torch
import torch.nn as nn
from scipy.optimize import minimize_scalar
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from transformers import AutoModel

# Ops with no kernel in onnxruntime-web's WASM backend. A model containing any
# of these loads fine under Python onnxruntime and fails outright in the
# browser, which is how a broken build shipped once already.
WASM_UNSUPPORTED_OPS = {"ConvInteger"}


def assert_browser_compatible(path):
    """Fail loudly if the graph cannot run in the extension's runtime."""
    import onnx
    ops = {n.op_type for n in onnx.load(str(path)).graph.node}
    bad = ops & WASM_UNSUPPORTED_OPS
    if bad:
        raise SystemExit(
            "{} contains {}, which onnxruntime-web's WASM backend cannot "
            "execute. The model would load under Python and fail in the "
            "browser. Do not ship this file.".format(path.name, sorted(bad)))


IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
HELDOUT = "stabilityai/stable-diffusion-xl-base-1.0"


class ProbeDetector(nn.Module):
    """Frozen DINOv2 trunk, patch-mean pool, single linear layer to one logit."""

    def __init__(self, backbone="facebook/dinov2-small"):
        super().__init__()
        self.trunk = AutoModel.from_pretrained(backbone)
        for p in self.trunk.parameters():
            p.requires_grad_(False)
        self.head = nn.Linear(self.trunk.config.hidden_size, 1)

    def forward(self, pixel_values):
        h = self.trunk(pixel_values=pixel_values).last_hidden_state
        return self.head(h[:, 1:, :].mean(dim=1)).squeeze(-1)


def fit_temperature(logits, y):
    logits, y = np.asarray(logits, float), np.asarray(y, float)

    def nll(log_t):
        p = 1 / (1 + np.exp(-np.clip(logits / np.exp(log_t), -50, 50)))
        return -np.mean(y * np.log(p + 1e-12) + (1 - y) * np.log(1 - p + 1e-12))

    return float(np.exp(minimize_scalar(nll, bounds=(-3, 3), method="bounded").x))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--features", type=Path,
                    default=Path("docs/benchmark/corpus_v1/features"))
    ap.add_argument("--corpus", type=Path,
                    default=Path("docs/benchmark/matched_corpus_v1"))
    ap.add_argument("--backbone-key", default="dinov2-small")
    ap.add_argument("--backbone", default="facebook/dinov2-small")
    ap.add_argument("--out-dir", type=Path, default=Path("public/models"))
    ap.add_argument("--name", default="detector_v2_probe")
    ap.add_argument("--opset", type=int, default=17)
    ap.add_argument("--quantize", action="store_true")
    args = ap.parse_args()

    # --- refit exactly as train_matched_probe.py does -----------------------
    d = np.load(args.features / "{}_matched_corpus_v1.npz".format(args.backbone_key),
                allow_pickle=True)
    ok = d["ok"]
    X, y = d["mean"][ok], d["labels"][ok]
    gen, files = d["generators"][ok], d["files"][ok]

    manifest = json.loads((args.corpus / "manifest.json").read_text(encoding="utf-8"))
    pair_of = {r["file"]: r["pair_id"] for r in manifest["images"]}
    by_pair = defaultdict(list)
    for i, f in enumerate(files):
        by_pair[pair_of.get(f, -1)].append(i)

    heldout_pairs, pool = [], []
    for pid, idxs in by_pair.items():
        (heldout_pairs if HELDOUT in {gen[i] for i in idxs if gen[i]}
         else pool).append(pid)

    rng = np.random.default_rng(7)
    pool = np.array(pool)
    rng.shuffle(pool)
    n = len(pool)
    tr = np.array([i for pid in pool[:int(0.75 * n)] for i in by_pair[pid]])
    va = np.array([i for pid in pool[int(0.75 * n):int(0.875 * n)]
                   for i in by_pair[pid]])

    scaler = StandardScaler().fit(X[tr])
    clf = LogisticRegression(max_iter=5000, C=1.0).fit(scaler.transform(X[tr]), y[tr])
    temp = fit_temperature(clf.decision_function(scaler.transform(X[va])), y[va])
    print("refit: train {}  val {}  temperature {:.4f}".format(
        len(tr), len(va), temp))

    # --- fold scaler and temperature into one affine layer -----------------
    w = clf.coef_.reshape(-1) / scaler.scale_
    b = float(clf.intercept_[0]) - float(np.dot(clf.coef_.reshape(-1),
                                                scaler.mean_ / scaler.scale_))
    w, b = w / temp, b / temp

    model = ProbeDetector(args.backbone)
    with torch.no_grad():
        model.head.weight.copy_(torch.from_numpy(w.astype(np.float32)).view(1, -1))
        model.head.bias.copy_(torch.tensor([b], dtype=torch.float32))
    model.eval()

    # --- verify the transplant against sklearn on cached features ----------
    probe_idx = np.arange(len(X))[:256]
    sk_logit = (clf.decision_function(scaler.transform(X[probe_idx])) / temp)
    with torch.no_grad():
        head_logit = model.head(
            torch.from_numpy(X[probe_idx].astype(np.float32))).squeeze(-1).numpy()
    head_div = float(np.max(np.abs(sk_logit - head_logit)))
    print("max |sklearn - torch head| over 256 cached features: {:.3e}".format(
        head_div))
    if head_div > 1e-3:
        raise SystemExit("Head transplant diverges from sklearn; refusing to export.")

    # --- export -------------------------------------------------------------
    args.out_dir.mkdir(parents=True, exist_ok=True)
    fp32 = args.out_dir / "{}.onnx".format(args.name)
    dummy = torch.randn(1, 3, 224, 224)
    try:
        torch.onnx.export(
            model, (dummy,), str(fp32),
            input_names=["pixel_values"], output_names=["logits"],
            dynamic_axes={"pixel_values": {0: "batch_size"},
                          "logits": {0: "batch_size"}},
            opset_version=args.opset, do_constant_folding=True, dynamo=False)
        exporter = "torchscript"
    except (TypeError, RuntimeError) as exc:
        print("legacy exporter unavailable ({}); using dynamo".format(
            type(exc).__name__))
        torch.onnx.export(
            model, (dummy,), str(fp32),
            input_names=["pixel_values"], output_names=["logits"],
            dynamic_axes={"pixel_values": {0: "batch_size"},
                          "logits": {0: "batch_size"}},
            opset_version=args.opset, do_constant_folding=True)
        exporter = "dynamo"

    sidecar = Path(str(fp32) + ".data")
    if sidecar.exists():
        import onnx
        onnx.save_model(onnx.load(str(fp32)), str(fp32), save_as_external_data=False)
        sidecar.unlink(missing_ok=True)
        print("folded external weights into a single file")

    import onnxruntime as ort
    sess = ort.InferenceSession(str(fp32), providers=["CPUExecutionProvider"])
    inp, out = sess.get_inputs()[0], sess.get_outputs()[0]

    pix = torch.randn(4, 3, 224, 224)
    with torch.no_grad():
        t_out = model(pix).numpy().reshape(-1)
    o_out = np.asarray(sess.run([out.name], {inp.name: pix.numpy()})[0]).reshape(-1)
    max_div = float(np.max(np.abs(t_out - o_out)))
    print("exported {} ({:.1f} MB, {}); max |torch - onnx| {:.3e}".format(
        fp32.name, fp32.stat().st_size / 1e6, exporter, max_div))

    meta = {
        "name": args.name,
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "kind": "frozen DINOv2 backbone + linear probe (scaler and temperature folded in)",
        "backbone": args.backbone,
        "input_name": inp.name,
        "input_shape": [str(x) for x in inp.shape],
        "output_name": out.name,
        "output_shape": [str(x) for x in out.shape],
        "num_classes": 1,
        "output_kind": "single calibrated logit; P(AI) = sigmoid(logit)",
        "ai_class_index": 0,
        "ai_class_note": ("One logit trained with BCE against label 1 = generated, "
                          "so higher means more likely AI. A property of the "
                          "training objective, not an assumption."),
        "mean": IMAGENET_MEAN,
        "std": IMAGENET_STD,
        "input_size": 224,
        "pooling": "mean over patch tokens (excludes CLS)",
        "temperature_folded": round(temp, 4),
        "calibrated": True,
        "benchmark": "docs/benchmark/v2_matched_probe.json",
        "verification": {
            "max_abs_divergence_head_vs_sklearn": head_div,
            "max_abs_divergence_onnx_vs_torch": max_div,
            "tolerance": 1e-3,
            "passed": bool(head_div < 1e-3 and max_div < 1e-3),
        },
    }

    if args.quantize:
        try:
            from onnxruntime.quantization import quantize_dynamic, QuantType
            q = args.out_dir / "{}_int8.onnx".format(args.name)
            # Quantize MatMul only. Quantizing Conv emits ConvInteger, which
            # onnxruntime-web's WASM backend has no kernel for -- the model
            # loads fine under Python onnxruntime and then fails outright in the
            # browser with "Could not find an implementation for ConvInteger".
            # The patch-embedding Conv is ~225K parameters, so leaving it in
            # fp32 costs almost nothing in size. Verified by
            # scripts/verify/browser_check.html.
            quantize_dynamic(str(fp32), str(q), weight_type=QuantType.QInt8,
                             op_types_to_quantize=["MatMul"])
            assert_browser_compatible(q)
            qs = ort.InferenceSession(str(q), providers=["CPUExecutionProvider"])
            q_out = np.asarray(qs.run([qs.get_outputs()[0].name],
                                      {qs.get_inputs()[0].name: pix.numpy()})[0]
                               ).reshape(-1)
            # Bind the divergence once and reuse it. It was previously
            # recomputed inline here and then read back under a name that was
            # never assigned, so the guard below raised NameError, the broad
            # except swallowed it, and the metadata recorded the quantization
            # as failed while the int8 file sat on disk looking fine.
            q_div = float(np.max(np.abs(t_out - q_out)))
            meta["quantized"] = {
                "file": q.name,
                "size_mb": round(q.stat().st_size / 1e6, 2),
                "compression_vs_fp32": round(fp32.stat().st_size / q.stat().st_size, 2),
                "max_abs_divergence_vs_pytorch": q_div,
                "note": "Lossy. Score this file on the benchmark before shipping it.",
            }
            if q_div > 0.05:
                print("  QUANT_WARN: int8 diverges from fp32 by {:.3f} on probe "
                      "tensors. Score the int8 file with scripts/bench/"
                      "score_model.py before shipping it -- do not assume "
                      "quantization was free.".format(q_div))
            print("quantized {:.1f} MB ({:.1f}x smaller)".format(
                q.stat().st_size / 1e6, meta["quantized"]["compression_vs_fp32"]))
        except Exception as exc:
            print("quantization failed ({}); fp32 unaffected".format(
                type(exc).__name__))
            meta["quantized"] = {"failed": True, "error": str(exc)[:300]}

    meta_path = args.out_dir / "{}_meta.json".format(args.name)
    meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print("wrote {}".format(meta_path))
    if not meta["verification"]["passed"]:
        raise SystemExit("EXPORT VERIFICATION FAILED. Do not ship this file.")
    print("export verified")


if __name__ == "__main__":
    main()
