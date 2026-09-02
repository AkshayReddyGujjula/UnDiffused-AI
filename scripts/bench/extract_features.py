"""
Stage 4 (scaled): extract frozen DINOv2 features once, cache them forever.

This is the only compute-intensive step, and it is a forward pass rather than a
training run -- which is exactly why the whole plan fits on a machine with no
GPU. Once embeddings are cached, every modelling experiment downstream (a
different head, a different calibration, a different threshold) is a matter of
seconds on a small matrix.

Two representations are stored per image, because the choice between them is an
empirical question rather than an obvious one:

    cls    the [CLS] token          (384-d for ViT-S/14)
    mean   mean over patch tokens   (384-d)

The DINOv2 paper's linear-probe recipe concatenates the two, so the cached
768-d concatenation is available without a second forward pass. Which one wins
is decided in Stage 5 by measurement.

Both the training corpus and eval_set_v1 are extracted, so the new head can be
scored on the exact 100 images that produced the v1 baseline of 0.50 AUROC.
"""
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModel

MODELS = {
    "dinov2-small": "facebook/dinov2-small",
    "dinov2-base": "facebook/dinov2-base",
}


def load_backbone(key: str):
    repo = MODELS[key]
    processor = AutoImageProcessor.from_pretrained(repo)
    model = AutoModel.from_pretrained(repo)
    model.eval()
    for p in model.parameters():
        p.requires_grad_(False)
    return processor, model


def iter_batches(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]


@torch.no_grad()
def embed(paths, processor, model, batch_size, log_every=500):
    """Return (cls, mean, ok_mask). Unreadable images are masked out, not dropped,
    so indices stay aligned with the manifest."""
    cls_out, mean_out, ok = [], [], []
    t0 = time.time()
    done = 0

    for batch in iter_batches(paths, batch_size):
        imgs, valid = [], []
        for p in batch:
            try:
                imgs.append(Image.open(p).convert("RGB"))
                valid.append(True)
            except Exception:
                valid.append(False)

        if imgs:
            inputs = processor(images=imgs, return_tensors="pt")
            out = model(**inputs)
            h = out.last_hidden_state              # [B, 1 + patches, D]
            b_cls = h[:, 0, :].numpy()
            b_mean = h[:, 1:, :].mean(dim=1).numpy()
        else:
            b_cls = b_mean = None

        k = 0
        dim = model.config.hidden_size
        for v in valid:
            if v:
                cls_out.append(b_cls[k])
                mean_out.append(b_mean[k])
                k += 1
            else:
                cls_out.append(np.zeros(dim, dtype=np.float32))
                mean_out.append(np.zeros(dim, dtype=np.float32))
            ok.append(v)

        done += len(batch)
        if done % log_every < batch_size:
            rate = (time.time() - t0) / max(done, 1)
            remain = (len(paths) - done) * rate
            print("    {}/{}  {:.3f}s/img  eta {:.0f}s".format(
                done, len(paths), rate, remain), flush=True)

    return (np.asarray(cls_out, dtype=np.float32),
            np.asarray(mean_out, dtype=np.float32),
            np.asarray(ok, dtype=bool))


def extract_corpus(corpus_dir: Path, out_dir: Path, key, processor, model, bs):
    manifest = json.loads(
        (corpus_dir / "corpus_manifest.json").read_text(encoding="utf-8"))
    records = manifest["images"]

    by_split = {}
    for r in records:
        by_split.setdefault(r["split"], []).append(r)

    for split, rows in sorted(by_split.items()):
        dest = out_dir / "{}_{}.npz".format(key, split)
        if dest.exists():
            print("  {} exists, skipping".format(dest.name))
            continue
        print("  split '{}': {} images".format(split, len(rows)))
        paths = [corpus_dir / r["relpath"] for r in rows]
        cls, mean, ok = embed(paths, processor, model, bs)
        np.savez_compressed(
            dest,
            cls=cls, mean=mean, ok=ok,
            labels=np.array([r["label_int"] for r in rows]),
            files=np.array([r["file"] for r in rows]),
            generators=np.array([r["generator"] or "" for r in rows]),
        )
        print("  wrote {}  ({} usable)".format(dest.name, int(ok.sum())))


def extract_eval_set(eval_dir: Path, out_dir: Path, key, processor, model, bs):
    """The 100 images that produced the v1 baseline, so before/after is exact."""
    dest = out_dir / "{}_evalset_v1.npz".format(key)
    if dest.exists():
        print("  {} exists, skipping".format(dest.name))
        return
    manifest = json.loads((eval_dir / "manifest.json").read_text(encoding="utf-8"))
    rows = manifest["images"]
    paths = [eval_dir / ("real" if r["label"] == "real" else "ai") / r["file"]
             for r in rows]
    print("  eval_set_v1: {} images".format(len(rows)))
    cls, mean, ok = embed(paths, processor, model, bs)
    np.savez_compressed(
        dest, cls=cls, mean=mean, ok=ok,
        labels=np.array([r["label_int"] for r in rows]),
        files=np.array([r["file"] for r in rows]),
        generators=np.array([r["generator"] or "" for r in rows]),
    )
    print("  wrote {}".format(dest.name))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--backbones", nargs="+", default=["dinov2-small"],
                    choices=list(MODELS))
    ap.add_argument("--corpus", type=Path, default=Path("docs/benchmark/corpus_v1"))
    ap.add_argument("--eval-dir", type=Path,
                    default=Path("docs/benchmark/eval_set_v1"))
    ap.add_argument("--out", type=Path,
                    default=Path("docs/benchmark/corpus_v1/features"))
    ap.add_argument("--batch-size", type=int, default=16)
    ap.add_argument("--threads", type=int, default=0,
                    help="torch CPU threads; 0 leaves the default")
    args = ap.parse_args()

    if args.threads:
        torch.set_num_threads(args.threads)
    args.out.mkdir(parents=True, exist_ok=True)

    for key in args.backbones:
        print("\n=== backbone: {} ===".format(key))
        t0 = time.time()
        processor, model = load_backbone(key)
        print("  loaded {:.1f}M params in {:.1f}s".format(
            sum(p.numel() for p in model.parameters()) / 1e6, time.time() - t0))

        extract_eval_set(args.eval_dir, args.out, key, processor, model,
                         args.batch_size)
        if (args.corpus / "corpus_manifest.json").exists():
            extract_corpus(args.corpus, args.out, key, processor, model,
                           args.batch_size)
        else:
            print("  corpus manifest not present yet; skipped")

    print("\nFeature cache: {}".format(args.out))


if __name__ == "__main__":
    main()
