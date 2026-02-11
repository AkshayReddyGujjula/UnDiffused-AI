"""
UnDiffused Training Script - Production Pipeline
=================================================
State-of-the-art AI-generated image detector using:
- EfficientNet-B4 backbone with CBAM attention
- Multi-head classifier (Binary + Generator classification)
- Focal Loss with label smoothing
- Heavy data augmentation (JPEG compression, MixUp, CutMix)

Optimized for GTX 1660 Ti (6GB VRAM) with:
- 384x384 input resolution
- Batch size 4-6 with gradient accumulation
- Mixed precision training (AMP)
- Extensive debug logging

Usage:
    # Full training
    python scripts/train.py --batch-size 4 --accumulate 8 --epochs 100
    
    # Quick validation test (<30 min)
    python scripts/train.py --test --epochs 3 --batch-size 4
    
    # Resume training
    python scripts/train.py --resume --checkpoint lightning_logs/version_X/checkpoints/last.ckpt

Author: UnDiffused Team
Hardware Target: NVIDIA GTX 1660 Ti (6GB VRAM), Intel i5-10400F
"""

import os
import sys
import argparse
import time
import json
from pathlib import Path
from datetime import datetime
from typing import Optional, Tuple, Dict, Any

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader, random_split
import pytorch_lightning as pl
from pytorch_lightning.callbacks import (
    ModelCheckpoint, 
    EarlyStopping, 
    LearningRateMonitor,
    RichProgressBar
)
from pytorch_lightning.loggers import TensorBoardLogger

import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from sklearn.metrics import (
    accuracy_score, 
    precision_recall_fscore_support,
    confusion_matrix,
    roc_auc_score
)
from tqdm import tqdm

# Local imports
from models import (
    EfficientNetB4Detector, 
    MultiTaskLoss, 
    EfficientNetB4DetectorONNX,
    MultiHeadClassifier
)
from augmentations import (
    JPEGCompression, 
    GaussianNoise, 
    MixUpCutMix,
    mixup_criterion
)


# =============================================================================
# Configuration
# =============================================================================

# Dataset path
DATASET_PATH = Path(r"D:\Datasets")

# Image settings
IMAGE_SIZE = 384  # Higher resolution for forensic detail preservation

# Training defaults (optimized for 6GB VRAM)
DEFAULT_BATCH_SIZE = 4      # Safe for 6GB VRAM at 384x384
DEFAULT_ACCUMULATE = 8      # Effective batch = 4 * 8 = 32
DEFAULT_EPOCHS = 100
DEFAULT_LR = 3e-5
DEFAULT_WORKERS = 8         # i5-10400F has 12 threads

# Generator classes (matching model definition)
GENERATORS = MultiHeadClassifier.GENERATORS


# =============================================================================
# Dataset
# =============================================================================

