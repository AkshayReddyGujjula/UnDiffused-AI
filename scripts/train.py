
"""
UnDiffused Training Script (ResNet50 RGB) - Professional Overhaul
================================================================
Trains a pre-trained ResNet50 on raw RGB images for maximum reliability.
OPTIMIZED for NVIDIA GPUs (GTX 1660 Ti) and robust AI detection.
Includes interactive progress bars and live training stats.

Usage:
    python scripts/train.py --workers 8 --batch-size 32
"""

import os
import argparse
import time
import numpy as np
import cv2
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from pathlib import Path
from sklearn.metrics import accuracy_score, classification_report, precision_recall_fscore_support
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from tqdm import tqdm

# Constants
IMAGE_SIZE = 224  # Standard for ResNet
DEFAULT_BATCH_SIZE = 32 # Balanced for 6GB VRAM
EPOCHS = 30 # Increased for better convergence
LEARNING_RATE = 1e-4 # Lower for fine-tuning
DATASET_PATH = Path(r"C:\Users\aksha\Desktop\DataSets\train")

class ImageDataset(Dataset):
    def __init__(self, root_dir, transform=None, test_mode=False):
        self.root_dir = Path(root_dir)
        self.transform = transform
        self.samples = []
        
        # Load real images (label=0)
        real_dir = self.root_dir / "REAL"
        real_imgs = list(real_dir.glob("*.[pj][np][g]*"))
        if test_mode: real_imgs = real_imgs[:200]
        for p in real_imgs:
            self.samples.append((str(p), 0))
            
        # Load fake images (label=1)
        fake_dir = self.root_dir / "FAKE"
        fake_imgs = list(fake_dir.glob("*.[pj][np][g]*"))
        if test_mode: fake_imgs = fake_imgs[:200]
        for p in fake_imgs:
            self.samples.append((str(p), 1))
            
        print(f"Loaded {len(self.samples)} images ({len(real_imgs)} Real, {len(fake_imgs)} Fake)")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        try:
            # Use PIL for torchvision transforms compatibility
            img = Image.open(path).convert('RGB')
        except Exception as e:
            # In case of corruption, return a blank black image
            img = Image.new('RGB', (IMAGE_SIZE, IMAGE_SIZE))
            
        if self.transform:
            img = self.transform(img)
            
        return img, torch.tensor(label, dtype=torch.float32)

def get_model():
    """Returns a ResNet50 model with a custom binary classifier head"""
    # Use WeightsEnum for newer torchvision versions
    try:
        from torchvision.models import ResNet50_Weights
        model = models.resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
    except ImportError:
        model = models.resnet50(pretrained=True)
    
    # Replace the final fully connected layer
    # Note: We remove nn.Sigmoid() because we will use BCEWithLogitsLoss
    # which is more stable for Mixed Precision (AMP).
    num_ftrs = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Linear(num_ftrs, 512),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(512, 1)
    )
    return model

