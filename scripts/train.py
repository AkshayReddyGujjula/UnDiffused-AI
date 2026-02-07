
"""
UnDiffused Training Script (PyTorch CNN) - Optimized
====================================================
Trains a Convolutional Neural Network (CNN) to detect AI-generated images.
OPTIMIZED for NVIDIA GPUs (CUDA) and Multi-core CPUs.

Usage:
    python scripts/train.py
    python scripts/train.py --workers 8 --batch-size 64
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
from sklearn.metrics import accuracy_score, classification_report

# Constants
IMAGE_SIZE = 128
DEFAULT_BATCH_SIZE = 64
EPOCHS = 10
LEARNING_RATE = 0.001
DATASET_PATH = Path(r"C:\Users\aksha\Desktop\Hackathons & Events\AI Ventures Hackathon Imperial\train")

# Laplacian kernel (must match TypeScript implementation)
LAPLACIAN_KERNEL = np.array([
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0]
], dtype=np.float32)

class ImageDataset(Dataset):
    def __init__(self, root_dir, transform=None, test_mode=False):
        self.root_dir = Path(root_dir)
        self.transform = transform
        self.samples = []
        
        # Load real images (label=0)
        real_dir = self.root_dir / "REAL"
        real_imgs = list(real_dir.glob("*.[pj][np][g]*")) # png, jpg, jpeg
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
        features = self.process_image(path)
        # Convert to tensor (C, H, W) -> (1, 128, 128)
        return torch.from_numpy(features).unsqueeze(0), torch.tensor(label, dtype=torch.float32)

    def process_image(self, image_path):
        """Matches the TypeScript feature extraction exactly"""
        img = cv2.imread(image_path)
        if img is None:
            return np.zeros((IMAGE_SIZE, IMAGE_SIZE), dtype=np.float32)
        
        img = cv2.resize(img, (IMAGE_SIZE, IMAGE_SIZE))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
        
        # Laplacian
        laplacian = cv2.filter2D(gray, -1, LAPLACIAN_KERNEL, borderType=cv2.BORDER_REPLICATE)
        
        # Gradient Magnitude
        gx = cv2.Sobel(laplacian, cv2.CV_32F, 1, 0, ksize=3, borderType=cv2.BORDER_REPLICATE)
        gy = cv2.Sobel(laplacian, cv2.CV_32F, 0, 1, ksize=3, borderType=cv2.BORDER_REPLICATE)
        magnitude = np.sqrt(gx**2 + gy**2)
        
        # Normalize 0-255
        magnitude = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
        
        # Normalize to 0-1 for Neural Network stability
        return (magnitude / 255.0).astype(np.float32)

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        # Input: 1 x 128 x 128
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2), # -> 16 x 64 x 64
            
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2), # -> 32 x 32 x 32
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2), # -> 64 x 16 x 16
        )
        
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 16 * 16, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

def train():
    parser = argparse.ArgumentParser()
    parser.add_argument('--test', action='store_true', help='Run quickly on small subset')
    parser.add_argument('--workers', type=int, default=4, help='Number of data loading workers')
    parser.add_argument('--batch-size', type=int, default=DEFAULT_BATCH_SIZE, help='Batch size')
    args = parser.parse_args()

    # Optimization: Use cuDNN benchmark
    torch.backends.cudnn.benchmark = True

    # Setup Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    if device.type == 'cuda':
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"Workers: {args.workers}")
        print(f"Batch Size: {args.batch_size}")
    
    # Load Data
    full_dataset = ImageDataset(DATASET_PATH, test_mode=args.test)
    train_size = int(0.8 * len(full_dataset))
    test_size = len(full_dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(full_dataset, [train_size, test_size])
    
    # Optimization: num_workers, pin_memory
    train_loader = DataLoader(
        train_dataset, 
        batch_size=args.batch_size, 
        shuffle=True,
        num_workers=args.workers,
        pin_memory=True, # Faster transfer to GPU
        persistent_workers=True if args.workers > 0 else False
    )
    
    test_loader = DataLoader(
        test_dataset, 
        batch_size=args.batch_size, 
        shuffle=False,
        num_workers=args.workers,
        pin_memory=True,
        persistent_workers=True if args.workers > 0 else False
    )
    
    model = SimpleCNN().to(device)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    
    # Train Loop
    print(f"\nStarting training for {EPOCHS} epochs...")
    start_time = time.time()
    
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        batch_count = 0
        
        epoch_start = time.time()
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device, non_blocking=True), labels.to(device, non_blocking=True).unsqueeze(1)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            batch_count += 1
            
            if batch_count % 100 == 0:
                print(f"  Batch {batch_count}/{len(train_loader)} | Loss: {loss.item():.4f}", end='\r')
            
        avg_loss = running_loss / len(train_loader)
        epoch_dur = time.time() - epoch_start
        print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {avg_loss:.4f} | Time: {epoch_dur:.1f}s")
        
    total_time = time.time() - start_time
    print(f"\nTraining finished in {total_time/60:.1f} minutes.")
        
    # Evaluate
    print("\nEvaluating model...")
    model.eval()
    y_true = []
    y_pred = []
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device, non_blocking=True)
            outputs = model(inputs)
            predicted = (outputs > 0.5).float()
            y_true.extend(labels.cpu().numpy())
            y_pred.extend(predicted.cpu().numpy())
            
    acc = accuracy_score(y_true, y_pred)
    print(f"\nFinal Accuracy: {acc:.2%}")
    print(classification_report(y_true, y_pred, target_names=['REAL', 'FAKE']))
    
    # Export to ONNX
    dummy_input = torch.randn(1, 1, IMAGE_SIZE, IMAGE_SIZE).to(device)
    output_path = Path(__file__).parent.parent / "public" / "model.onnx"
    
    torch.onnx.export(
        model, 
        dummy_input, 
        str(output_path),
        export_params=True,
        opset_version=12,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    print(f"\n[SUCCESS] Model exported to {output_path}")

if __name__ == "__main__":
    # Windows-specific fix for multiprocessing
    # torch.multiprocessing.freeze_support() might be needed if packaging, but okay for script
    train()
