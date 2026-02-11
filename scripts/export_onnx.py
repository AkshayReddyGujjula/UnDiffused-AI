"""
UnDiffused ONNX Export & Inference
==================================
Export trained model to ONNX format for browser inference.

Features:
- ONNX export with opset 16
- FP16 quantization option
- Test-Time Augmentation (TTA) for maximum accuracy
- CPU inference benchmarking

Usage:
    # Basic export
    python scripts/export_onnx.py --checkpoint best_model.pth --output public/model.onnx
    
    # With quantization
    python scripts/export_onnx.py --checkpoint best_model.pth --output public/model.onnx --quantize
    
    # Benchmark inference speed
    python scripts/export_onnx.py --benchmark public/model.onnx
"""

import os
import sys
import argparse
import time
from pathlib import Path
from typing import Optional, List, Tuple

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

# Local imports
from models import EfficientNetB4Detector, EfficientNetB4DetectorONNX


# =============================================================================
# Configuration
# =============================================================================

IMAGE_SIZE = 384
OPSET_VERSION = 16
TARGET_INFERENCE_MS = 500  # Target: <500ms per image on CPU


# =============================================================================
# Test-Time Augmentation (TTA)
# =============================================================================

class TTAPredictor:
    """
    Test-Time Augmentation for improved prediction accuracy.
    
    Applies multiple augmentations and averages predictions.
    Can boost accuracy by 2-4% with minimal overhead.
    """
    
    def __init__(
        self, 
        model: nn.Module, 
        device: str = 'cpu',
        num_augmentations: int = 5,
        image_size: int = IMAGE_SIZE
    ):
        self.model = model
        self.device = device
        self.num_augmentations = num_augmentations
        self.image_size = image_size
        
        # Base transform (normalization)
        self.normalize = transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
        
        # TTA transforms (different crops and flips)
        self.tta_transforms = [
            # Center crop
            transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                self.normalize
            ]),
            # Top-left crop
            transforms.Compose([
                transforms.Resize((image_size + 48, image_size + 48)),
                transforms.FiveCrop(image_size),
                transforms.Lambda(lambda crops: crops[0]),
                transforms.ToTensor(),
                self.normalize
            ]),
            # Horizontal flip
            transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.RandomHorizontalFlip(p=1.0),
                transforms.ToTensor(),
                self.normalize
            ]),
            # Slight rotation
            transforms.Compose([
                transforms.Resize((image_size + 32, image_size + 32)),
                transforms.RandomRotation(degrees=5),
                transforms.CenterCrop(image_size),
                transforms.ToTensor(),
                self.normalize
            ]),
            # Different scale
            transforms.Compose([
                transforms.Resize((image_size + 64, image_size + 64)),
                transforms.CenterCrop(image_size),
                transforms.ToTensor(),
                self.normalize
            ]),
        ]
        
    @torch.no_grad()
    def predict(self, image: Image.Image) -> Tuple[float, float]:
        """
        Predict with TTA.
        
        Args:
            image: PIL Image to classify
            
        Returns:
            avg_prob: Average probability of being AI-generated
            std_prob: Standard deviation of predictions (uncertainty)
        """
        self.model.eval()
        predictions = []
        
        for i, transform in enumerate(self.tta_transforms[:self.num_augmentations]):
            try:
                img_tensor = transform(image).unsqueeze(0).to(self.device)
                
                # Get prediction
                if isinstance(self.model, EfficientNetB4DetectorONNX):
                    prob = self.model(img_tensor)
                else:
                    binary_logits, _ = self.model(img_tensor)
                    prob = torch.sigmoid(binary_logits)
                
                predictions.append(prob.item())
            except Exception as e:
                print(f"[WARNING] TTA augmentation {i} failed: {e}")
                continue
        
        if not predictions:
            return 0.5, 0.0
        
        avg_prob = np.mean(predictions)
        std_prob = np.std(predictions)
        
        return float(avg_prob), float(std_prob)
    
    @torch.no_grad()
    def predict_batch(self, images: List[Image.Image]) -> List[Tuple[float, float]]:
        """Predict multiple images with TTA."""
        return [self.predict(img) for img in images]


# =============================================================================
# ONNX Export
# =============================================================================

