"""
Is the DINOv2 signal real, or is it reading the seam between two corpora?

The feasibility probe put a DINOv2-small linear head at ~0.91 AUROC on the same
100 images where the shipped checkpoints scored 0.50. That number is only worth
anything if the head is looking at the image rather than at the fact that COCO
photographs are web JPEG at assorted sizes while ELSA renders are clean and
square.

This script runs the whole laundering suite through the backbone and re-fits the
probe on each. Two readings matter:

  normalize_512_q90   identical resolution and identical JPEG history for both
                      classes. If AUROC holds here, the separation is not
                      encoder history. If it collapses, it was.

  the rest            how much survives real-world handling. A detector that
                      only works on pristine images is not deployable.

Cross-validated on 100 images, so intervals are wide. This is a diagnostic that
decides whether to keep going, not a result.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from transformers import AutoImageProcessor, AutoModel

import laundering

RNG = np.random.default_rng(11)


def bootstrap_ci(y, p, n_boot=1000):
    pos, neg = np.flatnonzero(y == 1), np.flatnonzero(y == 0)
    vals = []
    for _ in range(n_boot):
        idx = np.concatenate([RNG.choice(pos, len(pos), True),
                              RNG.choice(neg, len(neg), True)])
        try:
            vals.append(roc_auc_score(y[idx], p[idx]))
        except ValueError:
            pass
    return [float(np.percentile(vals, 2.5)), float(np.percentile(vals, 97.5))]


@torch.no_grad()
def embed(images, processor, model, bs=16):
    cls, mean = [], []
    for i in range(0, len(images), bs):
        out = model(**processor(images=images[i:i + bs], return_tensors="pt"))
        h = out.last_hidden_state
        cls.append(h[:, 0, :].numpy())
        mean.append(h[:, 1:, :].mean(dim=1).numpy())
    return np.vstack(cls), np.vstack(mean)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eval-dir", type=Path,
                    default=Path("docs/benchmark/eval_set_v1"))
    ap.add_argument("--backbone", default="facebook/dinov2-small")
    ap.add_argument("--out", type=Path,
                    default=Path("docs/benchmark/confound_probe.json"))
    ap.add_argument("--threads", type=int, default=4)
    args = ap.parse_args()

    torch.set_num_threads(args.threads)
    manifest = json.loads((args.eval_dir / "manifest.json").read_text(encoding="utf-8"))
    rows = manifest["images"]
    y = np.array([r["label_int"] for r in rows])
    gens = np.array([r["generator"] or "" for r in rows])

    originals = [
        Image.open(args.eval_dir / ("real" if r["label"] == "real" else "ai") / r["file"]).convert("RGB")
        for r in rows
    ]

    processor = AutoImageProcessor.from_pretrained(args.backbone)
    model = AutoModel.from_pretrained(args.backbone)
    model.eval()

    cv = StratifiedKFold(5, shuffle=True, random_state=0)
    results = {
        "backbone": args.backbone,
        "n": len(rows),
        "method": ("5-fold CV logistic regression on frozen DINOv2 features; "
                   "diagnostic only, no generator holdout"),
        "v1_shipped_baseline_auroc": 0.5,
        "transforms": {},
    }

    for name in laundering.DEFAULT_SUITE:
        fn = laundering.TRANSFORMS[name]
        imgs = [fn(im) for im in originals]
        cls, mean = embed(imgs, processor, model)

        entry = {}
        for rep, X in (("cls", cls), ("mean", mean),
                       ("cls+mean", np.hstack([cls, mean]))):
            pipe = make_pipeline(StandardScaler(),
                                 LogisticRegression(max_iter=3000, C=1.0))
            p = cross_val_predict(pipe, X, y, cv=cv, method="predict_proba")[:, 1]
            auc = float(roc_auc_score(y, p))
            entry[rep] = {"auroc": round(auc, 4), "ci95": bootstrap_ci(y, p)}
            if rep == "mean":
                entry["per_generator"] = {
                    g.split("/")[-1]: round(float(
                        roc_auc_score(y[(y == 0) | (gens == g)],
                                      p[(y == 0) | (gens == g)])), 4)
                    for g in sorted(set(gens[y == 1]))
                }
        results["transforms"][name] = entry
        print("{:<20s} cls={:.3f}  mean={:.3f}  cls+mean={:.3f}".format(
            name, entry["cls"]["auroc"], entry["mean"]["auroc"],
            entry["cls+mean"]["auroc"]), flush=True)

    ident = results["transforms"]["identity"]["mean"]["auroc"]
    norm = results["transforms"]["normalize_512_q90"]["mean"]["auroc"]
    worst = min(v["mean"]["auroc"] for v in results["transforms"].values())

    results["verdict"] = {
        "identity_auroc": ident,
        "normalized_auroc": norm,
        "confound_delta": round(ident - norm, 4),
        "worst_laundered_auroc": worst,
        "reading": (
            "Signal survives the confound control; the separation is not encoder "
            "history or resolution."
            if norm > 0.75 else
            "Signal collapses once resolution and JPEG history are equalised: the "
            "probe was largely reading the seam between the two source corpora."),
    }
    args.out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("\nidentity {:.3f} -> normalized {:.3f} (delta {:.3f}); worst laundered {:.3f}".format(
        ident, norm, ident - norm, worst))
    print(results["verdict"]["reading"])
    print("Wrote {}".format(args.out))


if __name__ == "__main__":
    main()
