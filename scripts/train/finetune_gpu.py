"""
Fine-tune DINOv2 for AI-image detection on content-matched pairs.

Written for a GTX 1660 Ti (6 GB, Turing, no tensor cores) but runs anywhere,
including CPU, at proportionally lower speed.

WHY THIS TRAINS ON MATCHED PAIRS
--------------------------------
An earlier run trained on COCO photographs versus ELSA renders and scored 0.975
on the in-distribution test split and 0.990 on a held-out generator. Both
numbers were close to meaningless. On content-matched pairs the same head
scored 0.659.

COCO is everyday scenes; ELSA prompts come from LAION web alt-text, so its
renders skew towards product shots, posters and badges. A classifier can
separate those two populations perfectly without learning anything about how an
image was made, and a generator holdout will not catch it: holding out SDXL
leaves the corpus seam untouched, so the shortcut sails through and gets
certified at 0.990.

Matched pairs remove the shortcut. Each pair is a LAION original and a render
made from that image's own alt-text, so subject matter is held constant and
only authenticity varies. The numbers are lower and they are real.

TWO SAFEGUARDS IN THE SPLITTING
-------------------------------
1. Splits are cut by pair_id, so a real image and the render derived from it
   never land on opposite sides. Otherwise content leaks across the split.
2. One generator family is held out entirely, so cross-generator transfer is
   measured rather than assumed.

Usage (see docs/TRAINING_GUIDE.md for the hand-held version):

    python scripts/train/finetune_gpu.py --epochs 8 --batch-size 16
"""
from __future__ import annotations

import argparse
import json
import random
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from sklearn.metrics import roc_auc_score
from torch.utils.data import DataLoader, Dataset
from transformers import AutoImageProcessor, AutoModel

# ---------------------------------------------------------------------------
# data
# ---------------------------------------------------------------------------

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


class PairDataset(Dataset):
    """Images from the matched corpus, with light train-time augmentation.

    Augmentation is deliberately restricted to flips and JPEG recompression.
    Colour jitter and blur would attack exactly the low-frequency statistics the
    detector depends on, and heavy geometric warping would change content.
    """

    def __init__(self, root: Path, records, size=224, train=False):
        self.root = root
        self.records = records
        self.size = size
        self.train = train
        self.mean = torch.tensor(IMAGENET_MEAN).view(3, 1, 1)
        self.std = torch.tensor(IMAGENET_STD).view(3, 1, 1)

    def __len__(self):
        return len(self.records)

    def _load(self, rec):
        sub = "real" if rec["label"] == "real" else "ai"
        return Image.open(self.root / sub / rec["file"]).convert("RGB")

    def __getitem__(self, i):
        rec = self.records[i]
        try:
            img = self._load(rec)
        except Exception:
            img = Image.new("RGB", (self.size, self.size), (127, 127, 127))

        if self.train:
            if random.random() < 0.5:
                img = img.transpose(Image.FLIP_LEFT_RIGHT)
            if random.random() < 0.3:
                import io
                buf = io.BytesIO()
                img.save(buf, "JPEG", quality=random.randint(55, 95))
                buf.seek(0)
                img = Image.open(buf).convert("RGB")

        img = img.resize((self.size, self.size), Image.BICUBIC)
        x = torch.from_numpy(np.asarray(img, dtype=np.float32).copy() / 255.0)
        x = x.permute(2, 0, 1)
        x = (x - self.mean) / self.std
        return x, torch.tensor(float(rec["label_int"]))


def build_splits(manifest, heldout_generator, seed=20260903):
    """Split by pair_id; send one generator family entirely to its own split."""
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


# ---------------------------------------------------------------------------
# model
# ---------------------------------------------------------------------------

