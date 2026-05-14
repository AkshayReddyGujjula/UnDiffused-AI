"""
Train the logistic regression fusion head on top of frozen global + local model outputs.

Workflow:
1. Run global and local models over your labeled dataset to collect feature vectors.
2. Fit a logistic regression on those features.
3. Apply temperature scaling on the validation set to calibrate probabilities.
4. Output fusion_v2.json for deployment.

Usage:
    python scripts/train_fusion.py \
        --global_onnx  models/model_global_quantized.onnx \
        --global_meta  models/model_global_meta.json \
        --local_onnx   models/model_local_quantized.onnx \
        --local_meta   models/model_local_meta.json \
        --data_dir     /path/to/dataset \
        --output       models/fusion_v2.json
"""

import argparse
import json
import os
from pathlib import Path

import numpy as np


GATE_HIGH = 0.85


def softmax(logits):
    e = np.exp(logits - logits.max())
    return e / e.sum()


def extract_features_from_probs(global_prob: float, local_scores: list) -> list:
    """Build the same feature vector that fusion.ts uses at runtime."""
    if not local_scores:
        local_scores = [global_prob]
    sorted_scores = sorted(local_scores, reverse=True)
    n = len(sorted_scores)
    top_k = lambda k: np.mean(sorted_scores[:min(k, n)])
    mean = np.mean(local_scores)
    variance = float(np.var(local_scores)) if n > 1 else 0.0
    frac_above = sum(1 for s in local_scores if s > GATE_HIGH) / n
    return [global_prob, top_k(1), top_k(3), top_k(5), variance, frac_above]


def run_onnx_model(session, image_path: str, meta: dict) -> float:
    """Run a single image through an ONNX session and return AI probability."""
    try:
        from PIL import Image
    except ImportError:
        raise SystemExit("Install Pillow: pip install Pillow")

    mean = np.array(meta["normalization"]["mean"], dtype=np.float32)
    std  = np.array(meta["normalization"]["std"],  dtype=np.float32)
    size = meta["input_size"]

    img = Image.open(image_path).convert("RGB").resize((size, size))
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = (arr - mean) / std
    arr = arr.transpose(2, 0, 1)[np.newaxis]  # NCHW

    feeds = {meta["input_name"]: arr}
    out = session.run([meta["output_name"]], feeds)[0][0]  # shape [num_classes]
    probs = softmax(out)
    return float(probs[meta["ai_class_index"]])


def collect_features(data_dir: str, global_session, global_meta, local_session, local_meta):
    """Walk data_dir/real and data_dir/ai, return (X, y) arrays."""
    import onnxruntime as ort

    X, y = [], []
    for label_name, label_val in [("real", 0), ("ai", 1)]:
        label_dir = Path(data_dir) / label_name
        if not label_dir.exists():
            print(f"Warning: {label_dir} not found, skipping")
            continue
        files = [f for f in label_dir.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png"}]
        print(f"Processing {len(files)} {label_name} images...")
        for img_path in files:
            try:
                global_prob = run_onnx_model(global_session, str(img_path), global_meta)
                local_prob  = run_onnx_model(local_session, str(img_path), local_meta)
                features = extract_features_from_probs(global_prob, [local_prob])
                X.append(features)
                y.append(label_val)
            except Exception as e:
                print(f"  Skipping {img_path.name}: {e}")

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.int32)


def temperature_scale(val_probs: np.ndarray, val_labels: np.ndarray) -> float:
    """Find temperature T that minimises NLL on validation set via grid search."""
    from scipy.special import expit as sigmoid
    from scipy.optimize import minimize_scalar

    logits = np.log(np.clip(val_probs, 1e-7, 1 - 1e-7)) - np.log(np.clip(1 - val_probs, 1e-7, 1 - 1e-7))

    def nll(T):
        scaled = sigmoid(logits / T)
        return -np.mean(val_labels * np.log(scaled + 1e-9) + (1 - val_labels) * np.log(1 - scaled + 1e-9))

    result = minimize_scalar(nll, bounds=(0.1, 10.0), method="bounded")
    return float(result.x)


def main():
    parser = argparse.ArgumentParser(description="Train fusion head")
    parser.add_argument("--global_onnx", required=True)
    parser.add_argument("--global_meta", required=True)
    parser.add_argument("--local_onnx",  required=True)
    parser.add_argument("--local_meta",  required=True)
    parser.add_argument("--data_dir",    required=True)
    parser.add_argument("--output",      default="models/fusion_v2.json")
    args = parser.parse_args()

    try:
        import onnxruntime as ort
        from sklearn.linear_model import LogisticRegression
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import roc_auc_score
    except ImportError:
        raise SystemExit("Install dependencies: pip install onnxruntime scikit-learn")

    with open(args.global_meta) as f:
        global_meta = json.load(f)
    with open(args.local_meta) as f:
        local_meta = json.load(f)

    global_session = ort.InferenceSession(args.global_onnx, providers=["CPUExecutionProvider"])
    local_session  = ort.InferenceSession(args.local_onnx,  providers=["CPUExecutionProvider"])

    X, y = collect_features(args.data_dir, global_session, global_meta, local_session, local_meta)
    if len(X) == 0:
        raise SystemExit("No samples collected. Check --data_dir layout (data_dir/real/, data_dir/ai/)")

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    clf = LogisticRegression(max_iter=500, C=1.0)
    clf.fit(X_train, y_train)

    val_probs = clf.predict_proba(X_val)[:, 1]
    auroc = roc_auc_score(y_val, val_probs)
    print(f"Validation AUROC: {auroc:.4f}")

    temperature = temperature_scale(val_probs, y_val)
    print(f"Calibration temperature: {temperature:.4f}")

    # Optimal threshold: maximise F1 on validation
    thresholds = np.linspace(0.1, 0.9, 81)
    best_f1, best_thresh = 0.0, 0.5
    for t in thresholds:
        preds = (val_probs >= t).astype(int)
        tp = ((preds == 1) & (y_val == 1)).sum()
        fp = ((preds == 1) & (y_val == 0)).sum()
        fn = ((preds == 0) & (y_val == 1)).sum()
        f1 = (2 * tp) / (2 * tp + fp + fn + 1e-9)
        if f1 > best_f1:
            best_f1, best_thresh = f1, t
    print(f"Best F1={best_f1:.4f} at threshold={best_thresh:.2f}")

    feature_names = ["globalAiProb", "localTop1Mean", "localTop3Mean", "localTop5Mean", "localVariance", "localFracAboveHigh"]
    fusion_config = {
        "version": "2.0",
        "type": "logistic_regression",
        "features": feature_names,
        "weights": clf.coef_[0].tolist(),
        "bias": float(clf.intercept_[0]),
        "temperature": temperature,
        "threshold": float(best_thresh),
    }

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w") as f:
        json.dump(fusion_config, f, indent=2)
    print(f"Fusion config saved: {args.output}")


if __name__ == "__main__":
    main()