def export_to_onnx(
    model: EfficientNetB4Detector,
    output_path: Path,
    image_size: int = IMAGE_SIZE,
    opset_version: int = OPSET_VERSION,
    quantize: bool = False
) -> Path:
    """
    Export model to ONNX format.
    
    Args:
        model: Trained EfficientNetB4Detector
        output_path: Where to save ONNX model
        image_size: Input image size
        opset_version: ONNX opset version
        quantize: Whether to apply FP16 quantization
        
    Returns:
        Path to exported ONNX model
    """
    print(f"\n[INFO] Exporting model to ONNX...")
    print(f"[DEBUG] Output: {output_path}")
    print(f"[DEBUG] Image size: {image_size}x{image_size}")
    print(f"[DEBUG] Opset version: {opset_version}")
    print(f"[DEBUG] Quantize: {quantize}")
    
    model.eval()
    device = next(model.parameters()).device
    
    # Wrap for ONNX (binary output only with sigmoid)
    export_model = EfficientNetB4DetectorONNX(model).to(device)
    export_model.eval()
    
    # Dummy input
    dummy_input = torch.randn(1, 3, image_size, image_size).to(device)
    
    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Export
    torch.onnx.export(
        export_model,
        dummy_input,
        str(output_path),
        export_params=True,
        opset_version=opset_version,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        }
    )
    
    print(f"[SUCCESS] ONNX model exported!")
    
    # Get file size
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"[INFO] Model size: {size_mb:.1f} MB")
    
    # Validate ONNX
    try:
        import onnx
        onnx_model = onnx.load(str(output_path))
        onnx.checker.check_model(onnx_model)
        print("[SUCCESS] ONNX model validation passed!")
    except ImportError:
        print("[WARNING] ONNX package not installed, skipping validation")
    except Exception as e:
        print(f"[WARNING] ONNX validation failed: {e}")
    
    # Quantization (FP16)
    if quantize:
        quantized_path = output_path.with_suffix('.fp16.onnx')
        print(f"\n[INFO] Applying FP16 quantization...")
        
        try:
            from onnxruntime.transformers import float16
            import onnx
            
            model_fp32 = onnx.load(str(output_path))
            model_fp16 = float16.convert_float_to_float16(model_fp32)
            onnx.save(model_fp16, str(quantized_path))
            
            size_fp16 = quantized_path.stat().st_size / (1024 * 1024)
            print(f"[SUCCESS] FP16 model saved: {quantized_path}")
            print(f"[INFO] FP16 size: {size_fp16:.1f} MB (reduction: {(1 - size_fp16/size_mb)*100:.1f}%)")
            
            return quantized_path
        except ImportError:
            print("[WARNING] onnxruntime.transformers not available, skipping FP16")
        except Exception as e:
            print(f"[WARNING] FP16 quantization failed: {e}")
    
    return output_path


# =============================================================================
# Benchmarking
# =============================================================================

def benchmark_onnx(
    model_path: Path,
    num_iterations: int = 100,
    warmup_iterations: int = 10,
    image_size: int = IMAGE_SIZE
) -> dict:
    """
    Benchmark ONNX model inference speed.
    
    Args:
        model_path: Path to ONNX model
        num_iterations: Number of inference iterations
        warmup_iterations: Warmup iterations (not counted)
        image_size: Input image size
        
    Returns:
        Dictionary with benchmark results
    """
    print(f"\n[INFO] Benchmarking ONNX model: {model_path}")
    
    try:
        import onnxruntime as ort
    except ImportError:
        print("[ERROR] onnxruntime not installed. Run: pip install onnxruntime")
        return {}
    
    # Create session
    print("[DEBUG] Creating ONNX Runtime session...")
    session = ort.InferenceSession(
        str(model_path),
        providers=['CPUExecutionProvider']
    )
    
    # Input info
    input_name = session.get_inputs()[0].name
    print(f"[DEBUG] Input name: {input_name}")
    print(f"[DEBUG] Input shape: {session.get_inputs()[0].shape}")
    
    # Create dummy input
    dummy_input = np.random.randn(1, 3, image_size, image_size).astype(np.float32)
    
    # Warmup
    print(f"[DEBUG] Running {warmup_iterations} warmup iterations...")
    for _ in range(warmup_iterations):
        session.run(None, {input_name: dummy_input})
    
    # Benchmark
    print(f"[DEBUG] Running {num_iterations} benchmark iterations...")
    times = []
    
    for i in range(num_iterations):
        start = time.perf_counter()
        output = session.run(None, {input_name: dummy_input})
        elapsed = (time.perf_counter() - start) * 1000  # ms
        times.append(elapsed)
        
        if (i + 1) % 20 == 0:
            print(f"  Iteration {i+1}/{num_iterations}: {elapsed:.1f}ms")
    
    # Calculate statistics
    times = np.array(times)
    results = {
        'mean_ms': float(np.mean(times)),
        'std_ms': float(np.std(times)),
        'min_ms': float(np.min(times)),
        'max_ms': float(np.max(times)),
        'median_ms': float(np.median(times)),
        'p95_ms': float(np.percentile(times, 95)),
        'p99_ms': float(np.percentile(times, 99)),
        'iterations': num_iterations,
        'target_ms': TARGET_INFERENCE_MS,
        'meets_target': float(np.mean(times)) < TARGET_INFERENCE_MS
    }
    
    # Print results
    print("\n" + "=" * 50)
    print("BENCHMARK RESULTS")
    print("=" * 50)
    print(f"Mean:    {results['mean_ms']:.2f} ms")
    print(f"Std:     {results['std_ms']:.2f} ms")
    print(f"Min:     {results['min_ms']:.2f} ms")
    print(f"Max:     {results['max_ms']:.2f} ms")
    print(f"Median:  {results['median_ms']:.2f} ms")
    print(f"P95:     {results['p95_ms']:.2f} ms")
    print(f"P99:     {results['p99_ms']:.2f} ms")
    print("-" * 50)
    print(f"Target:  <{TARGET_INFERENCE_MS} ms")
    print(f"Status:  {'✓ PASS' if results['meets_target'] else '✗ FAIL'}")
    print("=" * 50)
    
    return results


