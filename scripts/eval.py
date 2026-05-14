"""
Evaluate a trained detector on a labeled image directory and output a benchmark report.

Usage:
    python scripts/eval.py \
        --global_onnx  models/model_global_quantized.onnx \
        --global_meta  models/model_global_meta.json \
        --local_onnx   models/model_local_quantized.onnx \
        --local_meta   models/model_local_meta.json \
        --fusion_cfg   models/fusion_v2.json \
        --data_dir     /path/to/test_set \
        --output       benchmarks/v2_candidate.json

Dataset layout:
    data_dir/real/   (label 0)
    data_dir/ai/     (label 1)

Outputs: AUROC, F1 @ threshold, FPR@95TPR, ECE, confusion matrix.
"""

import argparse
import json
import time
from pathlib import Path

import numpy as np


def softmax(logits):
    e = np.exp(logits - logits.max())
    return e / e.sum()


def sigmoid(x):
    return 1 / (1 + np.exp(-x))


def run_model(session, meta, image_path):
    try:
        from PIL import Image
    except ImportError:
        raise SystemExit("pip install Pillow")

    mean = np.array(meta["normalization"]["mean"], dtype=np.float32)
    std  = np.array(meta["normalization"]["std"],  dtype=np.float32)
    size = meta["input_size"]
    img = Image.open(image_path).convert("RGB").resize((size, size))
    arr = (np.array(img, dtype=np.float32) / 255.0 - mean) / std
    arr = arr.transpose(2, 0, 1)[np.newaxis]
    out = session.run([meta["output_name"]], {meta["input_name"]: arr})[0][0]
    probs = softmax(out)
    return float(probs[meta["ai_class_index"]])


def fuse(global_prob, local_prob, fusion_cfg):
    scores = [local_prob]
    top_k = lambda k: np.mean(scores[:min(k, len(scores))])
    features = [
        global_prob,
        top_k(1), top_k(3), top_k(5),
        0.0,  # variance (single score)
        1.0 if local_prob > 0.85 else 0.0,
    ]
    dot = sum(w * v for w, v in zip(fusion_cfg["weights"], features))
    logit = (dot + fusion_cfg["bias"]) / fusion_cfg["temperature"]
    return sigmoid(logit)


def compute_ece(probs, labels, n_bins=10):
    """Expected Calibration Error."""
    bins = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    for lo, hi in zip(bins[:-1], bins[1:]):
        mask = (probs >= lo) & (probs < hi)
        if mask.sum() == 0:
            continue
        acc = labels[mask].mean()
        conf = probs[mask].mean()
        ece += mask.mean() * abs(acc - conf)
    return float(ece)


def fpr_at_tpr(probs, labels, tpr_target=0.95):
    thresholds = np.sort(np.unique(probs))[::-1]
    for t in thresholds:
        preds = (probs >= t).astype(int)
        tp = ((preds == 1) & (labels == 1)).sum()
        fn = ((preds == 0) & (labels == 1)).sum()
        fp = ((preds == 1) & (labels == 0)).sum()
        tn = ((preds == 0) & (labels == 0)).sum()
        tpr = tp / (tp + fn + 1e-9)
        if tpr >= tpr_target:
            fpr = fp / (fp + tn + 1e-9)
            return float(fpr), float(t)
    return 1.0, 0.0


def main():
    parser = argparse.ArgumentParser(description="Benchmark AI-image detector")
    parser.add_argument("--global_onnx", required=True)
    parser.add_argument("--global_meta", required=True)
    parser.add_argument("--local_onnx",  required=True)
    parser.add_argument("--local_meta",  required=True)
    parser.add_argument("--fusion_cfg",  required=True)
    parser.add_argument("--data_dir",    required=True)
    parser.add_argument("--output",      default="benchmarks/v2_candidate.json")
    parser.add_argument("--threshold",   type=float, default=None, help="Override fusion threshold")
    args = parser.parse_args()

    try:
        import onnxruntime as ort
        from sklearn.metrics import roc_auc_score, f1_score
    except ImportError:
        raise SystemExit("pip install onnxruntime scikit-learn")

    with open(args.global_meta) as f:
        global_meta = json.load(f)
    with open(args.local_meta) as f:
        local_meta = json.load(f)
    with open(args.fusion_cfg) as f:
        fusion_cfg = json.load(f)

    threshold = args.threshold if args.threshold is not None else fusion_cfg["threshold"]

    global_session = ort.InferenceSession(args.global_onnx, providers=["CPUExecutionProvider"])
    local_session  = ort.InferenceSession(args.local_onnx,  providers=["CPUExecutionProvider"])

    all_probs, all_labels, latencies = [], [], []
    for label_name, label_val in [("real", 0), ("ai", 1)]:
        label_dir = Path(args.data_dir) / label_name
        if not label_dir.exists():
            print(f"Warning: {label_dir} not found, skipping")
            continue
        files = [f for f in label_dir.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png"}]
        print(f"Evaluating {len(files)} {label_name} images...")
        for img_path in files:
            try:
                t0 = time.perf_counter()
                gp = run_model(global_session, global_meta, img_path)
                lp = run_model(local_session,  local_meta,  img_path)
                score = fuse(gp, lp, fusion_cfg)
                latencies.append(time.perf_counter() - t0)
                all_probs.append(score)
                all_labels.append(label_val)
            except Exception as e:
                print(f"  Skipping {img_path.name}: {e}")

    probs  = np.array(all_probs)
    labels = np.array(all_labels)
    preds  = (probs >= threshold).astype(int)

    auroc = float(roc_auc_score(labels, probs))
    f1    = float(f1_score(labels, preds))
    ece   = compute_ece(probs, labels)
    fpr95, fpr95_thresh = fpr_at_tpr(probs, labels, tpr_target=0.95)

    tp = int(((preds == 1) & (labels == 1)).sum())
    fp = int(((preds == 1) & (labels == 0)).sum())
    tn = int(((preds == 0) & (labels == 0)).sum())
    fn = int(((preds == 0) & (labels == 1)).sum())

    report = {
        "auroc": auroc,
        "f1_at_threshold": f1,
        "threshold": threshold,
        "ece": ece,
        "fpr_at_95tpr": fpr95,
        "fpr_at_95tpr_threshold": fpr95_thresh,
        "confusion_matrix": {"tp": tp, "fp": fp, "tn": tn, "fn": fn},
        "latency_p50_ms": float(np.percentile(latencies, 50) * 1000) if latencies else None,
        "latency_p90_ms": float(np.percentile(latencies, 90) * 1000) if latencies else None,
        "n_samples": len(labels),
    }

    print("\n── Benchmark Results ──")
    for k, v in report.items():
        print(f"  {k}: {v}")

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\nReport saved: {args.output}")


if __name__ == "__main__":
    main()
