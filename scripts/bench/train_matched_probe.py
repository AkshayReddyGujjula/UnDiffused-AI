"""
The honest headline: a linear probe trained on content-matched pairs.

This is the CPU counterpart to scripts/train/finetune_gpu.py. It trains only the
head on frozen DINOv2 features, so it runs in seconds once features are cached,
and it establishes the number the GPU fine-tune has to beat. Shipping a
fine-tuned model without this comparison would leave you unable to say whether
fine-tuning bought anything.

Splitting has two safeguards, both of which the earlier corpus lacked:

1. **Split by pair_id.** A real image and the render generated from its own
   caption always land on the same side. Otherwise the content of a test image
   is present in training under the other label, which leaks.

2. **Hold out a generator family entirely.** SDXL never appears in train or val,
   so cross-generator transfer is measured rather than assumed.

The model is also scored on eval_set_v1 (COCO vs ELSA, where content differs
between classes). The gap between that and the matched score is the size of the
shortcut, and it is reported rather than hidden.
"""
from __future__ import annotations

import argparse
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from scipy.optimize import minimize_scalar
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

RNG = np.random.default_rng(20260903)
HELDOUT = "stabilityai/stable-diffusion-xl-base-1.0"


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
    tot = 0.0
    for lo, hi in zip(edges[:-1], edges[1:]):
        m = (conf >= lo) & (conf <= hi)
        if m.sum():
            tot += (m.sum() / len(y)) * abs(correct[m].mean() - conf[m].mean())
    return round(float(tot), 4)


def fpr_at_95tpr(y, p):
    pos, neg = p[y == 1], p[y == 0]
    if not len(pos) or not len(neg):
        return None
    return round(float((neg >= np.quantile(pos, 0.05)).mean()), 4)


def summarize(y, p):
    y = np.asarray(y)
    if len(np.unique(y)) < 2:
        return {"n": int(len(y)), "note": "single-class split"}
    return {
        "n": int(len(y)), "n_ai": int((y == 1).sum()),
        "auroc": round(float(roc_auc_score(y, p)), 4),
        "ci95": bootstrap_ci(y, p),
        "accuracy": round(float(((p >= 0.5).astype(int) == y).mean()), 4),
        "fpr_at_95tpr": fpr_at_95tpr(y, p),
        "ece": ece(y, p),
    }


def fit_temperature(logits, y):
    logits, y = np.asarray(logits, float), np.asarray(y, float)

    def nll(log_t):
        p = 1 / (1 + np.exp(-np.clip(logits / np.exp(log_t), -50, 50)))
        return -np.mean(y * np.log(p + 1e-12) + (1 - y) * np.log(1 - p + 1e-12))

    return float(np.exp(minimize_scalar(nll, bounds=(-3, 3),
                                        method="bounded").x))


def choose_band(y, p, target_fpr=0.05, max_abstain=0.25):
    y, p = np.asarray(y), np.asarray(p)
    reals, ais = p[y == 0], p[y == 1]
    if not len(reals) or not len(ais):
        return None
    best = None
    for high in np.quantile(reals, np.linspace(0.80, 0.999, 50)):
        for low in np.quantile(ais, np.linspace(0.001, 0.20, 50)):
            if low >= high:
                continue
            decided = (p < low) | (p > high)
            abstain = 1 - decided.mean()
            if abstain > max_abstain:
                continue
            dr, da = (y == 0) & decided, (y == 1) & decided
            if not dr.sum() or not da.sum():
                continue
            fpr = float((p[dr] > high).mean())
            if fpr > target_fpr:
                continue
            tpr = float((p[da] > high).mean())
            score = tpr - 0.5 * abstain
            if best is None or score > best["_s"]:
                best = {"_s": score, "low": round(float(low), 4),
                        "high": round(float(high), 4),
                        "abstain_rate": round(float(abstain), 4),
                        "fpr": round(fpr, 4), "tpr": round(tpr, 4)}
    if best:
        best.pop("_s")
    return best


