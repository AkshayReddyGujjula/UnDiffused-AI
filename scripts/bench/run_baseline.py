"""
Stage 1 / step 2: measure what the shipped checkpoints actually do.

Runs three paths over the same images and writes docs/benchmark/v1_baseline.json.

  A  corrected single-view   whole image -> 224x224 -> both models, full softmax
                             over all 3 (global) / 2 (local) classes. This is the
                             honest v1 baseline and the test that identifies which
                             class index means "AI".

  B  extension as shipped    the exact worker.ts path: 4 quadrants -> global model
                             -> the broken flat-index parse -> early-exit gate ->
                             adaptive crops -> local model -> probs[0] -> 25/75
                             blend. Reproduces the bug rather than fixing it.

  C  extension geometry,     identical crops and fusion to B, but with correct
     correct parsing         softmax parsing and the empirically-chosen AI index.
                             Isolates the parsing defect from the cropping design.

Every logit is cached to logits_<variant>.npz, so re-analysis never needs another
forward pass.
"""
from __future__ import annotations

import argparse
import json
import platform
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
from sklearn.metrics import roc_auc_score

import extension_replica as ext

RNG = np.random.default_rng(20260902)


# --------------------------------------------------------------------------
# metrics
# --------------------------------------------------------------------------

def auroc_with_ci(labels: np.ndarray, scores: np.ndarray, n_boot: int = 2000):
    """AUROC plus a stratified bootstrap 95% interval.

    n=100 is a small set and a bare AUROC would overstate what it establishes,
    so every reported figure carries its interval.
    """
    labels = np.asarray(labels)
    scores = np.asarray(scores, dtype=np.float64)

    if np.all(np.isnan(scores)) or len(np.unique(labels)) < 2:
        return {"auroc": None, "ci95": [None, None]}

    point = float(roc_auc_score(labels, scores))

    pos = np.flatnonzero(labels == 1)
    neg = np.flatnonzero(labels == 0)
    boots = []
    for _ in range(n_boot):
        idx = np.concatenate([RNG.choice(pos, len(pos), replace=True),
                              RNG.choice(neg, len(neg), replace=True)])
        try:
            boots.append(roc_auc_score(labels[idx], scores[idx]))
        except ValueError:
            continue
    lo, hi = np.percentile(boots, [2.5, 97.5]) if boots else (None, None)
    return {"auroc": point,
            "ci95": [float(lo), float(hi)] if boots else [None, None]}


def verdict_metrics(labels: np.ndarray, scores: np.ndarray, threshold: float = 0.5):
    """Accuracy / FPR / TPR at the extension's hardcoded 0.5 threshold."""
    pred = (np.asarray(scores) > threshold).astype(int)
    labels = np.asarray(labels)
    tp = int(((pred == 1) & (labels == 1)).sum())
    tn = int(((pred == 0) & (labels == 0)).sum())
    fp = int(((pred == 1) & (labels == 0)).sum())
    fn = int(((pred == 0) & (labels == 1)).sum())
    n = len(labels)
    return {
        "threshold": threshold,
        "accuracy": (tp + tn) / n if n else None,
        "tpr_recall_on_ai": tp / (tp + fn) if (tp + fn) else None,
        "fpr_on_real": fp / (fp + tn) if (fp + tn) else None,
        "confusion": {"tp": tp, "tn": tn, "fp": fp, "fn": fn},
    }


# --------------------------------------------------------------------------
# inference
# --------------------------------------------------------------------------

def run_batch(session, io_names, tensors: list[np.ndarray]) -> np.ndarray:
    """Forward a list of CHW tensors, return [batch, classes] logits."""
    if not tensors:
        return np.zeros((0, 0), dtype=np.float32)
    batch = np.stack(tensors).astype(np.float32)
    out = session.run([io_names[1]], {io_names[0]: batch})[0]
    return np.asarray(out, dtype=np.float64)


