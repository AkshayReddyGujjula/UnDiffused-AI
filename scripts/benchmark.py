"""
UnDiffused Benchmark Script
===========================
Comprehensive evaluation of the trained model.

Generates:
- Per-generator accuracy breakdown
- Precision, Recall, F1, AUROC metrics
- Confusion matrices
- benchmark_results.json

Usage:
    # Evaluate PyTorch model
    python scripts/benchmark.py --checkpoint best_model.pth --data D:/Datasets
    
    # Evaluate ONNX model
    python scripts/benchmark.py --onnx public/model.onnx --data D:/Datasets
"""

import os
import sys
import argparse
import json
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List, Tuple

import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from tqdm import tqdm
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    roc_auc_score,
    classification_report,
    roc_curve
)

# Local imports
from models import EfficientNetB4Detector, MultiHeadClassifier

# Configuration
IMAGE_SIZE = 384
GENERATORS = MultiHeadClassifier.GENERATORS


# =============================================================================
# Data Loading
# =============================================================================

def load_test_data(data_dir: Path, max_per_class: Optional[int] = None) -> List[Tuple[Path, int, int]]:
    """
    Load test data from directory.
    
    Returns list of (path, binary_label, generator_label) tuples.
    """
    print(f"\n[INFO] Loading test data from: {data_dir}")
    
    samples = []
    
    # Load REAL images
    real_dir = data_dir / "REAL"
    if real_dir.exists():
        real_images = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            real_images.extend(real_dir.rglob(ext))
            real_images.extend(real_dir.rglob(ext.upper()))
        
        if max_per_class:
            real_images = real_images[:max_per_class]
        
        for img in real_images:
            samples.append((img, 0, 0))  # Real, generator=0
        
        print(f"[DEBUG] Found {len(real_images)} REAL images")
    
    # Load FAKE images
    fake_dir = data_dir / "FAKE"
    if fake_dir.exists():
        fake_images = []
        generator_map = {}
        
        # Check for generator subdirectories
        subdirs = [d for d in fake_dir.iterdir() if d.is_dir()]
        
        if subdirs:
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
                    gen_idx = 6
                
                images = []
                for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
                    images.extend(subdir.rglob(ext))
                
                for img in images:
                    fake_images.append((img, gen_idx))
                
                generator_map[gen_name] = len(images)
        else:
            # All in one directory
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
                for img in fake_dir.rglob(ext):
                    fake_images.append((img, 6))  # 'other'
        
        if max_per_class:
            fake_images = fake_images[:max_per_class]
        
        for img, gen_idx in fake_images:
            samples.append((img, 1, gen_idx))  # Fake, generator=gen_idx
        
        print(f"[DEBUG] Found {len(fake_images)} FAKE images")
        if generator_map:
            print(f"[DEBUG] Generator distribution: {generator_map}")
    
    print(f"[DEBUG] Total samples: {len(samples)}")
    return samples


# =============================================================================
# Evaluation
# =============================================================================

def evaluate_pytorch(
    model: EfficientNetB4Detector,
    samples: List[Tuple[Path, int, int]],
    device: str = 'cuda',
    batch_size: int = 8
) -> Dict:
    """Evaluate PyTorch model."""
    
    print(f"\n[INFO] Evaluating PyTorch model on {len(samples)} samples...")
    
    model.eval()
    model.to(device)
    
    transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    
    all_binary_probs = []
    all_binary_preds = []
    all_binary_targets = []
    all_gen_preds = []
    all_gen_targets = []
    
    with torch.no_grad():
        for path, binary_target, gen_target in tqdm(samples, desc="Evaluating"):
            try:
                img = Image.open(path).convert('RGB')
                img_tensor = transform(img).unsqueeze(0).to(device)
                
                binary_logits, gen_logits = model(img_tensor)
                
                binary_prob = torch.sigmoid(binary_logits).item()
                binary_pred = 1 if binary_prob > 0.5 else 0
                gen_pred = gen_logits.argmax(dim=1).item()
                
                all_binary_probs.append(binary_prob)
                all_binary_preds.append(binary_pred)
                all_binary_targets.append(binary_target)
                all_gen_preds.append(gen_pred)
                all_gen_targets.append(gen_target)
                
            except Exception as e:
                print(f"[WARNING] Failed to process {path}: {e}")
                continue
    
    return compute_metrics(
        all_binary_probs, all_binary_preds, all_binary_targets,
        all_gen_preds, all_gen_targets
    )


