"""
Train the local (patch-level) AI-image detector.

Usage:
    python scripts/train_local.py \
        --data_dir /path/to/dataset \
        --output_dir ./checkpoints/local \
        --epochs 20 \
        --batch_size 64 \
        --lr 1e-4

The local model processes 224x224 patches.  Training augmentations are
heavier than for the global model to improve robustness to partial crops.
"""

import argparse
import json
import os
from pathlib import Path

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as T
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder


IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]


def build_model(num_classes: int = 2) -> nn.Module:
    # EfficientNet-B0 is lighter than ResNet-50 and well-suited for patch classification
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    return model


def build_transforms(train: bool) -> T.Compose:
    if train:
        return T.Compose([
            T.RandomCrop(224, padding=16),
            T.RandomHorizontalFlip(),
            T.RandomVerticalFlip(),
            T.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2, hue=0.05),
            # Simulate JPEG recompression artifacts
            T.RandomApply([T.GaussianBlur(kernel_size=3)], p=0.3),
            T.ToTensor(),
            T.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ])
    return T.Compose([
        T.Resize(224),
        T.CenterCrop(224),
        T.ToTensor(),
        T.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])


def train_epoch(model, loader, optimizer, criterion, device):
    model.train()
    total_loss, correct, total = 0.0, 0, 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * images.size(0)
        correct += (outputs.argmax(1) == labels).sum().item()
        total += images.size(0)
    return total_loss / total, correct / total


@torch.no_grad()
def eval_epoch(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)
        total_loss += loss.item() * images.size(0)
        correct += (outputs.argmax(1) == labels).sum().item()
        total += images.size(0)
    return total_loss / total, correct / total


def main():
    parser = argparse.ArgumentParser(description="Train local patch-level AI-image detector")
    parser.add_argument("--data_dir",       required=True)
    parser.add_argument("--output_dir",     default="checkpoints/local")
    parser.add_argument("--epochs",         type=int, default=20)
    parser.add_argument("--batch_size",     type=int, default=64)
    parser.add_argument("--lr",             type=float, default=1e-4)
    parser.add_argument("--num_classes",    type=int, default=2)
    parser.add_argument("--ai_class_index", type=int, default=1)
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    train_ds = ImageFolder(Path(args.data_dir) / "train", transform=build_transforms(train=True))
    val_ds   = ImageFolder(Path(args.data_dir) / "val",   transform=build_transforms(train=False))
    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True,  num_workers=4, pin_memory=True)
    val_loader   = DataLoader(val_ds,   batch_size=args.batch_size, shuffle=False, num_workers=4, pin_memory=True)

    model = build_model(args.num_classes).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    criterion = nn.CrossEntropyLoss()

    best_val_acc = 0.0
    for epoch in range(1, args.epochs + 1):
        tr_loss, tr_acc = train_epoch(model, train_loader, optimizer, criterion, device)
        va_loss, va_acc = eval_epoch(model, val_loader, criterion, device)
        scheduler.step()
        print(f"Epoch {epoch}/{args.epochs}  train_loss={tr_loss:.4f}  train_acc={tr_acc:.4f}  "
              f"val_loss={va_loss:.4f}  val_acc={va_acc:.4f}")
        if va_acc > best_val_acc:
            best_val_acc = va_acc
            torch.save(model.state_dict(), Path(args.output_dir) / "best.pt")
            print(f"  -> Best checkpoint saved")

    meta = {
        "input_name": "input",
        "output_name": "output",
        "num_classes": args.num_classes,
        "ai_class_index": args.ai_class_index,
        "output_format": "softmax",
        "normalization": {"mean": IMAGENET_MEAN, "std": IMAGENET_STD},
        "input_size": 224,
    }
    with open(Path(args.output_dir) / "model_local_meta.json", "w") as f:
        json.dump(meta, f, indent=2)
    print(f"Best val accuracy: {best_val_acc:.4f}")


if __name__ == "__main__":
    main()