def normalize_image(img: Image.Image, side: int = 512, quality: int = 90,
                    tmp: Path | None = None) -> Image.Image:
    """Confound control: force every image to identical resolution and JPEG history.

    The real half is web JPEG at assorted sizes; the AI half is clean renders at
    256-640px. Without this, a detector can separate the classes on compression
    and resolution cues alone and never look at the image content.
    """
    resized = img.convert("RGB").resize((side, side), Image.BICUBIC)
    resized.save(tmp, format="JPEG", quality=quality)
    return Image.open(tmp).convert("RGB")


def process_variant(images, models, variant: str, out_dir: Path, scratch: Path):
    """Run all four inference groups per image; return per-image records."""
    g_sess, g_io = models["global"]
    l_sess, l_io = models["local"]

    records = []
    t_start = time.time()

    for n, meta in enumerate(images, 1):
        path = out_dir / ("real" if meta["label"] == "real" else "ai") / meta["file"]
        img = Image.open(path).convert("RGB")
        orig_size = [img.width, img.height]

        if variant == "normalized":
            img = normalize_image(img, tmp=scratch / "norm.jpg")

        w, h = img.width, img.height

        # --- Path A inputs: the whole image, one view per model -------------
        whole = ext.whole_image_tensor(img)
        g_whole = run_batch(g_sess, g_io, [whole])[0]
        l_whole = run_batch(l_sess, l_io, [whole])[0]

        # --- Extension geometry: 4 quadrants + adaptive crops --------------
        quads = ext.quadrant_crops(w, h)
        g_quad = run_batch(g_sess, g_io,
                           [ext.crop_to_tensor(img, c["x"], c["y"], c["width"], c["height"])
                            for c in quads])

        qmap = ext.compute_quality_map(img)
        local_crops = [c for c in ext.get_adaptive_crops(w, h, qmap, 9)
                       if c["label"] != "Global"]
        l_crops = run_batch(l_sess, l_io,
                            [ext.crop_to_tensor(img, c["x"], c["y"], c["width"], c["height"])
                             for c in local_crops])

        records.append({
            "file": meta["file"],
            "label": meta["label"],
            "label_int": meta["label_int"],
            "generator": meta["generator"],
            "orig_size": orig_size,
            "eval_size": [w, h],
            "n_local_crops": len(local_crops),
            "global_whole_logits": g_whole.tolist(),
            "local_whole_logits": l_whole.tolist(),
            "global_quad_logits": g_quad.tolist(),
            "local_crop_logits": l_crops.tolist(),
        })

        if n % 10 == 0 or n == len(images):
            rate = (time.time() - t_start) / n
            print("    [{}] {}/{}  ({:.2f}s/img)".format(variant, n, len(images), rate))

    return records


# --------------------------------------------------------------------------
# path derivation (pure post-processing over cached logits)
# --------------------------------------------------------------------------

def derive_path_a(records):
    """Softmax the whole-image logits. Must run before analyse(), which needs
    these to work out which class index is AI in the first place."""
    for r in records:
        r["A_global_probs"] = ext.softmax(np.array(r["global_whole_logits"])).tolist()
        r["A_local_probs"] = ext.softmax(np.array(r["local_whole_logits"])).tolist()
    return records


def derive_paths_bc(records, ai_index_global: int, ai_index_local: int):
    """Paths B and C, which need the AI index that analyse() infers."""
    for r in records:
        # --- Path B: exactly what ships ---------------------------------
        quad = np.array(r["global_quad_logits"])
        shipped_global = ext.parse_logits_as_shipped(quad)

        crops = np.array(r["local_crop_logits"])
        shipped_local = ext.parse_logits_as_shipped(crops) if len(crops) else []

        final, gprob, lprob, took_local = ext.fuse_as_shipped(
            shipped_global, shipped_local)
        r["B_final"] = final
        r["B_global"] = gprob
        r["B_local"] = lprob
        r["B_took_local_model"] = took_local

        # --- Path C: same geometry and fusion, correct parsing ----------
        good_global = ext.softmax(quad)[:, ai_index_global].tolist()
        good_local = (ext.softmax(crops)[:, ai_index_local].tolist()
                      if len(crops) else [])
        cfinal, cg, cl, ctook = ext.fuse_as_shipped(good_global, good_local)
        r["C_final"] = cfinal
        r["C_global"] = cg
        r["C_local"] = cl
        r["C_took_local_model"] = ctook
    return records