def evaluate_onnx(
    model_path: Path,
    samples: List[Tuple[Path, int, int]]
) -> Dict:
    """Evaluate ONNX model."""
    
    try:
        import onnxruntime as ort
    except ImportError:
        print("[ERROR] onnxruntime not installed")
        return {}
    
    print(f"\n[INFO] Evaluating ONNX model on {len(samples)} samples...")
    
    session = ort.InferenceSession(
        str(model_path),
        providers=['CUDAExecutionProvider', 'CPUExecutionProvider']
    )
    input_name = session.get_inputs()[0].name
    
    transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    
    all_binary_probs = []
    all_binary_preds = []
    all_binary_targets = []
    all_gen_targets = []
    
    for path, binary_target, gen_target in tqdm(samples, desc="Evaluating"):
        try:
            img = Image.open(path).convert('RGB')
            img_tensor = transform(img).unsqueeze(0).numpy()
            
            output = session.run(None, {input_name: img_tensor})
            binary_prob = float(output[0][0][0])
            binary_pred = 1 if binary_prob > 0.5 else 0
            
            all_binary_probs.append(binary_prob)
            all_binary_preds.append(binary_pred)
            all_binary_targets.append(binary_target)
            all_gen_targets.append(gen_target)
            
        except Exception as e:
            print(f"[WARNING] Failed to process {path}: {e}")
            continue
    
    # ONNX model only outputs binary, so use dummy gen_preds
    all_gen_preds = [0] * len(all_gen_targets)
    
    return compute_metrics(
        all_binary_probs, all_binary_preds, all_binary_targets,
        all_gen_preds, all_gen_targets,
        include_generator=False
    )


def compute_metrics(
    binary_probs: List[float],
    binary_preds: List[int],
    binary_targets: List[int],
    gen_preds: List[int],
    gen_targets: List[int],
    include_generator: bool = True
) -> Dict:
    """Compute all evaluation metrics."""
    
    binary_probs = np.array(binary_probs)
    binary_preds = np.array(binary_preds)
    binary_targets = np.array(binary_targets)
    gen_preds = np.array(gen_preds)
    gen_targets = np.array(gen_targets)
    
    # Binary metrics
    binary_acc = accuracy_score(binary_targets, binary_preds)
    precision, recall, f1, _ = precision_recall_fscore_support(
        binary_targets, binary_preds, average='binary', zero_division=0
    )
    
    try:
        auc = roc_auc_score(binary_targets, binary_probs)
    except ValueError:
        auc = 0.0
    
    cm = confusion_matrix(binary_targets, binary_preds)
    
    # Per-generator metrics
    per_generator = {}
    for gen_idx, gen_name in enumerate(GENERATORS):
        mask = gen_targets == gen_idx
        if mask.sum() > 0:
            # Binary accuracy for this generator
            gen_binary_acc = (binary_preds[mask] == binary_targets[mask]).mean()
            per_generator[gen_name] = {
                'count': int(mask.sum()),
                'binary_accuracy': float(gen_binary_acc)
            }
            
            if include_generator and gen_idx > 0:
                # Generator classification accuracy (for AI images only)
                ai_mask = mask & (binary_targets == 1)
                if ai_mask.sum() > 0:
                    gen_class_acc = (gen_preds[ai_mask] == gen_idx).mean()
                    per_generator[gen_name]['generator_accuracy'] = float(gen_class_acc)
    
    results = {
        'timestamp': datetime.now().isoformat(),
        'total_samples': len(binary_targets),
        'binary_metrics': {
            'accuracy': float(binary_acc),
            'precision': float(precision),
            'recall': float(recall),
            'f1': float(f1),
            'auc_roc': float(auc)
        },
        'confusion_matrix': {
            'true_negative': int(cm[0, 0]),
            'false_positive': int(cm[0, 1]),
            'false_negative': int(cm[1, 0]),
            'true_positive': int(cm[1, 1])
        },
        'per_generator': per_generator
    }
    
    if include_generator:
        gen_acc = accuracy_score(gen_targets, gen_preds)
        results['generator_accuracy'] = float(gen_acc)
    
    return results