def train():
    parser = argparse.ArgumentParser()
    parser.add_argument('--test', action='store_true', help='Run quickly on small subset')
    parser.add_argument('--workers', type=int, default=4, help='Number of data loading workers')
    parser.add_argument('--batch-size', type=int, default=DEFAULT_BATCH_SIZE, help='Batch size')
    parser.add_argument('--resume', action='store_true', help='Resume from best_model.pth')
    args = parser.parse_args()

    # Optimization: Use cuDNN benchmark
    torch.backends.cudnn.benchmark = True

    # Setup Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n[INFO] Starting UnDiffused Training")
    print(f"[INFO] Device: {device}")
    if device.type == 'cuda':
        print(f"[INFO] GPU: {torch.cuda.get_device_name(0)}")
        print(f"[INFO] Workers: {args.workers}")
        print(f"[INFO] Batch Size: {args.batch_size}")
    
    # Transforms
    train_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE + 32, IMAGE_SIZE + 32)),
        transforms.RandomResizedCrop(IMAGE_SIZE),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Load Data
    full_dataset_train = ImageDataset(DATASET_PATH, test_mode=args.test) # Just for size
    total_size = len(full_dataset_train)
    train_size = int(0.85 * total_size)
    val_size = total_size - train_size
    
    # Manual Split for different transforms
    indices = torch.randperm(total_size).tolist()
    train_indices = indices[:train_size]
    val_indices = indices[train_size:]
    
    train_dataset = torch.utils.data.Subset(ImageDataset(DATASET_PATH, transform=train_transform, test_mode=args.test), train_indices)
    val_dataset = torch.utils.data.Subset(ImageDataset(DATASET_PATH, transform=val_transform, test_mode=args.test), val_indices)
    
    train_loader = DataLoader(
        train_dataset, 
        batch_size=args.batch_size, 
        shuffle=True,
        num_workers=args.workers,
        pin_memory=True,
        persistent_workers=True if args.workers > 0 else False
    )
    
    val_loader = DataLoader(
        val_dataset, 
        batch_size=args.batch_size, 
        shuffle=False,
        num_workers=args.workers,
        pin_memory=True,
        persistent_workers=True if args.workers > 0 else False
    )
    
    model = get_model().to(device)
    
    # Resume Logic
    start_epoch = 0
    if args.resume and os.path.exists('best_model.pth'):
        print(f"[INFO] Resuming training from best_model.pth...")
        model.load_state_dict(torch.load('best_model.pth', weights_only=True))
        # Note: In a professional setup, we'd also save/load optimizer state, 
        # but for fine-tuning ResNet, loading weights is sufficient to resume.
        
    # BCEWithLogitsLoss is mathematically more stable than Sigmoid + BCELoss
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-2)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS)
    
    # Mixed Precision Scaler for faster training
    scaler = torch.amp.GradScaler('cuda')
    
    print(f"\n[INFO] Initializing training loop (AMP Enabled)...")
    start_time = time.time()
    best_val_loss = float('inf')
    early_stop_patience = 7
    patience_counter = 0
    
    # Main Epoch Loop
    epoch_pbar = tqdm(range(start_epoch, EPOCHS), desc="Total Progress")
    for epoch in epoch_pbar:
        # 1. Training Phase
        model.train()
        running_loss = 0.0
        
        train_pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS} [Train]", leave=False)
        for inputs, labels in train_pbar:
            inputs = inputs.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True).unsqueeze(1)
            
            optimizer.zero_grad()
            
            # Use autocast for mixed precision
            with torch.amp.autocast('cuda'):
                outputs = model(inputs)
                loss = criterion(outputs, labels)
            
            # Use scaler for backward and step
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            
            running_loss += loss.item()
            train_pbar.set_postfix({"loss": f"{loss.item():.4f}"})
            
        avg_train_loss = running_loss / len(train_loader)
        
        # 2. Validation Phase
        model.eval()
        val_loss = 0.0
        y_true = []
        y_pred = []
        
        val_pbar = tqdm(val_loader, desc=f"Epoch {epoch+1}/{EPOCHS} [Val]", leave=False)
        with torch.no_grad():
            for inputs, labels in val_pbar:
                inputs = inputs.to(device, non_blocking=True)
                labels = labels.to(device, non_blocking=True).unsqueeze(1)
                outputs = model(inputs)
                val_loss += criterion(outputs, labels).item()
                
                # Apply sigmoid manually for accuracy check since we removed it from model
                probs = torch.sigmoid(outputs)
                preds = (probs > 0.5).float()
                y_true.extend(labels.cpu().numpy())
                y_pred.extend(preds.cpu().numpy())
                
                val_pbar.set_postfix({"batch_loss": f"{criterion(outputs, labels).item():.4f}"})
        
        avg_val_loss = val_loss / len(val_loader)
        val_acc = accuracy_score(y_true, y_pred)
        
        current_lr = optimizer.param_groups[0]['lr']
        scheduler.step()
        
        # Log results for this epoch
        tqdm.write(f"Epoch {epoch+1}/{EPOCHS} | Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Val Acc: {val_acc:.2%} | LR: {current_lr:.6f}")
        
        # 3. Checkpointing & Early Stopping
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            patience_counter = 0
            torch.save(model.state_dict(), 'best_model.pth')
            tqdm.write("  [SAVED] New best model checkpoint reached.")
        else:
            patience_counter += 1
            if patience_counter >= early_stop_patience:
                tqdm.write(f"\n[EARLY STOP] No improvement for {early_stop_patience} epochs. Stopping.")
                break
                
    total_time = time.time() - start_time
    print(f"\n[SUCCESS] Training completed in {total_time/60:.1f} minutes.")
    
    # Final Evaluation
    print("\n[INFO] Loading best model for final export...")
    model.load_state_dict(torch.load('best_model.pth', weights_only=True))
    
    # Re-add Sigmoid layer for the ONNX export so the Chrome extension 
    # continues to get probabilities (0-1) instead of raw logits.
    export_model = nn.Sequential(
        model,
        nn.Sigmoid()
    ).to(device)
    export_model.eval()
    
    # Export to ONNX
    print("[INFO] Exporting to ONNX format...")
    dummy_input = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE).to(device)
    output_path = Path(__file__).parent.parent / "public" / "model.onnx"
    
    torch.onnx.export(
        export_model, 
        dummy_input, 
        str(output_path),
        export_params=True,
        opset_version=12,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    print(f"[SUCCESS] High-fidelity model exported to: {output_path}")

if __name__ == "__main__":
    train()