def load_npz(path: Path, rep: str):
    if not path.exists():
        return None
    d = np.load(path, allow_pickle=True)
    X = np.hstack([d["cls"], d["mean"]]) if rep == "cls+mean" else d[rep]
    ok = d["ok"]
    return {"X": X[ok], "y": d["labels"][ok], "gen": d["generators"][ok],
            "files": d["files"][ok]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--features", type=Path,
                    default=Path("docs/benchmark/corpus_v1/features"))
    ap.add_argument("--backbone", default="dinov2-small")
    ap.add_argument("--corpus", type=Path,
                    default=Path("docs/benchmark/matched_corpus_v1"))
    ap.add_argument("--rep", default="mean", choices=["cls", "mean", "cls+mean"])
    ap.add_argument("--out", type=Path,
                    default=Path("docs/benchmark/v2_matched_probe.json"))
    args = ap.parse_args()

    feats = load_npz(
        args.features / "{}_matched_corpus_v1.npz".format(args.backbone), args.rep)
    if feats is None:
        raise SystemExit("Matched-corpus features not found. Run extract_features.py.")

    manifest = json.loads((args.corpus / "manifest.json").read_text(encoding="utf-8"))
    pair_of = {r["file"]: r["pair_id"] for r in manifest["images"]}
    pair_ids = np.array([pair_of.get(f, -1) for f in feats["files"]])

    # Group pair ids, then route SDXL pairs entirely to the holdout split.
    by_pair = defaultdict(list)
    for i, pid in enumerate(pair_ids):
        by_pair[pid].append(i)

    heldout_pairs, pool = [], []
    for pid, idxs in by_pair.items():
        gens = {feats["gen"][i] for i in idxs if feats["gen"][i]}
        (heldout_pairs if HELDOUT in gens else pool).append(pid)

    rng = np.random.default_rng(7)
    pool = np.array(pool)
    rng.shuffle(pool)
    n = len(pool)
    splits = {
        "train": pool[:int(0.75 * n)],
        "val": pool[int(0.75 * n):int(0.875 * n)],
        "test": pool[int(0.875 * n):],
        "test_heldout_SDXL": np.array(heldout_pairs),
    }

    def gather(pids):
        idx = np.array([i for pid in pids for i in by_pair[pid]], dtype=int)
        return {"X": feats["X"][idx], "y": feats["y"][idx],
                "gen": feats["gen"][idx]}

    data = {k: gather(v) for k, v in splits.items()}
    for k, v in data.items():
        print("  {:<18s} {:>5d}  ({} ai / {} real)".format(
            k, len(v["y"]), int((v["y"] == 1).sum()), int((v["y"] == 0).sum())))

    # The holdout split is SDXL-only and has no negatives, so borrow the real
    # images from the test split -- also unseen -- to make AUROC defined.
    if len(np.unique(data["test_heldout_SDXL"]["y"])) < 2:
        rm = data["test"]["y"] == 0
        for key in ("X", "y", "gen"):
            data["test_heldout_SDXL"][key] = np.concatenate(
                [data["test"][key][rm], data["test_heldout_SDXL"][key]])

    pipe = make_pipeline(StandardScaler(),
                         LogisticRegression(max_iter=5000, C=1.0))
    pipe.fit(data["train"]["X"], data["train"]["y"])

    temp = fit_temperature(pipe.decision_function(data["val"]["X"]),
                           data["val"]["y"])

    def prob(X):
        return 1 / (1 + np.exp(-np.clip(pipe.decision_function(X) / temp, -50, 50)))

    results = {
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "what": "linear probe on frozen DINOv2 features, trained on content-matched pairs",
        "backbone": args.backbone,
        "representation": args.rep,
        "temperature": round(temp, 4),
        "n_head_params": int(pipe[-1].coef_.size + 1),
        "heldout_generator": HELDOUT,
        "v1_shipped_baseline_auroc": 0.5,
        "splits": {},
    }

    for name, d in data.items():
        p = prob(d["X"])
        results["splits"][name] = summarize(d["y"], p)
        gens = sorted({g for g in d["gen"] if g})
        if len(gens) > 1:
            results["splits"][name]["per_generator"] = {
                g.split("/")[-1]: round(float(roc_auc_score(
                    d["y"][(d["y"] == 0) | (d["gen"] == g)],
                    p[(d["y"] == 0) | (d["gen"] == g)])), 4)
                for g in gens
                if len(np.unique(d["y"][(d["y"] == 0) | (d["gen"] == g)])) == 2
            }

    # Cross-check on the unmatched set: the gap is the shortcut's size.
    ev = load_npz(args.features / "{}_evalset_v1.npz".format(args.backbone), args.rep)
    if ev is not None:
        results["splits"]["evalset_v1_unmatched"] = summarize(ev["y"], prob(ev["X"]))

    results["abstention_band"] = {
        "fitted_on": "val", "target_fpr": 0.05, "max_abstain": 0.25,
        "band": choose_band(data["val"]["y"], prob(data["val"]["X"])),
    }

    honest = results["splits"]["test"]["auroc"]
    heldout_auc = results["splits"]["test_heldout_SDXL"].get("auroc")
    unmatched = results["splits"].get("evalset_v1_unmatched", {}).get("auroc")
    results["headline"] = {
        "honest_test_auroc": honest,
        "heldout_generator_auroc": heldout_auc,
        "unmatched_auroc": unmatched,
        "shortcut_gap": (round(unmatched - honest, 4)
                         if unmatched is not None else None),
        "improvement_over_v1": round(honest - 0.5, 4),
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2), encoding="utf-8")

    print("\n" + "=" * 64)
    for k, v in results["splits"].items():
        if "auroc" in v:
            print("  {:<26s} AUROC {:.4f}  CI[{:.3f},{:.3f}]  acc {:.3f}  ECE {:.3f}".format(
                k, v["auroc"], v["ci95"][0], v["ci95"][1], v["accuracy"], v["ece"]))
    print("  band:", results["abstention_band"]["band"])
    print("Wrote {}".format(args.out))


if __name__ == "__main__":
    main()