def test_inference(model_path: Path, image_path: Path) -> dict:
    """Test inference on a single image."""
    print(f"\n[INFO] Testing inference on: {image_path}")
    
    try:
        import onnxruntime as ort
    except ImportError:
        print("[ERROR] onnxruntime not installed")
        return {}
    
    # Load image
    image = Image.open(image_path).convert('RGB')
    print(f"[DEBUG] Image size: {image.size}")
    
    # Preprocess
    transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    
    img_tensor = transform(image).unsqueeze(0).numpy()
    
    # Run inference
    session = ort.InferenceSession(str(model_path), providers=['CPUExecutionProvider'])
    input_name = session.get_inputs()[0].name
    
    start = time.perf_counter()
    output = session.run(None, {input_name: img_tensor})
    elapsed = (time.perf_counter() - start) * 1000
    
    probability = float(output[0][0][0])
    prediction = "AI-GENERATED" if probability > 0.5 else "REAL"
    
    print(f"\n[RESULT]")
    print(f"  Probability (AI): {probability:.4f}")
    print(f"  Prediction: {prediction}")
    print(f"  Confidence: {abs(probability - 0.5) * 200:.1f}%")
    print(f"  Inference time: {elapsed:.1f} ms")
    
    return {
        'probability': probability,
        'prediction': prediction,
        'inference_ms': elapsed
    }


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description='UnDiffused ONNX Export & Inference')
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export model to ONNX')
    export_parser.add_argument('--checkpoint', type=str, required=True,
                               help='Path to model checkpoint')
    export_parser.add_argument('--output', type=str, default='public/model.onnx',
                               help='Output ONNX path')
    export_parser.add_argument('--quantize', action='store_true',
                               help='Apply FP16 quantization')
    
    # Benchmark command
    bench_parser = subparsers.add_parser('benchmark', help='Benchmark ONNX model')
    bench_parser.add_argument('--model', type=str, required=True,
                              help='Path to ONNX model')
    bench_parser.add_argument('--iterations', type=int, default=100,
                              help='Number of benchmark iterations')
    
    # Test command
    test_parser = subparsers.add_parser('test', help='Test on single image')
    test_parser.add_argument('--model', type=str, required=True,
                             help='Path to ONNX model')
    test_parser.add_argument('--image', type=str, required=True,
                             help='Path to test image')
    
    args = parser.parse_args()
    
    if args.command == 'export':
        # Load checkpoint
        print(f"[INFO] Loading checkpoint: {args.checkpoint}")
        model = EfficientNetB4Detector(pretrained=False)
        
        checkpoint = torch.load(args.checkpoint, map_location='cpu', weights_only=True)
        if 'state_dict' in checkpoint:
            state_dict = {k.replace('model.', ''): v for k, v in checkpoint['state_dict'].items()}
        else:
            state_dict = checkpoint
        
        model.load_state_dict(state_dict)
        print("[SUCCESS] Checkpoint loaded!")
        
        # Export
        export_to_onnx(
            model,
            Path(args.output),
            quantize=args.quantize
        )
        
    elif args.command == 'benchmark':
        benchmark_onnx(Path(args.model), args.iterations)
        
    elif args.command == 'test':
        test_inference(Path(args.model), Path(args.image))
        
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
