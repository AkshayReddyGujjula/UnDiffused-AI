"""
Robustness check on the v1 baseline's central negative result.

The baseline says both checkpoints score at chance. That conclusion is only
sound if the preprocessing matches what they were trained with. The ONNX tensors
are named `pixel_values` / `logits`, which is HuggingFace `transformers`
convention -- and HF's default ViTImageProcessor normalises with mean = std =
0.5, not with ImageNet statistics. The extension uses ImageNet statistics. If
the checkpoints wanted 0.5/0.5, "no signal" would be an artefact of our own
preprocessing rather than a property of the models.

So: sweep the plausible normalisations and resize policies, and check whether
any of them recovers signal. Also report how much the logits vary at all, since
a head that emits near-constant output is a different failure from a head that
is merely miscalibrated.

Usage:  python normalization_probe.py     (from scripts/bench)
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
from sklearn.metrics import roc_auc_score

import extension_replica as ext

EVAL = Path("../../docs/benchmark/eval_set_v1")
MODELS = Path("../../public/models")
OUT = Path("../../docs/benchmark/normalization_probe.json")

NORMALIZATIONS = {
    "imagenet": ([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    "half_hf_vit_default": ([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),
    "clip": ([0.4815, 0.4578, 0.4082], [0.2686, 0.2613, 0.2758]),
    "unit_range_0_1": ([0.0, 0.0, 0.0], [1.0, 1.0, 1.0]),
    "raw_0_255": ([0.0, 0.0, 0.0], [1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0]),
}

RESIZES = {
    "squash_224": "whole image forced to 224x224 (what the extension does)",
    "shortside_resize_centercrop_224": "resize short side to 224, then centre crop",
}


def preprocess(img: Image.Image, mean, std, policy: str) -> np.ndarray:
    if policy == "squash_224":
        patch = img.resize((224, 224), Image.BILINEAR)
    else:
        w, h = img.size
        scale = 224 / min(w, h)
        patch = img.resize((max(224, round(w * scale)), max(224, round(h * scale))),
                           Image.BILINEAR)
        left = (patch.width - 224) // 2
        top = (patch.height - 224) // 2
        patch = patch.crop((left, top, left + 224, top + 224))

    arr = np.asarray(patch, dtype=np.float32) / 255.0
    arr = (arr - np.array(mean, dtype=np.float32)) / np.array(std, dtype=np.float32)
    return np.transpose(arr, (2, 0, 1))


def main() -> None:
    manifest = json.loads((EVAL / "manifest.json").read_text(encoding="utf-8"))
    images = manifest["images"]
    labels = np.array([m["label_int"] for m in images])

    sessions = {}
    for name in ("global", "local"):
        p = MODELS / "model_{}_quantized.onnx".format(name)
        s = ort.InferenceSession(str(p), providers=["CPUExecutionProvider"])
        sessions[name] = (s, s.get_inputs()[0].name, s.get_outputs()[0].name)

    loaded = []
    for m in images:
        path = EVAL / ("real" if m["label"] == "real" else "ai") / m["file"]
        loaded.append(Image.open(path).convert("RGB"))

    results = {
        "purpose": ("Does any plausible preprocessing recover signal from the shipped "
                    "checkpoints? If not, the chance-level v1 baseline is a property "
                    "of the models rather than of our preprocessing."),
        "normalizations": {k: {"mean": v[0], "std": v[1]} for k, v in NORMALIZATIONS.items()},
        "resize_policies": RESIZES,
        "sweep": {},
    }

    best = (None, -1.0)
    for policy in RESIZES:
        for norm, (mean, std) in NORMALIZATIONS.items():
            key = "{}|{}".format(policy, norm)
            batch = np.stack([preprocess(im, mean, std, policy) for im in loaded])

            entry = {}
            for model in ("global", "local"):
                sess, iname, oname = sessions[model]
                logits = np.concatenate([
                    sess.run([oname], {iname: batch[i:i + 20].astype(np.float32)})[0]
                    for i in range(0, len(batch), 20)
                ]).astype(np.float64)
                probs = ext.softmax(logits)

                per_class = {}
                for c in range(probs.shape[1]):
                    auc = float(roc_auc_score(labels, probs[:, c]))
                    per_class["class_{}".format(c)] = round(auc, 4)
                    # Track the strongest separation in either direction: an
                    # AUROC of 0.10 is as much signal as 0.90, just inverted.
                    if abs(auc - 0.5) > abs(best[1] - 0.5) or best[0] is None:
                        best = ("{} / {} / class_{}".format(key, model, c), auc)

                entry[model] = {
                    "auroc_per_class": per_class,
                    "logit_std_across_images": [round(float(x), 4) for x in logits.std(axis=0)],
                    "logit_mean": [round(float(x), 4) for x in logits.mean(axis=0)],
                    "mean_max_prob": round(float(probs.max(axis=1).mean()), 4),
                }
            results["sweep"][key] = entry
            print("{:<48s} global={} local={}".format(
                key,
                list(entry["global"]["auroc_per_class"].values()),
                list(entry["local"]["auroc_per_class"].values())))

    results["strongest_separation_found"] = {
        "where": best[0], "auroc": round(best[1], 4),
        "distance_from_chance": round(abs(best[1] - 0.5), 4),
    }
    OUT.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("\nStrongest separation anywhere in the sweep: {} -> AUROC {:.4f}".format(
        best[0], best[1]))
    print("Wrote {}".format(OUT))


if __name__ == "__main__":
    main()
