"""
Score an exported ONNX detector on the benchmark, under laundering.

Produces the number that belongs in the write-up. Deliberately separate from
training: the training script reports its own validation figures, and a model
that is only ever scored by the code that trained it is a model nobody has
checked.

Every model is scored on both evaluation sets, because the gap between them is
the finding:

    eval_set_v1          COCO photographs vs ELSA renders. Content differs
                         between the classes, so a shortcut is available. This
                         is the set the v1 shipped checkpoints scored 0.50 on.

    matched_control_v1   LAION originals vs renders made from those images' own
                         captions. Content is held constant, so only generation
                         separates the classes. This is the honest number.

A model scoring far higher on the first than the second has learned to tell the
two corpora apart rather than to detect generation. Reporting only the first
would be reporting a result that does not exist.

Usage:
    python scripts/bench/score_model.py \
        --model public/models/detector_v2.onnx \
        --meta  public/models/detector_v2_meta.json
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
from sklearn.metrics import roc_auc_score

import laundering

RNG = np.random.default_rng(4242)


def bootstrap_ci(y, p, n_boot=2000):
    pos, neg = np.flatnonzero(y == 1), np.flatnonzero(y == 0)
    if not len(pos) or not len(neg):
        return [None, None]
    vals = []
    for _ in range(n_boot):
        idx = np.concatenate([RNG.choice(pos, len(pos), True),
                              RNG.choice(neg, len(neg), True)])
        try:
            vals.append(roc_auc_score(y[idx], p[idx]))
        except ValueError:
            pass
    return ([round(float(np.percentile(vals, 2.5)), 4),
             round(float(np.percentile(vals, 97.5)), 4)] if vals else [None, None])


def ece(y, p, n_bins=10):
    conf = np.where(p >= 0.5, p, 1 - p)
    correct = ((p >= 0.5).astype(int) == y).astype(float)
    edges = np.linspace(0.5, 1.0, n_bins + 1)
    total = 0.0
    for lo, hi in zip(edges[:-1], edges[1:]):
        m = (conf >= lo) & (conf <= hi)
        if m.sum():
            total += (m.sum() / len(y)) * abs(correct[m].mean() - conf[m].mean())
    return round(float(total), 4)


def fpr_at_95tpr(y, p):
    pos, neg = p[y == 1], p[y == 0]
    if not len(pos) or not len(neg):
        return None
    return round(float((neg >= np.quantile(pos, 0.05)).mean()), 4)


def preprocess(img, meta):
    size = meta.get("input_size", 224)
    mean = np.array(meta.get("mean", [0.485, 0.456, 0.406]), dtype=np.float32)
    std = np.array(meta.get("std", [0.229, 0.224, 0.225]), dtype=np.float32)
    arr = np.asarray(img.convert("RGB").resize((size, size), Image.BICUBIC),
                     dtype=np.float32) / 255.0
    return np.transpose((arr - mean) / std, (2, 0, 1))


def ai_probability(logits, meta):
    """Map raw output to P(AI) using the metadata contract, never a guess."""
    logits = np.asarray(logits, dtype=np.float64)
    if logits.ndim == 1:
        logits = logits[:, None]
    n_classes = logits.shape[1]

    if n_classes == 1:
        return 1.0 / (1.0 + np.exp(-logits[:, 0]))

    idx = meta.get("ai_class_index")
    if idx is None:
        raise SystemExit(
            "Model has {} classes but metadata does not say which one is AI. "
            "Refusing to guess.".format(n_classes))
    e = np.exp(logits - logits.max(axis=1, keepdims=True))
    return (e / e.sum(axis=1, keepdims=True))[:, idx]


def score_set(sess, io, meta, eval_dir: Path, transforms, batch=16):
    manifest = json.loads((eval_dir / "manifest.json").read_text(encoding="utf-8"))
    rows = manifest["images"]
    y = np.array([r["label_int"] for r in rows])
    gens = np.array([r["generator"] or "" for r in rows])
    originals = [Image.open(eval_dir / ("real" if r["label"] == "real" else "ai")
                            / r["file"]).convert("RGB") for r in rows]

    out = {}
    for name in transforms:
        fn = laundering.TRANSFORMS[name]
        logits = []
        for i in range(0, len(originals), batch):
            chunk = [preprocess(fn(im), meta) for im in originals[i:i + batch]]
            arr = np.stack(chunk).astype(np.float32)
            logits.append(np.asarray(sess.run([io[1]], {io[0]: arr})[0]))
        p = ai_probability(np.concatenate(logits), meta)

        entry = {
            "auroc": round(float(roc_auc_score(y, p)), 4),
            "ci95": bootstrap_ci(y, p),
            "accuracy": round(float(((p >= 0.5).astype(int) == y).mean()), 4),
            "fpr_at_95tpr": fpr_at_95tpr(y, p),
            "ece": ece(y, p),
        }
        if name == "identity":
            entry["per_generator"] = {
                g.split("/")[-1]: round(float(roc_auc_score(
                    y[(y == 0) | (gens == g)], p[(y == 0) | (gens == g)])), 4)
                for g in sorted(set(gens[y == 1])) if g
            }
        out[name] = entry
        print("    {:<20s} AUROC {:.4f}  acc {:.3f}  ECE {:.3f}".format(
            name, entry["auroc"], entry["accuracy"], entry["ece"]), flush=True)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", type=Path, required=True)
    ap.add_argument("--meta", type=Path, required=True)
    ap.add_argument("--eval-sets", nargs="+", default=[
        "docs/benchmark/eval_set_v1", "docs/benchmark/matched_control_v1"])
    ap.add_argument("--transforms", nargs="+", default=laundering.DEFAULT_SUITE)
    ap.add_argument("--out", type=Path,
                    default=Path("docs/benchmark/v2_results.json"))
    args = ap.parse_args()

    meta = json.loads(args.meta.read_text(encoding="utf-8"))
    sess = ort.InferenceSession(str(args.model), providers=["CPUExecutionProvider"])
    io = (sess.get_inputs()[0].name, sess.get_outputs()[0].name)

    # Assert the metadata matches the graph before trusting either.
    if io[0] != meta.get("input_name") or io[1] != meta.get("output_name"):
        raise SystemExit(
            "Metadata/graph mismatch: graph has ({}, {}), metadata declares "
            "({}, {}).".format(io[0], io[1], meta.get("input_name"),
                               meta.get("output_name")))

    results = {
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "model": str(args.model).replace("\\", "/"),
        "model_size_mb": round(args.model.stat().st_size / 1e6, 2),
        "metadata": meta,
        "v1_shipped_baseline_auroc": 0.5,
        "eval_sets": {},
    }

    for d in args.eval_sets:
        p = Path(d)
        if not (p / "manifest.json").exists():
            print("  skipping {} (no manifest)".format(d))
            continue
        print("  {}".format(p.name))
        results["eval_sets"][p.name] = score_set(sess, io, meta, p, args.transforms)

    mc = results["eval_sets"].get("matched_control_v1", {}).get("identity", {})
    ev = results["eval_sets"].get("eval_set_v1", {}).get("identity", {})
    if mc and ev:
        gap = round(ev["auroc"] - mc["auroc"], 4)
        results["headline"] = {
            "honest_auroc_content_matched": mc["auroc"],
            "unmatched_auroc": ev["auroc"],
            "shortcut_gap": gap,
            "reading": (
                "Large gap: the model is separating corpora more than detecting "
                "generation. Report the content-matched figure."
                if gap > 0.10 else
                "Small gap: the model behaves consistently whether or not content "
                "is matched, so the score reflects detection."),
            "vs_v1_shipped": round(mc["auroc"] - 0.5, 4),
        }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("\n" + "=" * 62)
    if "headline" in results:
        h = results["headline"]
        print("  honest (content-matched) AUROC : {:.4f}".format(
            h["honest_auroc_content_matched"]))
        print("  unmatched AUROC                : {:.4f}".format(h["unmatched_auroc"]))
        print("  shortcut gap                   : {:.4f}".format(h["shortcut_gap"]))
        print("  improvement over v1 (0.500)    : +{:.4f}".format(h["vs_v1_shipped"]))
        print("  " + h["reading"])
    print("Wrote {}".format(args.out))


if __name__ == "__main__":
    main()
