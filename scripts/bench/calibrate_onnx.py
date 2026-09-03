"""
Re-derive temperature scaling and the abstention band for a fine-tuned model.

The fine-tuned detector was exported without calibration, so sigmoid(logit) is
its raw confidence. Its AUROC is excellent, but the three-state thresholds the
extension ships (likely-authentic / inconclusive / likely-AI) were fitted to the
*probe's* score distribution and do not describe this model. Shipping the new
weights behind the old thresholds would mean the UI's stated false-positive rate
and abstention rate are wrong.

This fits both on data the model never trained on:

  temperature  a single scalar T minimising NLL of sigmoid(logit / T) on the
               validation split, so reported confidences track observed
               frequencies (lower ECE).

  band         two thresholds bounding the inconclusive band, chosen against a
               5% false-positive target under a 25% abstention ceiling.

The validation split is reconstructed with the exact logic finetune_gpu.py used
to train (same seed, same pair_id grouping, same SDXL holdout), so it is
genuinely held out from training. The chosen band is then reported on
matched_control_v1 as well -- a fully external set -- so the numbers you see are
what the deployed thresholds will actually do.

Run from the repo root:
    python scripts/bench/calibrate_onnx.py
"""
from __future__ import annotations

import argparse
import json
import random
from collections import defaultdict
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
from scipy.optimize import minimize_scalar
from sklearn.metrics import roc_auc_score

HELDOUT = "stabilityai/stable-diffusion-xl-base-1.0"
RNG = np.random.default_rng(20260903)


# --- split reconstruction (must match finetune_gpu.build_splits exactly) ----

def build_splits(manifest, heldout_generator=HELDOUT, seed=20260903):
    rng = random.Random(seed)
    by_pair = defaultdict(list)
    for r in manifest["images"]:
        by_pair[r["pair_id"]].append(r)

    heldout, pool = [], []
    for pid, recs in by_pair.items():
        gens = {r["generator"] for r in recs if r["generator"]}
        (heldout if heldout_generator in gens else pool).append(pid)

    rng.shuffle(pool)
    n = len(pool)
    cut_a, cut_b = int(0.75 * n), int(0.875 * n)
    splits = {
        "train": pool[:cut_a],
        "val": pool[cut_a:cut_b],
        "test": pool[cut_b:],
        "test_heldout": heldout,
    }
    return {k: [r for pid in v for r in by_pair[pid]] for k, v in splits.items()}


# --- inference ---------------------------------------------------------------

def preprocess(img, size, mean, std):
    arr = np.asarray(img.convert("RGB").resize((size, size), Image.BICUBIC),
                     dtype=np.float32) / 255.0
    arr = (arr - np.array(mean, np.float32)) / np.array(std, np.float32)
    return np.transpose(arr, (2, 0, 1))


def run_logits(sess, io, meta, root: Path, records, batch=16):
    """Return raw logits (pre-sigmoid) and labels for a list of records."""
    size = meta.get("input_size", 224)
    mean = meta.get("mean", [0.485, 0.456, 0.406])
    std = meta.get("std", [0.229, 0.224, 0.225])

    logits, labels = [], []
    for i in range(0, len(records), batch):
        chunk = records[i:i + batch]
        tensors = []
        for r in chunk:
            sub = "real" if r["label"] == "real" else "ai"
            tensors.append(preprocess(Image.open(root / sub / r["file"]),
                                      size, mean, std))
        out = np.asarray(sess.run([io[1]], {io[0]: np.stack(tensors).astype(np.float32)})[0])
        logits.extend(np.asarray(out, dtype=np.float64).reshape(-1).tolist())
        labels.extend(r["label_int"] for r in chunk)
    return np.array(logits), np.array(labels)


# --- calibration -------------------------------------------------------------

def fit_temperature(logits, y):
    def nll(log_t):
        p = 1 / (1 + np.exp(-np.clip(logits / np.exp(log_t), -50, 50)))
        return -np.mean(y * np.log(p + 1e-12) + (1 - y) * np.log(1 - p + 1e-12))
    return float(np.exp(minimize_scalar(nll, bounds=(-3, 3), method="bounded").x))


def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -50, 50)))


def ece(y, p, n_bins=10):
    conf = np.where(p >= 0.5, p, 1 - p)
    correct = ((p >= 0.5).astype(int) == y).astype(float)
    edges = np.linspace(0.5, 1.0, n_bins + 1)
    tot = 0.0
    for lo, hi in zip(edges[:-1], edges[1:]):
        m = (conf >= lo) & (conf <= hi)
        if m.sum():
            tot += (m.sum() / len(y)) * abs(correct[m].mean() - conf[m].mean())
    return float(tot)


def choose_band(y, p, target_fpr=0.05, max_abstain=0.25):
    reals, ais = p[y == 0], p[y == 1]
    best = None
    for high in np.quantile(reals, np.linspace(0.80, 0.999, 60)):
        for low in np.quantile(ais, np.linspace(0.001, 0.20, 60)):
            if low >= high:
                continue
            decided = (p < low) | (p > high)
            abstain = 1.0 - decided.mean()
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