class Detector(nn.Module):
    """Frozen-or-tuned DINOv2 trunk with a linear head over pooled patch tokens.

    Patch-mean pooling rather than the CLS token: on this data the patch mean
    measured better (0.910 vs 0.848 AUROC on the feasibility probe), which is
    consistent with generation artefacts being spread across the image rather
    than summarised into a single classification token.
    """

    def __init__(self, backbone="facebook/dinov2-small", unfreeze_last=4,
                 dropout=0.1):
        super().__init__()
        self.trunk = AutoModel.from_pretrained(backbone)
        dim = self.trunk.config.hidden_size

        for p in self.trunk.parameters():
            p.requires_grad_(False)
        if unfreeze_last > 0:
            for layer in self.trunk.encoder.layer[-unfreeze_last:]:
                for p in layer.parameters():
                    p.requires_grad_(True)
            for p in self.trunk.layernorm.parameters():
                p.requires_grad_(True)

        self.head = nn.Sequential(nn.Dropout(dropout), nn.Linear(dim, 1))

    def forward(self, x):
        h = self.trunk(pixel_values=x).last_hidden_state
        return self.head(h[:, 1:, :].mean(dim=1)).squeeze(-1)


# ---------------------------------------------------------------------------
# train / eval
# ---------------------------------------------------------------------------