class AIImageDataset(Dataset):
    """
    Dataset for AI-generated image detection.
    
    Expects directory structure:
        D:\Datasets\
        ├── train\
        │   ├── REAL\
        │   │   └── *.jpg/png/webp
        │   └── FAKE\
        │       └── *.jpg/png/webp (or subdirectories by generator)
        └── (val\, test\ optional - will auto-split if not present)
    
    For generator classification, place images in subdirectories:
        FAKE\midjourney\*.jpg
        FAKE\flux\*.jpg
        etc.
    
    If no subdirectories, all AI images are labeled as 'other'.
    """
    
    def __init__(
        self, 
        root_dir: Path,
        transform=None,
        test_mode: bool = False,
        max_samples: int = None
    ):
        self.root_dir = Path(root_dir)
        self.transform = transform
        self.samples = []  # [(path, binary_label, generator_label), ...]
        
        print(f"\n[DEBUG] Loading dataset from: {self.root_dir}")
        
        # Load REAL images (binary=0, generator=0 meaning 'real')
        real_dir = self.root_dir / "REAL"
        if real_dir.exists():
            real_images = self._find_images(real_dir)
            if test_mode:
                real_images = real_images[:200]
            for path in real_images:
                self.samples.append((str(path), 0, 0))  # Real
            print(f"[DEBUG] Found {len(real_images)} REAL images")
        else:
            print(f"[WARNING] REAL directory not found: {real_dir}")
        
        # Load FAKE images (binary=1, generator=class_id)
        fake_dir = self.root_dir / "FAKE"
        if fake_dir.exists():
            fake_count = 0
            generator_counts = {g: 0 for g in GENERATORS}
            
            # Check for generator subdirectories
            subdirs = [d for d in fake_dir.iterdir() if d.is_dir()]
            
            if subdirs:
                # Generator-organized structure
                print(f"[DEBUG] Found {len(subdirs)} generator subdirectories")
                for subdir in subdirs:
                    gen_name = subdir.name.lower()
                    
                    # Map to generator index
                    if 'midjourney' in gen_name or 'mj' in gen_name:
                        gen_idx = 1
                    elif 'flux' in gen_name:
                        gen_idx = 2
                    elif 'dalle' in gen_name or 'dall-e' in gen_name:
                        gen_idx = 3
                    elif 'sd' in gen_name or 'stable' in gen_name:
                        gen_idx = 4
                    elif 'firefly' in gen_name or 'adobe' in gen_name:
                        gen_idx = 5
                    else:
                        gen_idx = 6  # 'other'
                    
                    images = self._find_images(subdir)
                    if test_mode:
                        images = images[:50]
                    for path in images:
                        self.samples.append((str(path), 1, gen_idx))
                        fake_count += 1
                        generator_counts[GENERATORS[gen_idx]] += 1
                        
            else:
                # All FAKE images without generator info
                images = self._find_images(fake_dir)
                if test_mode:
                    images = images[:200]
                for path in images:
                    self.samples.append((str(path), 1, 6))  # 'other' generator
                    fake_count += 1
                generator_counts['other'] = fake_count
            
            print(f"[DEBUG] Found {fake_count} FAKE images")
            print(f"[DEBUG] Generator distribution: {generator_counts}")
        else:
            print(f"[WARNING] FAKE directory not found: {fake_dir}")
        
        # Apply max_samples limit
        if max_samples and len(self.samples) > max_samples:
            np.random.shuffle(self.samples)
            self.samples = self.samples[:max_samples]
            print(f"[DEBUG] Limited to {max_samples} samples")
        
        # Final summary
        real_count = sum(1 for _, b, _ in self.samples if b == 0)
        fake_count = sum(1 for _, b, _ in self.samples if b == 1)
        print(f"[DEBUG] Total: {len(self.samples)} samples ({real_count} Real, {fake_count} Fake)")
        
    def _find_images(self, directory: Path) -> list:
        """Find all image files in directory (recursive)."""
        extensions = {'*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG', '*.WEBP'}
        images = []
        for ext in extensions:
            images.extend(directory.rglob(ext))
        return sorted(images)
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        path, binary_label, generator_label = self.samples[idx]
        
        try:
            img = Image.open(path).convert('RGB')
        except Exception as e:
            print(f"[ERROR] Failed to load {path}: {e}")
            # Return blank image on error
            img = Image.new('RGB', (IMAGE_SIZE, IMAGE_SIZE), color=(128, 128, 128))
        
        if self.transform:
            img = self.transform(img)
        
        return (
            img,
            torch.tensor(binary_label, dtype=torch.float32).unsqueeze(0),
            torch.tensor(generator_label, dtype=torch.long)
        )


# =============================================================================
# Data Module
# =============================================================================