def band_report(y, p, low, high):
    decided = (p < low) | (p > high)
    dr, da = (y == 0) & decided, (y == 1) & decided
    return {
        "n": int(len(y)),
        "abstain_rate": round(float(1 - decided.mean()), 4),
        "fpr_on_decided_real": round(float((p[dr] > high).mean()), 4) if dr.sum() else None,
        "tpr_on_decided_ai": round(float((p[da] > high).mean()), 4) if da.sum() else None,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", type=Path,
                    default=Path("public/models/detector_v2_finetuned_int8.onnx"))
    ap.add_argument("--meta", type=Path,
                    default=Path("public/models/detector_v2_finetuned_meta.json"))
    ap.add_argument("--corpus", type=Path,
                    default=Path("docs/benchmark/matched_corpus_v1"))
    ap.add_argument("--external", type=Path,
                    default=Path("docs/benchmark/matched_control_v1"))
    ap.add_argument("--target-fpr", type=float, default=0.05)
    ap.add_argument("--max-abstain", type=float, default=0.25)
    ap.add_argument("--out", type=Path,
                    default=Path("docs/benchmark/v2_finetuned_calibration.json"))
    args = ap.parse_args()

    meta = json.loads(args.meta.read_text(encoding="utf-8"))
    sess = ort.InferenceSession(str(args.model), providers=["CPUExecutionProvider"])
    io = (sess.get_inputs()[0].name, sess.get_outputs()[0].name)

    manifest = json.loads((args.corpus / "corpus_manifest.json").read_text(encoding="utf-8")) \
        if (args.corpus / "corpus_manifest.json").exists() \
        else json.loads((args.corpus / "manifest.json").read_text(encoding="utf-8"))
    splits = build_splits(manifest)
    print("splits:", {k: len(v) for k, v in splits.items()})

    print("running val split ({} imgs) ...".format(len(splits["val"])), flush=True)
    val_logits, val_y = run_logits(sess, io, meta, args.corpus, splits["val"])

    temperature = fit_temperature(val_logits, val_y)
    val_p_raw = sigmoid(val_logits)
    val_p_cal = sigmoid(val_logits / temperature)
    print("temperature: {:.4f}".format(temperature))
    print("val AUROC: {:.4f}  ECE raw {:.4f} -> calibrated {:.4f}".format(
        roc_auc_score(val_y, val_p_cal), ece(val_y, val_p_raw), ece(val_y, val_p_cal)))

    band = choose_band(val_y, val_p_cal, args.target_fpr, args.max_abstain)
    if band is None:
        raise SystemExit(
            "No band met FPR {} within abstain ceiling {}. Design failure -- "
            "surface this rather than shipping.".format(args.target_fpr, args.max_abstain))
    print("band (fitted on val):", band)

    # External check on matched_control_v1, with the band we just chose.
    external = None
    ext_manifest = args.external / "manifest.json"
    if ext_manifest.exists():
        recs = json.loads(ext_manifest.read_text(encoding="utf-8"))["images"]
        print("running external set ({} imgs) ...".format(len(recs)), flush=True)
        ext_logits, ext_y = run_logits(sess, io, meta, args.external, recs)
        ext_p = sigmoid(ext_logits / temperature)
        external = {
            "auroc": round(float(roc_auc_score(ext_y, ext_p)), 4),
            "ece_calibrated": round(ece(ext_y, ext_p), 4),
            "band_behaviour": band_report(ext_y, ext_p, band["low"], band["high"]),
        }
        print("external AUROC {:.4f}  ECE {:.4f}".format(
            external["auroc"], external["ece_calibrated"]))
        print("external band behaviour:", external["band_behaviour"])

    result = {
        "model": str(args.model).replace("\\", "/"),
        "temperature": round(temperature, 4),
        "abstention_band": {"low": band["low"], "high": band["high"]},
        "fitted_on_val": band,
        "external_check": external,
        "val_auroc": round(float(roc_auc_score(val_y, val_p_cal)), 4),
    }
    args.out.write_text(json.dumps(result, indent=2), encoding="utf-8")

    print("\n" + "=" * 60)
    print("COPY THESE INTO contract.ts:")
    print("  temperature      = {:.4f}".format(temperature))
    print("  ABSTENTION_BAND  low = {}, high = {}".format(band["low"], band["high"]))
    if external:
        print("  measured on external set: abstain {}, fpr {}, tpr {}".format(
            external["band_behaviour"]["abstain_rate"],
            external["band_behaviour"]["fpr_on_decided_real"],
            external["band_behaviour"]["tpr_on_decided_ai"]))
        print("  external AUROC   = {}".format(external["auroc"]))
    print("Wrote {}".format(args.out))


if __name__ == "__main__":
    main()