def print_results(results: Dict):
    """Print formatted results."""
    
    print("\n" + "=" * 60)
    print("BENCHMARK RESULTS")
    print("=" * 60)
    
    print(f"\nTotal samples: {results['total_samples']}")
    print(f"Timestamp: {results['timestamp']}")
    
    print("\n--- Binary Classification ---")
    bm = results['binary_metrics']
    print(f"Accuracy:   {bm['accuracy']:.2%}")
    print(f"Precision:  {bm['precision']:.4f}")
    print(f"Recall:     {bm['recall']:.4f}")
    print(f"F1 Score:   {bm['f1']:.4f}")
    print(f"AUC-ROC:    {bm['auc_roc']:.4f}")
    
    print("\n--- Confusion Matrix ---")
    cm = results['confusion_matrix']
    print(f"TN: {cm['true_negative']:5d}  |  FP: {cm['false_positive']:5d}")
    print(f"FN: {cm['false_negative']:5d}  |  TP: {cm['true_positive']:5d}")
    
    if 'generator_accuracy' in results:
        print(f"\n--- Generator Classification ---")
        print(f"Overall Accuracy: {results['generator_accuracy']:.2%}")
    
    print("\n--- Per-Generator Performance ---")
    for gen_name, gen_data in results['per_generator'].items():
        line = f"{gen_name:15s}: n={gen_data['count']:5d}, binary_acc={gen_data['binary_accuracy']:.2%}"
        if 'generator_accuracy' in gen_data:
            line += f", gen_acc={gen_data['generator_accuracy']:.2%}"
        print(line)
    
    print("=" * 60)


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description='UnDiffused Model Benchmark')
    
    # Model source (one of these required)
    model_group = parser.add_mutually_exclusive_group(required=True)
    model_group.add_argument('--checkpoint', type=str,
                             help='Path to PyTorch checkpoint')
    model_group.add_argument('--onnx', type=str,
                             help='Path to ONNX model')
    
    # Data
    parser.add_argument('--data', type=str, required=True,
                        help='Path to test data directory')
    parser.add_argument('--max-samples', type=int, default=None,
                        help='Maximum samples per class')
    
    # Output
    parser.add_argument('--output', type=str, default='benchmark_results.json',
                        help='Output JSON file path')
    
    # Options
    parser.add_argument('--device', type=str, default='cuda',
                        help='Device for PyTorch inference')
    
    args = parser.parse_args()
    
    # Load test data
    samples = load_test_data(Path(args.data), args.max_samples)
    
    if len(samples) == 0:
        print("[ERROR] No test samples found!")
        return
    
    # Run evaluation
    if args.checkpoint:
        # PyTorch model
        print(f"[INFO] Loading PyTorch checkpoint: {args.checkpoint}")
        model = EfficientNetB4Detector(pretrained=False)
        
        checkpoint = torch.load(args.checkpoint, map_location='cpu', weights_only=True)
        if 'state_dict' in checkpoint:
            state_dict = {k.replace('model.', ''): v for k, v in checkpoint['state_dict'].items()}
        else:
            state_dict = checkpoint
        
        model.load_state_dict(state_dict)
        results = evaluate_pytorch(model, samples, device=args.device)
        
    else:
        # ONNX model
        results = evaluate_onnx(Path(args.onnx), samples)
    
    # Print results
    print_results(results)
    
    # Save to JSON
    output_path = Path(args.output)
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n[SUCCESS] Results saved to: {output_path}")


if __name__ == "__main__":
    main()