class AIImageDataModule(pl.LightningDataModule):
    """
    PyTorch Lightning DataModule for AI Image Detection.
    
    Handles:
    - Train/Val/Test splits
    - Different transforms for training and validation
    - DataLoader configuration optimized for i5-10400F
    """
    
    def __init__(
        self,
        data_dir: Path = DATASET_PATH,
        batch_size: int = DEFAULT_BATCH_SIZE,
        num_workers: int = DEFAULT_WORKERS,
        image_size: int = IMAGE_SIZE,
        test_mode: bool = False,
        val_split: float = 0.15,
        test_split: float = 0.15
    ):
        super().__init__()
        self.data_dir = Path(data_dir)
        self.batch_size = batch_size
        self.num_workers = num_workers
        self.image_size = image_size
        self.test_mode = test_mode
        self.val_split = val_split
        self.test_split = test_split
        
        # Transforms
        self.train_transform = self._get_train_transform()
        self.val_transform = self._get_val_transform()
        
    def _get_train_transform(self):
        """Heavy augmentation pipeline for training."""
        return transforms.Compose([
            # JPEG compression simulation (before other transforms)
            JPEGCompression(quality_range=(40, 95)),
            
            # Resize and crop
            transforms.Resize((self.image_size + 48, self.image_size + 48)),
            transforms.RandomResizedCrop(
                self.image_size, 
                scale=(0.8, 1.0),
                ratio=(0.9, 1.1)
            ),
            
            # Geometric augmentations
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(degrees=15),
            
            # Color augmentations (aggressive for robustness)
            transforms.ColorJitter(
                brightness=0.3,
                contrast=0.3,
                saturation=0.2,
                hue=0.05
            ),
            
            # Random erasing (CutOut-style)
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            ),
            transforms.RandomErasing(p=0.3, scale=(0.02, 0.15)),
            
            # Gaussian noise (on tensor)
            GaussianNoise(std_range=(0.01, 0.03), p=0.2),
        ])
    
    def _get_val_transform(self):
        """Simple transform for validation/testing."""
        return transforms.Compose([
            transforms.Resize((self.image_size, self.image_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            ),
        ])
        
    def setup(self, stage: Optional[str] = None):
        """Set up train/val/test datasets."""
        print(f"\n[DEBUG] Setting up data module (stage={stage})")
        
        # Check for pre-split directories
        train_dir = self.data_dir / "train"
        val_dir = self.data_dir / "val"
        test_dir = self.data_dir / "test"
        
        if train_dir.exists() and (val_dir.exists() or test_dir.exists()):
            # Use pre-split structure
            print("[DEBUG] Using pre-split directory structure")
            if stage == 'fit' or stage is None:
                self.train_dataset = AIImageDataset(
                    train_dir, 
                    transform=self.train_transform,
                    test_mode=self.test_mode
                )
                if val_dir.exists():
                    self.val_dataset = AIImageDataset(
                        val_dir,
                        transform=self.val_transform,
                        test_mode=self.test_mode
                    )
                else:
                    # Auto-split from train
                    self._auto_split_val()
                    
            if stage == 'test' or stage is None:
                if test_dir.exists():
                    self.test_dataset = AIImageDataset(
                        test_dir,
                        transform=self.val_transform,
                        test_mode=self.test_mode
                    )
        else:
            # Auto-split from single directory
            print("[DEBUG] Auto-splitting dataset (no pre-split directories found)")
            
            # Check if REAL/FAKE are directly in data_dir
            if (self.data_dir / "REAL").exists() or (self.data_dir / "FAKE").exists():
                full_dataset = AIImageDataset(
                    self.data_dir,
                    transform=None,  # Transform applied later
                    test_mode=self.test_mode
                )
            else:
                # Look in train subdirectory
                full_dataset = AIImageDataset(
                    train_dir if train_dir.exists() else self.data_dir,
                    transform=None,
                    test_mode=self.test_mode
                )
            
            # Calculate split sizes
            total = len(full_dataset)
            test_size = int(total * self.test_split)
            val_size = int(total * self.val_split)
            train_size = total - val_size - test_size
            
            print(f"[DEBUG] Splitting: {train_size} train, {val_size} val, {test_size} test")
            
            # Split indices
            indices = list(range(total))
            np.random.seed(42)  # Reproducible splits
            np.random.shuffle(indices)
            
            train_indices = indices[:train_size]
            val_indices = indices[train_size:train_size + val_size]
            test_indices = indices[train_size + val_size:]
            
            # Create subset datasets with transforms
            if stage == 'fit' or stage is None:
                self.train_dataset = SubsetWithTransform(
                    full_dataset, train_indices, self.train_transform
                )
                self.val_dataset = SubsetWithTransform(
                    full_dataset, val_indices, self.val_transform
                )
                
            if stage == 'test' or stage is None:
                self.test_dataset = SubsetWithTransform(
                    full_dataset, test_indices, self.val_transform
                )
        
        print(f"[DEBUG] Dataset setup complete")
        
    def train_dataloader(self):
        return DataLoader(
            self.train_dataset,
            batch_size=self.batch_size,
            shuffle=True,
            num_workers=self.num_workers,
            pin_memory=True,
            persistent_workers=True if self.num_workers > 0 else False,
            drop_last=True  # Important for batch normalization
        )
    
    def val_dataloader(self):
        return DataLoader(
            self.val_dataset,
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=self.num_workers,
            pin_memory=True,
            persistent_workers=True if self.num_workers > 0 else False
        )
    
    def test_dataloader(self):
        return DataLoader(
            self.test_dataset,
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=self.num_workers,
            pin_memory=True
        )


class SubsetWithTransform(Dataset):
    """Subset of a dataset with separate transform."""
    
    def __init__(self, dataset: Dataset, indices: list, transform):
        self.dataset = dataset
        self.indices = indices
        self.transform = transform
        
    def __len__(self):
        return len(self.indices)
    
    def __getitem__(self, idx):
        path, binary_label, generator_label = self.dataset.samples[self.indices[idx]]
        
        try:
            img = Image.open(path).convert('RGB')
        except Exception:
            img = Image.new('RGB', (IMAGE_SIZE, IMAGE_SIZE), color=(128, 128, 128))
        
        if self.transform:
            img = self.transform(img)
        
        return (
            img,
            torch.tensor(binary_label, dtype=torch.float32).unsqueeze(0),
            torch.tensor(generator_label, dtype=torch.long)
        )


# =============================================================================
# Lightning Module
# =============================================================================

class AIImageDetectorModule(pl.LightningModule):
    """
    PyTorch Lightning module for AI Image Detection.
    
    Features:
    - EfficientNet-B4 backbone with CBAM
    - Multi-task learning (Binary + Generator)
    - Focal Loss with label smoothing
    - MixUp/CutMix augmentation
    - Comprehensive logging
    """
    
    def __init__(
        self,
        learning_rate: float = DEFAULT_LR,
        weight_decay: float = 1e-2,
        use_mixup_cutmix: bool = True,
        warmup_epochs: int = 5,
        max_epochs: int = DEFAULT_EPOCHS
    ):
        super().__init__()
        self.save_hyperparameters()
        
        # Model
        print("[DEBUG] Initializing detector model...")
        self.model = EfficientNetB4Detector(pretrained=True, use_cbam=True)
        
        # Loss function
        self.criterion = MultiTaskLoss(
            alpha=0.7,  # Weight for binary loss
            beta=0.3,   # Weight for generator loss
            focal_gamma=2.0,
            focal_alpha=0.25,
            label_smoothing=0.1
        )
        
        # MixUp/CutMix
        self.use_mixup_cutmix = use_mixup_cutmix
        if use_mixup_cutmix:
            self.mixup_cutmix = MixUpCutMix(
                mixup_alpha=0.4,
                cutmix_alpha=1.0,
                mixup_prob=0.2,
                cutmix_prob=0.2
            )
            print("[DEBUG] MixUp/CutMix enabled (p=0.4)")
        
        # Metrics storage
        self.training_step_outputs = []
        self.validation_step_outputs = []
        self.test_step_outputs = []
        
    def forward(self, x):
        return self.model(x)
    
    def training_step(self, batch, batch_idx):
        images, binary_targets, generator_targets = batch
        
        # Apply MixUp/CutMix (only affects binary classification)
        if self.use_mixup_cutmix and self.training:
            (
                images, 
                binary_a, binary_b,
                gen_a, gen_b,
                lam,
                augmented
            ) = self.mixup_cutmix(images, binary_targets, generator_targets)
            
            # Forward pass
            binary_logits, generator_logits = self.model(images)
            
            if augmented:
                # MixUp/CutMix: Only compute binary loss (generator labels are ambiguous)
                mixed_binary_targets = lam * binary_a + (1 - lam) * binary_b
                binary_loss = self.criterion.focal_loss(binary_logits, mixed_binary_targets)
                total_loss = binary_loss
                gen_loss = torch.tensor(0.0, device=binary_loss.device)
            else:
                total_loss, binary_loss, gen_loss = self.criterion(
                    binary_logits, generator_logits,
                    binary_targets, generator_targets
                )
        else:
            # Standard forward pass
            binary_logits, generator_logits = self.model(images)
            total_loss, binary_loss, gen_loss = self.criterion(
                binary_logits, generator_logits,
                binary_targets, generator_targets
            )
        
        # Calculate accuracy
        with torch.no_grad():
            binary_preds = (torch.sigmoid(binary_logits) > 0.5).float()
            binary_acc = (binary_preds == binary_targets).float().mean()
            
            gen_preds = generator_logits.argmax(dim=1)
            gen_acc = (gen_preds == generator_targets).float().mean()
        
        # Log metrics
        self.log('train/loss', total_loss, prog_bar=True)
        self.log('train/binary_loss', binary_loss)
        self.log('train/gen_loss', gen_loss)
        self.log('train/binary_acc', binary_acc, prog_bar=True)
        self.log('train/gen_acc', gen_acc)
        
        # Debug output every 50 batches
        if batch_idx % 50 == 0:
            print(f"  [TRAIN] Batch {batch_idx}: loss={total_loss:.4f}, "
                  f"binary_acc={binary_acc:.2%}, gen_acc={gen_acc:.2%}")
        
        return total_loss
    
    def validation_step(self, batch, batch_idx):
        images, binary_targets, generator_targets = batch
        
        # Forward pass
        binary_logits, generator_logits = self.model(images)
        total_loss, binary_loss, gen_loss = self.criterion(
            binary_logits, generator_logits,
            binary_targets, generator_targets
        )
        
        # Calculate predictions
        binary_probs = torch.sigmoid(binary_logits)
        binary_preds = (binary_probs > 0.5).float()
        gen_preds = generator_logits.argmax(dim=1)
        
        # Store for epoch-end metrics
        self.validation_step_outputs.append({
            'loss': total_loss,
            'binary_loss': binary_loss,
            'gen_loss': gen_loss,
            'binary_preds': binary_preds.cpu(),
            'binary_targets': binary_targets.cpu(),
            'binary_probs': binary_probs.cpu(),
            'gen_preds': gen_preds.cpu(),
            'gen_targets': generator_targets.cpu()
        })
        
        return total_loss
    
    def on_validation_epoch_end(self):
        if not self.validation_step_outputs:
            return
            
        # Aggregate predictions
        all_binary_preds = torch.cat([x['binary_preds'] for x in self.validation_step_outputs])
        all_binary_targets = torch.cat([x['binary_targets'] for x in self.validation_step_outputs])
        all_binary_probs = torch.cat([x['binary_probs'] for x in self.validation_step_outputs])
        all_gen_preds = torch.cat([x['gen_preds'] for x in self.validation_step_outputs])
        all_gen_targets = torch.cat([x['gen_targets'] for x in self.validation_step_outputs])
        
        # Calculate metrics
        binary_acc = accuracy_score(
            all_binary_targets.numpy().flatten(),
            all_binary_preds.numpy().flatten()
        )
        
        precision, recall, f1, _ = precision_recall_fscore_support(
            all_binary_targets.numpy().flatten(),
            all_binary_preds.numpy().flatten(),
            average='binary',
            zero_division=0
        )
        
        try:
            auc = roc_auc_score(
                all_binary_targets.numpy().flatten(),
                all_binary_probs.numpy().flatten()
            )
        except ValueError:
            auc = 0.0
        
        gen_acc = accuracy_score(
            all_gen_targets.numpy(),
            all_gen_preds.numpy()
        )
        
        # Average losses
        avg_loss = torch.stack([x['loss'] for x in self.validation_step_outputs]).mean()
        avg_binary_loss = torch.stack([x['binary_loss'] for x in self.validation_step_outputs]).mean()
        avg_gen_loss = torch.stack([x['gen_loss'] for x in self.validation_step_outputs]).mean()
        
        # Log metrics
        self.log('val/loss', avg_loss, prog_bar=True)
        self.log('val/binary_loss', avg_binary_loss)
        self.log('val/gen_loss', avg_gen_loss)
        self.log('val/binary_acc', binary_acc, prog_bar=True)
        self.log('val/precision', precision)
        self.log('val/recall', recall)
        self.log('val/f1', f1)
        self.log('val/auc', auc)
        self.log('val/gen_acc', gen_acc)
        
        # Debug output
        print(f"\n[VAL] Epoch {self.current_epoch}: "
              f"loss={avg_loss:.4f}, acc={binary_acc:.2%}, "
              f"F1={f1:.3f}, AUC={auc:.3f}, gen_acc={gen_acc:.2%}\n")
        
        # Clear outputs
        self.validation_step_outputs = []
    
    def test_step(self, batch, batch_idx):
        images, binary_targets, generator_targets = batch
        
        binary_logits, generator_logits = self.model(images)
        total_loss, _, _ = self.criterion(
            binary_logits, generator_logits,
            binary_targets, generator_targets
        )
        
        binary_probs = torch.sigmoid(binary_logits)
        binary_preds = (binary_probs > 0.5).float()
        gen_preds = generator_logits.argmax(dim=1)
        
        self.test_step_outputs.append({
            'loss': total_loss,
            'binary_preds': binary_preds.cpu(),
            'binary_targets': binary_targets.cpu(),
            'binary_probs': binary_probs.cpu(),
            'gen_preds': gen_preds.cpu(),
            'gen_targets': generator_targets.cpu()
        })
        
        return total_loss
    
    def on_test_epoch_end(self):
        if not self.test_step_outputs:
            return
            
        # Same aggregation as validation
        all_binary_preds = torch.cat([x['binary_preds'] for x in self.test_step_outputs])
        all_binary_targets = torch.cat([x['binary_targets'] for x in self.test_step_outputs])
        all_binary_probs = torch.cat([x['binary_probs'] for x in self.test_step_outputs])
        all_gen_preds = torch.cat([x['gen_preds'] for x in self.test_step_outputs])
        all_gen_targets = torch.cat([x['gen_targets'] for x in self.test_step_outputs])
        
        # Full metrics
        binary_acc = accuracy_score(
            all_binary_targets.numpy().flatten(),
            all_binary_preds.numpy().flatten()
        )
        
        precision, recall, f1, _ = precision_recall_fscore_support(
            all_binary_targets.numpy().flatten(),
            all_binary_preds.numpy().flatten(),
            average='binary',
            zero_division=0
        )
        
        try:
            auc = roc_auc_score(
                all_binary_targets.numpy().flatten(),
                all_binary_probs.numpy().flatten()
            )
        except ValueError:
            auc = 0.0
        
        gen_acc = accuracy_score(all_gen_targets.numpy(), all_gen_preds.numpy())
        
        # Confusion matrix
        cm = confusion_matrix(
            all_binary_targets.numpy().flatten(),
            all_binary_preds.numpy().flatten()
        )
        
        # Per-generator accuracy
        gen_per_class = {}
        for gen_idx, gen_name in enumerate(GENERATORS):
            mask = all_gen_targets == gen_idx
            if mask.sum() > 0:
                gen_per_class[gen_name] = (
                    (all_gen_preds[mask] == gen_idx).float().mean().item()
                )
        
        # Log
        self.log('test/binary_acc', binary_acc)
        self.log('test/precision', precision)
        self.log('test/recall', recall)
        self.log('test/f1', f1)
        self.log('test/auc', auc)
        self.log('test/gen_acc', gen_acc)
        
        # Print detailed results
        print("\n" + "=" * 60)
        print("TEST RESULTS")
        print("=" * 60)
        print(f"Binary Accuracy:  {binary_acc:.2%}")
        print(f"Precision:        {precision:.4f}")
        print(f"Recall:           {recall:.4f}")
        print(f"F1 Score:         {f1:.4f}")
        print(f"AUC-ROC:          {auc:.4f}")
        print(f"\nGenerator Accuracy: {gen_acc:.2%}")
        print("\nPer-Generator Accuracy:")
        for gen, acc in gen_per_class.items():
            print(f"  {gen}: {acc:.2%}")
        print("\nConfusion Matrix:")
        print(f"  TN={cm[0,0]}, FP={cm[0,1]}")
        print(f"  FN={cm[1,0]}, TP={cm[1,1]}")
        print("=" * 60)
        
        # Save results to JSON
        results = {
            'binary_accuracy': binary_acc,
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'auc': auc,
            'generator_accuracy': gen_acc,
            'per_generator': gen_per_class,
            'confusion_matrix': cm.tolist()
        }
        
        results_path = Path('benchmark_results.json')
        with open(results_path, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n[INFO] Results saved to {results_path}")
        
        self.test_step_outputs = []
    
    def configure_optimizers(self):
        # AdamW optimizer
        optimizer = torch.optim.AdamW(
            self.parameters(),
            lr=self.hparams.learning_rate,
            weight_decay=self.hparams.weight_decay
        )
        
        # Cosine annealing with warm restarts
        scheduler = torch.optim.lr_scheduler.CosineAnnealingWarmRestarts(
            optimizer,
            T_0=10,  # Restart every 10 epochs
            T_mult=2,  # Double period after each restart
            eta_min=1e-7
        )
        
        print(f"[DEBUG] Optimizer: AdamW (lr={self.hparams.learning_rate}, wd={self.hparams.weight_decay})")
        print(f"[DEBUG] Scheduler: CosineAnnealingWarmRestarts (T_0=10)")
        
        return {
            'optimizer': optimizer,
            'lr_scheduler': {
                'scheduler': scheduler,
                'interval': 'epoch'
            }
        }


# =============================================================================
# Main Training Function
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description='UnDiffused AI Image Detector Training')
    
    # Dataset
    parser.add_argument('--data-dir', type=str, default=str(DATASET_PATH),
                        help='Path to dataset directory')
    
    # Training
    parser.add_argument('--epochs', type=int, default=DEFAULT_EPOCHS,
                        help='Number of training epochs')
    parser.add_argument('--batch-size', type=int, default=DEFAULT_BATCH_SIZE,
                        help='Batch size (keep low for 6GB VRAM)')
    parser.add_argument('--accumulate', type=int, default=DEFAULT_ACCUMULATE,
                        help='Gradient accumulation steps')
    parser.add_argument('--lr', type=float, default=DEFAULT_LR,
                        help='Learning rate')
    parser.add_argument('--workers', type=int, default=DEFAULT_WORKERS,
                        help='Number of data loading workers')
    
    # Mode
    parser.add_argument('--test', action='store_true',
                        help='Quick test mode (<30 minutes)')
    parser.add_argument('--resume', action='store_true',
                        help='Resume from checkpoint')
    parser.add_argument('--checkpoint', type=str, default=None,
                        help='Path to checkpoint for resuming')
    
    # Options
    parser.add_argument('--no-mixup', action='store_true',
                        help='Disable MixUp/CutMix augmentation')
    parser.add_argument('--precision', type=str, default='16-mixed',
                        choices=['32', '16-mixed', 'bf16-mixed'],
                        help='Training precision')
    
    args = parser.parse_args()
    
    # Setup
    print("\n" + "=" * 60)
    print("UnDiffused AI Image Detector - Training Pipeline")
    print("=" * 60)
    print(f"[INFO] Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"[INFO] Dataset: {args.data_dir}")
    print(f"[INFO] Mode: {'TEST (<30 min)' if args.test else 'FULL TRAINING'}")
    print(f"[INFO] Epochs: {args.epochs}")
    print(f"[INFO] Batch size: {args.batch_size}")
    print(f"[INFO] Accumulation: {args.accumulate}")
    print(f"[INFO] Effective batch: {args.batch_size * args.accumulate}")
    print(f"[INFO] Precision: {args.precision}")
    print("=" * 60)
    
    # Check CUDA
    if torch.cuda.is_available():
        print(f"\n[INFO] GPU: {torch.cuda.get_device_name(0)}")
        print(f"[INFO] VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
        torch.backends.cudnn.benchmark = True
    else:
        print("\n[WARNING] No GPU detected! Training will be slow.")
    
    # Test mode adjustments
    if args.test:
        print("\n[TEST MODE] Limiting dataset and epochs for quick validation")
        args.epochs = min(args.epochs, 3)
        max_samples_per_class = 200
    else:
        max_samples_per_class = None
    
    # Data module
    data_module = AIImageDataModule(
        data_dir=Path(args.data_dir),
        batch_size=args.batch_size,
        num_workers=args.workers,
        image_size=IMAGE_SIZE,
        test_mode=args.test
    )
    
    # Model
    model = AIImageDetectorModule(
        learning_rate=args.lr,
        use_mixup_cutmix=not args.no_mixup,
        max_epochs=args.epochs
    )
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            monitor='val/loss',
            mode='min',
            save_top_k=3,
            save_last=True,
            filename='undiffused-{epoch:02d}-{val/loss:.4f}'
        ),
        EarlyStopping(
            monitor='val/loss',
            mode='min',
            patience=15,
            verbose=True
        ),
        LearningRateMonitor(logging_interval='epoch'),
    ]
    
    # Logger
    logger = TensorBoardLogger('lightning_logs', name='undiffused')
    
    # Trainer
    trainer = pl.Trainer(
        max_epochs=args.epochs,
        accelerator='auto',
        devices=1,
        precision=args.precision,
        accumulate_grad_batches=args.accumulate,
        callbacks=callbacks,
        logger=logger,
        log_every_n_steps=10,
        val_check_interval=0.5 if not args.test else 1.0,  # Validate twice per epoch
        enable_progress_bar=True,
        deterministic=False,  # For speed
    )
    
    # Resume
    ckpt_path = None
    if args.resume:
        if args.checkpoint:
            ckpt_path = args.checkpoint
        else:
            # Find latest checkpoint
            ckpt_dir = Path('lightning_logs')
            if ckpt_dir.exists():
                checkpoints = list(ckpt_dir.rglob('*.ckpt'))
                if checkpoints:
                    ckpt_path = str(max(checkpoints, key=lambda p: p.stat().st_mtime))
                    print(f"[INFO] Resuming from: {ckpt_path}")
    
    # Train
    print("\n[INFO] Starting training...")
    start_time = time.time()
    
    try:
        trainer.fit(model, data_module, ckpt_path=ckpt_path)
    except KeyboardInterrupt:
        print("\n[INFO] Training interrupted by user")
    
    elapsed = time.time() - start_time
    print(f"\n[INFO] Training completed in {elapsed/60:.1f} minutes")
    
    # Test
    if trainer.checkpoint_callback.best_model_path:
        print(f"\n[INFO] Loading best model for testing...")
        trainer.test(model, data_module, ckpt_path=trainer.checkpoint_callback.best_model_path)
    
    # Export to ONNX
    print("\n[INFO] Exporting to ONNX...")
    export_onnx(model.model, output_path=Path(__file__).parent.parent / 'public' / 'model.onnx')
    
    print("\n" + "=" * 60)
    print("Training pipeline complete!")
    print("=" * 60)


def export_onnx(model: EfficientNetB4Detector, output_path: Path):
    """Export model to ONNX format for browser inference."""
    model.eval()
    device = next(model.parameters()).device
    
    # Wrap for ONNX (binary output only with sigmoid)
    export_model = EfficientNetB4DetectorONNX(model).to(device)
    export_model.eval()
    
    # Dummy input
    dummy_input = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE).to(device)
    
    # Export
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    torch.onnx.export(
        export_model,
        dummy_input,
        str(output_path),
        export_params=True,
        opset_version=16,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        }
    )
    
    # Get file size
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"[SUCCESS] ONNX model exported to: {output_path}")
    print(f"[INFO] Model size: {size_mb:.1f} MB")
    
    # Validate
    try:
        import onnx
        onnx_model = onnx.load(str(output_path))
        onnx.checker.check_model(onnx_model)
        print("[SUCCESS] ONNX model validation passed!")
    except ImportError:
        print("[WARNING] ONNX not installed, skipping validation")
    except Exception as e:
        print(f"[WARNING] ONNX validation failed: {e}")


# =============================================================================
# Entry Point
# =============================================================================

if __name__ == "__main__":
    main()
