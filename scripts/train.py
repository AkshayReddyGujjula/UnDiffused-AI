"""
UnDiffused Training Script
==========================
Trains a Logistic Regression model to detect AI-generated images.

Pipeline: Image → Resize(128x128) → Grayscale → Laplacian → Gradient Magnitude → Flatten → PCA(50) → LogisticRegression → ONNX

Usage:
    python scripts/train.py
    python scripts/train.py --test  # Quick validation with subset
"""

import os
import sys
import argparse
import numpy as np
import cv2
from pathlib import Path
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# Constants
IMAGE_SIZE = 128
PCA_COMPONENTS = 50
DATASET_PATH = Path(r"C:\Users\aksha\Desktop\Hackathons & Events\AI Ventures Hackathon Imperial\train")

# Laplacian kernel (must match TypeScript implementation exactly)
LAPLACIAN_KERNEL = np.array([
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0]
], dtype=np.float32)


def process_image(image_path: str) -> np.ndarray:
    """
    Process a single image through the feature extraction pipeline.
    
    Steps:
    1. Load and resize to 128x128
    2. Convert to grayscale
    3. Apply Laplacian filter
    4. Calculate gradient magnitude
    5. Flatten to 1D array
    """
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image: {image_path}")
    
    # Resize to 128x128
    img = cv2.resize(img, (IMAGE_SIZE, IMAGE_SIZE))
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
    
    # Apply Laplacian filter (matches TypeScript convolution with BORDER_REPLICATE)
    laplacian = cv2.filter2D(gray, -1, LAPLACIAN_KERNEL, borderType=cv2.BORDER_REPLICATE)
    
    # Calculate gradient magnitude using Sobel operators
    # Use BORDER_REPLICATE to match browser implementation
    gx = cv2.Sobel(laplacian, cv2.CV_32F, 1, 0, ksize=3, borderType=cv2.BORDER_REPLICATE)
    gy = cv2.Sobel(laplacian, cv2.CV_32F, 0, 1, ksize=3, borderType=cv2.BORDER_REPLICATE)
    gradient_magnitude = np.sqrt(gx**2 + gy**2)
    
    # Normalize to 0-255 range
    gradient_magnitude = cv2.normalize(gradient_magnitude, None, 0, 255, cv2.NORM_MINMAX)
    
    # Flatten to 1D
    return gradient_magnitude.flatten()


def load_dataset(dataset_path: Path, test_mode: bool = False) -> tuple:
    """
    Load CIFAKE dataset from directory structure:
    - REAL/  (label=0)
    - FAKE/  (label=1)
    """
    X = []
    y = []
    
    real_dir = dataset_path / "REAL"
    fake_dir = dataset_path / "FAKE"
    
    if not real_dir.exists() or not fake_dir.exists():
        raise FileNotFoundError(
            f"Expected REAL/ and FAKE/ subdirectories in {dataset_path}\n"
            f"Found: {list(dataset_path.iterdir())}"
        )
    
    # Load real images (label=0)
    real_images = list(real_dir.glob("*.png")) + list(real_dir.glob("*.jpg")) + list(real_dir.glob("*.jpeg"))
    if test_mode:
        real_images = real_images[:100]  # Quick test with subset
    
    print(f"Loading {len(real_images)} REAL images...")
    for i, img_path in enumerate(real_images):
        try:
            features = process_image(str(img_path))
            X.append(features)
            y.append(0)
            if (i + 1) % 500 == 0:
                print(f"  Processed {i + 1}/{len(real_images)} real images")
        except Exception as e:
            print(f"  Warning: Skipped {img_path.name}: {e}")
    
    # Load fake images (label=1)
    fake_images = list(fake_dir.glob("*.png")) + list(fake_dir.glob("*.jpg")) + list(fake_dir.glob("*.jpeg"))
    if test_mode:
        fake_images = fake_images[:100]
    
    print(f"Loading {len(fake_images)} FAKE images...")
    for i, img_path in enumerate(fake_images):
        try:
            features = process_image(str(img_path))
            X.append(features)
            y.append(1)
            if (i + 1) % 500 == 0:
                print(f"  Processed {i + 1}/{len(fake_images)} fake images")
        except Exception as e:
            print(f"  Warning: Skipped {img_path.name}: {e}")
    
    return np.array(X), np.array(y)


def train_model(X: np.ndarray, y: np.ndarray) -> Pipeline:
    """
    Train the detection pipeline:
    1. PCA for dimensionality reduction (128*128 → 50 features)
    2. Logistic Regression for classification
    """
    print(f"\nTraining on {len(X)} samples...")
    print(f"Feature dimension: {X.shape[1]}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Create pipeline
    pipeline = Pipeline([
        ('pca', PCA(n_components=PCA_COMPONENTS)),
        ('classifier', LogisticRegression(max_iter=1000, random_state=42))
    ])
    
    # Train
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n{'='*50}")
    print(f"Model Accuracy: {accuracy:.2%}")
    print(f"{'='*50}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['REAL', 'AI-GENERATED']))
    
    return pipeline


def export_to_onnx(pipeline: Pipeline, output_path: Path):
    """
    Export trained pipeline to ONNX format for use in the browser.
    """
    # Define input type (flattened gradient magnitude array)
    initial_type = [('input', FloatTensorType([None, IMAGE_SIZE * IMAGE_SIZE]))]
    
    # Convert to ONNX
    # zipmap=False ensures probabilities are output as a simple tensor, not a map
    onnx_model = convert_sklearn(
        pipeline, 
        initial_types=initial_type,
        target_opset=12,
        options={'zipmap': False}
    )
    
    # Save
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())
    
    print(f"\n[SUCCESS] Model exported to: {output_path}")
    print(f"  Size: {output_path.stat().st_size / 1024:.1f} KB")


def main():
    parser = argparse.ArgumentParser(description='Train UnDiffused AI image detector')
    parser.add_argument('--test', action='store_true', help='Quick test with subset of data')
    args = parser.parse_args()
    
    print("="*60)
    print("  UnDiffused Training Script")
    print("  AI-Generated Image Detection Model")
    print("="*60)
    print(f"\nDataset path: {DATASET_PATH}")
    print(f"Image size: {IMAGE_SIZE}x{IMAGE_SIZE}")
    print(f"PCA components: {PCA_COMPONENTS}")
    
    if args.test:
        print("\n[WARNING] TEST MODE: Using subset of data for quick validation")
    
    # Load dataset
    X, y = load_dataset(DATASET_PATH, test_mode=args.test)
    
    # Train model
    pipeline = train_model(X, y)
    
    # Export to ONNX
    output_path = Path(__file__).parent.parent / "public" / "model.onnx"
    export_to_onnx(pipeline, output_path)
    
    print("\n[SUCCESS] Training complete!")


if __name__ == "__main__":
    main()