@torch.no_grad()
def evaluate(model, loader, device, amp):
    model.eval()
    logits, labels = [], []
    for x, y in loader:
        x = x.to(device, non_blocking=True)
        with torch.autocast(device_type=device.type, dtype=torch.float16,
                            enabled=amp):
            out = model(x)
        logits.append(out.float().cpu())
        labels.append(y)
    logits = torch.cat(logits).numpy()
    labels = torch.cat(labels).numpy()
    p = 1 / (1 + np.exp(-logits))
    auc = (float(roc_auc_score(labels, p))
           if len(np.unique(labels)) > 1 else float("nan"))
    return auc, float(((p >= 0.5) == labels).mean()), logits, labels


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", type=Path,
                    default=Path("docs/benchmark/matched_corpus_v1"))
    ap.add_argument("--backbone", default="facebook/dinov2-small")
    ap.add_argument("--heldout-generator",
                    default="stabilityai/stable-diffusion-xl-base-1.0")
    ap.add_argument("--epochs", type=int, default=8)
    ap.add_argument("--batch-size", type=int, default=16)
    ap.add_argument("--lr-head", type=float, default=1e-3)
    ap.add_argument("--lr-trunk", type=float, default=1e-5)
    ap.add_argument("--unfreeze-last", type=int, default=4)
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--out", type=Path, default=Path("models/v2"))
    ap.add_argument("--no-amp", action="store_true")
    ap.add_argument("--limit-pairs", type=int, default=0,
                    help="smoke test: cap pairs per split (0 = use everything)")
    args = ap.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    amp = (device.type == "cuda") and not args.no_amp
    print("device: {}".format(device))
    if device.type == "cuda":
        print("  GPU: {}  ({:.1f} GB)".format(
            torch.cuda.get_device_name(0),
            torch.cuda.get_device_properties(0).total_memory / 1e9))
    else:
        print("  WARNING: no CUDA. This will run but slowly.")

    manifest = json.loads(
        (args.corpus / "manifest.json").read_text(encoding="utf-8"))
    splits = build_splits(manifest, args.heldout_generator)

    if args.limit_pairs:
        # Smoke path: exercise every stage of the pipeline in a couple of
        # minutes so a crash surfaces before a long unattended run, not during.
        splits = {k: v[: args.limit_pairs * 2] for k, v in splits.items()}
        print("SMOKE TEST: capped at {} pairs per split".format(args.limit_pairs))
    for k, v in splits.items():
        n_ai = sum(1 for r in v if r["label_int"] == 1)
        print("  {:<14s} {:>5d}  ({} ai / {} real)".format(
            k, len(v), n_ai, len(v) - n_ai))

    loaders = {
        k: DataLoader(PairDataset(args.corpus, v, train=(k == "train")),
                      batch_size=args.batch_size, shuffle=(k == "train"),
                      num_workers=args.workers, pin_memory=(device.type == "cuda"),
                      drop_last=(k == "train"))
        for k, v in splits.items() if v
    }

    model = Detector(args.backbone, args.unfreeze_last).to(device)
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print("  trainable params: {:.2f}M of {:.2f}M".format(
        trainable / 1e6, sum(p.numel() for p in model.parameters()) / 1e6))

    trunk_params = [p for p in model.trunk.parameters() if p.requires_grad]
    opt = torch.optim.AdamW(
        [{"params": model.head.parameters(), "lr": args.lr_head},
         {"params": trunk_params, "lr": args.lr_trunk}], weight_decay=0.05)
    steps = max(1, len(loaders["train"])) * args.epochs
    sched = torch.optim.lr_scheduler.OneCycleLR(
        opt, max_lr=[args.lr_head, args.lr_trunk], total_steps=steps,
        pct_start=0.25)
    scaler = torch.amp.GradScaler("cuda", enabled=amp)
    lossfn = nn.BCEWithLogitsLoss()

    args.out.mkdir(parents=True, exist_ok=True)
    best_auc, history = -1.0, []

    for epoch in range(1, args.epochs + 1):
        model.train()
        t0, running, seen = time.time(), 0.0, 0
        for x, y in loaders["train"]:
            x, y = x.to(device, non_blocking=True), y.to(device, non_blocking=True)
            opt.zero_grad(set_to_none=True)
            with torch.autocast(device_type=device.type, dtype=torch.float16,
                                enabled=amp):
                loss = lossfn(model(x), y)
            scaler.scale(loss).backward()
            scaler.step(opt)
            scaler.update()
            sched.step()
            running += loss.item() * len(y)
            seen += len(y)

        val_auc, val_acc, _, _ = evaluate(model, loaders["val"], device, amp)
        history.append({"epoch": epoch, "train_loss": running / max(seen, 1),
                        "val_auroc": val_auc, "val_acc": val_acc,
                        "sec": round(time.time() - t0, 1)})
        print("epoch {:>2d}  loss {:.4f}  val AUROC {:.4f}  acc {:.3f}  ({:.0f}s)".format(
            epoch, running / max(seen, 1), val_auc, val_acc, time.time() - t0),
            flush=True)

        if val_auc > best_auc:
            best_auc = val_auc
            # Store only plain types. Path objects pickle as WindowsPath, which
            # torch.load refuses under its weights_only default since 2.6.
            safe_args = {k: (str(v) if isinstance(v, Path) else v)
                         for k, v in vars(args).items()}
            torch.save({"model": model.state_dict(), "args": safe_args,
                        "epoch": epoch, "val_auroc": val_auc},
                       args.out / "detector_best.pt")
            print("    saved new best")

    ckpt = torch.load(args.out / "detector_best.pt", map_location=device)
    model.load_state_dict(ckpt["model"])

    report = {
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "backbone": args.backbone,
        "heldout_generator": args.heldout_generator,
        "device": str(device),
        "epochs": args.epochs,
        "best_val_auroc": best_auc,
        "history": history,
        "splits": {k: len(v) for k, v in splits.items()},
        "results": {},
    }
    for name in ("val", "test", "test_heldout"):
        if name in loaders:
            auc, acc, _, _ = evaluate(model, loaders[name], device, amp)
            report["results"][name] = {"auroc": round(auc, 4),
                                       "accuracy": round(acc, 4)}
            print("{:<14s} AUROC {:.4f}  acc {:.4f}".format(name, auc, acc))

    (args.out / "training_report.json").write_text(
        json.dumps(report, indent=2), encoding="utf-8")
    print("\nWrote {}".format(args.out / "training_report.json"))
    print("Checkpoint: {}".format(args.out / "detector_best.pt"))


if __name__ == "__main__":
    main()