def score_column(records, key, index=None):
    if index is None:
        return np.array([r[key] for r in records], dtype=np.float64)
    return np.array([r[key][index] for r in records], dtype=np.float64)


def analyse(records):
    """The decisive test: AUROC of each class index's probability vs true label."""
    labels = np.array([r["label_int"] for r in records])

    per_class = {"global_model": {}, "local_model": {}}
    for i in range(3):
        per_class["global_model"]["class_{}".format(i)] = auroc_with_ci(
            labels, score_column(records, "A_global_probs", i))
    for i in range(2):
        per_class["local_model"]["class_{}".format(i)] = auroc_with_ci(
            labels, score_column(records, "A_local_probs", i))
    return labels, per_class


def pick_ai_index(per_class_block):
    """The index whose probability ranks AI above real is the AI class."""
    best_key, best = None, -1.0
    for key, val in per_class_block.items():
        if val["auroc"] is not None and val["auroc"] > best:
            best_key, best = key, val["auroc"]
    return int(best_key.split("_")[1]), best


# --------------------------------------------------------------------------

def build_conclusions(results):
    """State the verdict in the artifact itself, derived from the numbers.

    An index only counts as informative if its bootstrap interval excludes 0.5.
    A point estimate on one side of chance is not evidence at n=100.
    """
    informative = []
    inverted = []
    for variant, blk in results["variants"].items():
        for model, classes in blk["per_class_auroc"].items():
            for cls, val in classes.items():
                lo, hi = val["ci95"]
                if lo is None:
                    continue
                if lo > 0.5:
                    informative.append((variant, model, cls, val["auroc"]))
                elif hi < 0.5:
                    inverted.append((variant, model, cls, val["auroc"]))

    if informative:
        verdict = "informative"
        headline = ("At least one class index separates generated from authentic "
                    "with an interval excluding chance.")
    elif inverted:
        verdict = "inverted"
        headline = ("At least one class index ranks authentic above generated with "
                    "an interval excluding chance: the detector is inverted.")
    else:
        verdict = "uninformative"
        headline = ("No class index of either checkpoint separates generated from "
                    "authentic. Every 95% interval contains 0.5.")

    summary = ["VERDICT: {}".format(verdict.upper()), headline]
    for variant, blk in results["variants"].items():
        b = blk["paths"]["B_extension_as_shipped"]
        summary.append(
            "  [{}] extension as shipped: AUROC {:.3f} CI[{:.3f},{:.3f}], "
            "accuracy {:.3f}, TPR on AI {:.3f}, FPR on real {:.3f}".format(
                variant, b["auroc"], b["ci95"][0], b["ci95"][1],
                b["accuracy"], b["tpr_recall_on_ai"], b["fpr_on_real"]))

    return {
        "verdict": verdict,
        "headline": headline,
        "informative_indices": informative,
        "inverted_indices": inverted,
        "which_index_means_ai": (
            None if verdict == "uninformative" else "see informative_indices"),
        "note_on_the_ai_index_question": (
            "The repository's open question was which output index means AI. On this "
            "set the question does not resolve, because no index carries signal to "
            "resolve it with. 'inferred_ai_class_index' records the best-ranking "
            "index per variant, but those AUROCs are within noise of 0.5 and must "
            "not be read as a label map."
            if verdict == "uninformative" else
            "Resolved empirically; see informative_indices."),
        "preprocessing_robustness": {
            "file": "normalization_probe.json",
            "why": ("A chance-level result would be worthless if it came from feeding "
                    "the models the wrong preprocessing. The probe sweeps 5 "
                    "normalisations x 2 resize policies and reports the strongest "
                    "separation found anywhere."),
        },
        "summary": summary,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eval-dir", type=Path, default=Path("docs/benchmark/eval_set_v1"))
    ap.add_argument("--models", type=Path, default=Path("public/models"))
    ap.add_argument("--out", type=Path, default=Path("docs/benchmark/v1_baseline.json"))
    ap.add_argument("--variants", nargs="+", default=["raw", "normalized"])
    args = ap.parse_args()

    scratch = args.eval_dir / "_scratch"
    scratch.mkdir(parents=True, exist_ok=True)

    manifest = json.loads((args.eval_dir / "manifest.json").read_text(encoding="utf-8"))
    images = manifest["images"]

    so = ort.SessionOptions()
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    models = {}
    model_info = {}
    for name in ("global", "local"):
        p = args.models / "model_{}_quantized.onnx".format(name)
        sess = ort.InferenceSession(str(p), so, providers=["CPUExecutionProvider"])
        i, o = sess.get_inputs()[0], sess.get_outputs()[0]
        models[name] = (sess, (i.name, o.name))
        model_info[name] = {
            "file": str(p).replace("\\", "/"),
            "input_name": i.name, "input_shape": [str(d) for d in i.shape],
            "output_name": o.name, "output_shape": [str(d) for d in o.shape],
            "num_classes": int(o.shape[1]),
            "size_bytes": p.stat().st_size,
        }
        print("Loaded {}: {} {} -> {} {}".format(
            name, i.name, i.shape, o.name, o.shape))

    results = {
        "benchmark": "UnDiffused v1 baseline (Stage 1: ground truth on shipped checkpoints)",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "environment": {
            "python": platform.python_version(),
            "onnxruntime": ort.__version__,
            "numpy": np.__version__,
            "platform": platform.platform(),
        },
        "models": model_info,
        "eval_set": {
            "name": manifest["name"],
            "seed": manifest["seed"],
            "counts": manifest["counts"],
            "sources": manifest["sources"],
            "label_convention": manifest["label_convention"],
        },
        "preprocessing": {
            "size": [224, 224],
            "layout": "NCHW",
            "mean": ext.MEAN.tolist(),
            "std": ext.STD.tolist(),
            "input_tensor": "pixel_values",
            "resample": "PIL BILINEAR (approximates canvas drawImage)",
        },
        "variants": {},
    }

    for variant in args.variants:
        print("\n=== variant: {} ===".format(variant))

        # Forward passes are the only expensive part, so they are cached to disk
        # the moment they exist. An error in the analysis below then costs
        # seconds to retry instead of another full pass over the set.
        raw_cache = args.out.parent / "raw_records_{}.json".format(variant)
        if raw_cache.exists():
            print("  reusing cached forward passes from {}".format(raw_cache.name))
            records = json.loads(raw_cache.read_text(encoding="utf-8"))
        else:
            records = process_variant(images, models, variant, args.eval_dir, scratch)
            raw_cache.write_text(json.dumps(records), encoding="utf-8")
            print("  cached forward passes -> {}".format(raw_cache.name))

        records = derive_path_a(records)
        labels, per_class = analyse(records)

        ai_g, auc_g = pick_ai_index(per_class["global_model"])
        ai_l, auc_l = pick_ai_index(per_class["local_model"])
        records = derive_paths_bc(records, ai_g, ai_l)

        b_scores = score_column(records, "B_final")
        c_scores = score_column(records, "C_final")

        # Per-generator AUROC uses all 50 reals against each generator's subset.
        per_gen = {}
        gens = sorted({r["generator"] for r in records if r["generator"]})
        for g in gens:
            sub = [r for r in records if r["generator"] == g or r["label"] == "real"]
            sl = np.array([r["label_int"] for r in sub])
            per_gen[g] = {
                "n_ai": sum(1 for r in sub if r["label_int"] == 1),
                "A_local_ai_class": auroc_with_ci(
                    sl, score_column(sub, "A_local_probs", ai_l), n_boot=500),
                "A_global_ai_class": auroc_with_ci(
                    sl, score_column(sub, "A_global_probs", ai_g), n_boot=500),
                "B_extension_as_shipped": auroc_with_ci(
                    sl, score_column(sub, "B_final"), n_boot=500),
            }

        third = [i for i in range(3) if i != ai_g]
        results["variants"][variant] = {
            "n_images": len(records),
            "per_class_auroc": per_class,
            "inferred_ai_class_index": {
                "global_model": {"index": ai_g, "auroc": auc_g},
                "local_model": {"index": ai_l, "auroc": auc_l},
            },
            "global_third_class_probe": {
                "note": ("The global head has 3 classes and no label map. These are the "
                         "two non-AI indices, with mean probability by true label, as a "
                         "hint at what the extra class encodes."),
                "indices": third,
                "mean_prob_by_label": {
                    "class_{}".format(i): {
                        "real": float(np.mean([r["A_global_probs"][i]
                                               for r in records if r["label"] == "real"])),
                        "ai": float(np.mean([r["A_global_probs"][i]
                                             for r in records if r["label"] == "ai"])),
                    } for i in range(3)
                },
                "argmax_distribution": {
                    "real": {str(i): int(sum(1 for r in records if r["label"] == "real"
                                             and int(np.argmax(r["A_global_probs"])) == i))
                             for i in range(3)},
                    "ai": {str(i): int(sum(1 for r in records if r["label"] == "ai"
                                           and int(np.argmax(r["A_global_probs"])) == i))
                           for i in range(3)},
                },
            },
            "paths": {
                "A_corrected_single_view": {
                    "description": "whole image -> 224, full softmax, AI class index as inferred above",
                    "global_model": {
                        **auroc_with_ci(labels, score_column(records, "A_global_probs", ai_g)),
                        **verdict_metrics(labels, score_column(records, "A_global_probs", ai_g)),
                    },
                    "local_model": {
                        **auroc_with_ci(labels, score_column(records, "A_local_probs", ai_l)),
                        **verdict_metrics(labels, score_column(records, "A_local_probs", ai_l)),
                    },
                },
                "B_extension_as_shipped": {
                    "description": "worker.ts verbatim: broken flat-index parse, probs[0], early-exit gate, 25/75 blend",
                    **auroc_with_ci(labels, b_scores),
                    **verdict_metrics(labels, b_scores),
                    "early_exit_rate": float(np.mean(
                        [0.0 if r["B_took_local_model"] else 1.0 for r in records])),
                    "score_spread": {
                        "min": float(np.min(b_scores)), "max": float(np.max(b_scores)),
                        "mean": float(np.mean(b_scores)), "std": float(np.std(b_scores)),
                    },
                },
                "C_extension_geometry_correct_parsing": {
                    "description": "same crops and 25/75 fusion as B, correct softmax and AI index",
                    **auroc_with_ci(labels, c_scores),
                    **verdict_metrics(labels, c_scores),
                    "early_exit_rate": float(np.mean(
                        [0.0 if r["C_took_local_model"] else 1.0 for r in records])),
                },
            },
            "per_generator": per_gen,
            "images": records,
        }

        # Cache logits so any re-analysis is free.
        np.savez_compressed(
            args.out.parent / "logits_{}.npz".format(variant),
            files=np.array([r["file"] for r in records]),
            labels=labels,
            global_whole=np.array([r["global_whole_logits"] for r in records]),
            local_whole=np.array([r["local_whole_logits"] for r in records]),
        )

    results["conclusions"] = build_conclusions(results)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("\n" + "=" * 66)
    for line in results["conclusions"]["summary"]:
        print(line)
    print("=" * 66)
    print("Wrote {}".format(args.out))


if __name__ == "__main__":
    main()
