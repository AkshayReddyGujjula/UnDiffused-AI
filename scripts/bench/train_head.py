"""
Stage 5: fit a lightweight head on cached features, calibrate it, and set the
abstention band.

Three things happen here, in this order, and the order matters:

1. **Fit.** Logistic regression on frozen DINOv2 embeddings. A few hundred
   parameters, fitted in seconds, deliberately not a bespoke architecture. The
   literature's clearest result is that a linear probe on a strong frozen
   backbone beats a purpose-built detector on in-the-wild data, because a frozen
   backbone cannot overfit to the generators in the training set.

2. **Calibrate.** Temperature scaling fitted on the validation split, with the
   head frozen. Detectors are systematically miscalibrated and tend to call
   generated images real, so a reported 0.9 should correspond to being right
   about nine times in ten. The V2 branch shipped `"temperature": 1.0`, which is
   the identity and therefore no calibration at all; the temperature here is
   fitted by minimising NLL and is reported whatever it comes out as.

3. **Abstain.** Two thresholds bounding an inconclusive band, chosen against a
   target false-positive rate, because wrongly accusing a real photograph is the
   more damaging error. The band is not free: a model that abstains on
   everything is useless rather than honest, so an abstention ceiling is fixed
   in advance and the thresholds are selected subject to it.

The headline is the held-out generator (SDXL), which never appears in training
or calibration. Everything else is supporting detail.
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from scipy.optimize import minimize_scalar

RNG = np.random.default_rng(20260903)


# --------------------------------------------------------------------------
# metrics
# --------------------------------------------------------------------------

def bootstrap_ci(y, p, n_boot=2000):
    y = np.asarray(y)
    pos, neg = np.flatnonzero(y == 1), np.flatnonzero(y == 0)
    if len(pos) == 0 or len(neg) == 0:
        return [None, None]
    vals = []
    for _ in range(n_boot):
        idx = np.concatenate([RNG.choice(pos, len(pos), True),
                              RNG.choice(neg, len(neg), True)])
        try:
            vals.append(roc_auc_score(y[idx], p[idx]))
        except ValueError:
            pass
    if not vals:
        return [None, None]
    return [float(np.percentile(vals, 2.5)), float(np.percentile(vals, 97.5))]


def expected_calibration_error(y, p, n_bins=10):
    """ECE: average gap between confidence and observed accuracy, bin-weighted.

    Reported because a detector that is right 85% of the time while claiming 99%
    is dishonest in a way accuracy alone will not show.
    """
    y, p = np.asarray(y), np.asarray(p)
    conf = np.where(p >= 0.5, p, 1 - p)
    pred = (p >= 0.5).astype(int)
    correct = (pred == y).astype(float)

    edges = np.linspace(0.5, 1.0, n_bins + 1)
    ece = 0.0
    for lo, hi in zip(edges[:-1], edges[1:]):
        m = (conf > lo) & (conf <= hi) if lo > 0.5 else (conf >= lo) & (conf <= hi)
        if m.sum() == 0:
            continue
        ece += (m.sum() / len(y)) * abs(correct[m].mean() - conf[m].mean())
    return float(ece)


def fpr_at_tpr(y, p, target_tpr=0.95):
    """FPR when the threshold is set to catch `target_tpr` of generated images."""
    y, p = np.asarray(y), np.asarray(p)
    pos, neg = p[y == 1], p[y == 0]
    if len(pos) == 0 or len(neg) == 0:
        return None
    thr = np.quantile(pos, 1 - target_tpr)
    return float((neg >= thr).mean())


def summarize(y, p, label=""):
    y = np.asarray(y)
    if len(np.unique(y)) < 2:
        return {"n": int(len(y)), "note": "single-class split, AUROC undefined"}
    return {
        "n": int(len(y)),
        "n_ai": int((y == 1).sum()),
        "auroc": round(float(roc_auc_score(y, p)), 4),
        "ci95": [round(v, 4) if v is not None else None for v in bootstrap_ci(y, p)],
        "accuracy": round(float(((p >= 0.5).astype(int) == y).mean()), 4),
        "fpr_at_95tpr": (round(fpr_at_tpr(y, p), 4)
                         if fpr_at_tpr(y, p) is not None else None),
        "ece": round(expected_calibration_error(y, p), 4),
        "label": label,
    }


# --------------------------------------------------------------------------
# calibration and abstention
# --------------------------------------------------------------------------

def fit_temperature(logits, y):
    """Single scalar T minimising NLL of sigmoid(logit / T) on held-out data."""
    logits, y = np.asarray(logits, float), np.asarray(y, float)

    def nll(log_t):
        t = np.exp(log_t)
        z = np.clip(logits / t, -50, 50)
        p = 1 / (1 + np.exp(-z))
        eps = 1e-12
        return -np.mean(y * np.log(p + eps) + (1 - y) * np.log(1 - p + eps))

    res = minimize_scalar(nll, bounds=(-3.0, 3.0), method="bounded")
    return float(np.exp(res.x))


def choose_abstention_band(y, p, target_fpr=0.05, max_abstain=0.25):
    """Pick (low, high) bounding the inconclusive band.

    Constraint order is deliberate: hit the false-positive target if it can be
    hit without abstaining on more than `max_abstain` of images. Wrongly calling
    a photograph fake is the damaging error, but a model that shrugs at one
    image in three has converted candour into evasion.
    """
    y, p = np.asarray(y), np.asarray(p)
    reals, ais = p[y == 0], p[y == 1]
    if len(reals) == 0 or len(ais) == 0:
        return None

    best = None
    for high in np.quantile(reals, np.linspace(0.80, 0.999, 60)):
        for low in np.quantile(ais, np.linspace(0.001, 0.20, 60)):
            if low >= high:
                continue
            decided = (p < low) | (p > high)
            abstain = 1.0 - decided.mean()
            if abstain > max_abstain:
                continue
            dec_real = (y == 0) & decided
            dec_ai = (y == 1) & decided
            if dec_real.sum() == 0 or dec_ai.sum() == 0:
                continue
            fpr = float((p[dec_real] > high).mean())
            tpr = float((p[dec_ai] > high).mean())
            if fpr > target_fpr:
                continue
            score = tpr - abstain * 0.5
            if best is None or score > best["score"]:
                best = {"score": score, "low": float(low), "high": float(high),
                        "abstain_rate": float(abstain), "fpr": fpr, "tpr": tpr}
    if best:
        best.pop("score")
    return best


# --------------------------------------------------------------------------

def load_split(feat_dir: Path, backbone: str, split: str, rep: str):
    f = feat_dir / "{}_{}.npz".format(backbone, split)
    if not f.exists():
        return None
    d = np.load(f, allow_pickle=True)
    X = (np.hstack([d["cls"], d["mean"]]) if rep == "cls+mean" else d[rep])
    ok = d["ok"]
    return {"X": X[ok], "y": d["labels"][ok],
            "gen": d["generators"][ok], "files": d["files"][ok]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--features", type=Path,
                    default=Path("docs/benchmark/corpus_v1/features"))
    ap.add_argument("--backbone", default="dinov2-small")
    ap.add_argument("--rep", default="mean", choices=["cls", "mean", "cls+mean"])
    ap.add_argument("--target-fpr", type=float, default=0.05)
    ap.add_argument("--max-abstain", type=float, default=0.25)
    ap.add_argument("--out", type=Path,
                    default=Path("docs/benchmark/v2_head.json"))
    args = ap.parse_args()

    train = load_split(args.features, args.backbone, "train", args.rep)
    val = load_split(args.features, args.backbone, "val", args.rep)
    test = load_split(args.features, args.backbone, "test", args.rep)
    heldout_ai = load_split(args.features, args.backbone, "test_heldout", args.rep)
    evalset = load_split(args.features, args.backbone, "evalset_v1", args.rep)
    matched = load_split(args.features, args.backbone, "matched_control_v1", args.rep)

    # The holdout split is SDXL only, so it carries no negatives and AUROC is
    # undefined on it alone. Score it against the real images from the test
    # split, which the head has also never seen. Both halves are unseen, and
    # SDXL additionally never appeared in any generator the head trained on.
    heldout = None
    if heldout_ai is not None and test is not None:
        real_m = test["y"] == 0
        heldout = {
            "X": np.vstack([test["X"][real_m], heldout_ai["X"]]),
            "y": np.concatenate([test["y"][real_m], heldout_ai["y"]]),
            "gen": np.concatenate([test["gen"][real_m], heldout_ai["gen"]]),
            "files": np.concatenate([test["files"][real_m], heldout_ai["files"]]),
        }

    if train is None or val is None:
        raise SystemExit("Missing train/val features. Run extract_features.py first.")

    print("train {}  val {}  test {}  heldout {}".format(
        len(train["y"]), len(val["y"]),
        len(test["y"]) if test else 0,
        len(heldout["y"]) if heldout else 0))

    pipe = make_pipeline(StandardScaler(),
                         LogisticRegression(max_iter=5000, C=1.0))
    pipe.fit(train["X"], train["y"])

    def raw_logit(split):
        return pipe.decision_function(split["X"])

    temperature = fit_temperature(raw_logit(val), val["y"])
    print("fitted temperature: {:.4f}".format(temperature))

    def calibrated(split):
        z = np.clip(raw_logit(split) / temperature, -50, 50)
        return 1 / (1 + np.exp(-z))

    results = {
        "stage": "5 - baseline head, calibration, abstention band",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "backbone": args.backbone,
        "representation": args.rep,
        "head": "logistic regression on frozen features",
        "n_head_params": int(pipe[-1].coef_.size + 1),
        "temperature": round(temperature, 4),
        "v1_shipped_baseline_auroc": 0.5,
        "splits": {},
    }

    for name, split in (("train", train), ("val", val), ("test", test),
                        ("test_heldout_SDXL", heldout), ("evalset_v1", evalset),
                        ("matched_control_v1", matched)):
        if split is None:
            continue
        p = calibrated(split)
        results["splits"][name] = summarize(split["y"], p, name)

        gens = sorted({g for g in split["gen"] if g})
        if len(gens) > 1:
            per = {}
            for g in gens:
                m = (split["y"] == 0) | (split["gen"] == g)
                if len(np.unique(split["y"][m])) == 2:
                    per[g.split("/")[-1]] = round(
                        float(roc_auc_score(split["y"][m], p[m])), 4)
            results["splits"][name]["per_generator"] = per

    band_source = val
    band = choose_abstention_band(band_source["y"], calibrated(band_source),
                                  args.target_fpr, args.max_abstain)
    results["abstention_band"] = {
        "fitted_on": "val",
        "target_fpr": args.target_fpr,
        "max_abstain": args.max_abstain,
        "band": band,
        "note": ("null means no band met the target FPR within the abstention "
                 "ceiling; that is a design failure and must surface here."),
    }

    if band and heldout is not None:
        p = calibrated(heldout)
        decided = (p < band["low"]) | (p > band["high"])
        results["abstention_band"]["on_heldout_SDXL"] = {
            "abstain_rate": round(float(1 - decided.mean()), 4),
            "accuracy_on_decided": (
                round(float(((p[decided] > band["high"]).astype(int)
                             == heldout["y"][decided]).mean()), 4)
                if decided.sum() else None),
        }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2), encoding="utf-8")

    print("\n" + "=" * 62)
    for name, s in results["splits"].items():
        if "auroc" in s:
            print("  {:<20s} AUROC {:.4f}  acc {:.3f}  ECE {:.3f}  FPR@95TPR {}".format(
                name, s["auroc"], s["accuracy"], s["ece"], s["fpr_at_95tpr"]))
    print("  abstention band:", band)
    print("Wrote {}".format(args.out))


if __name__ == "__main__":
    main()
