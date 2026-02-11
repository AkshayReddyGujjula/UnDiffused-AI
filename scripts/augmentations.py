"""
UnDiffused Custom Augmentations
===============================
Domain-specific augmentations for AI image detection:
- JPEG compression simulation
- Gaussian noise injection
- MixUp/CutMix for batch-level augmentation

These augmentations help the model generalise across:
- Various compression levels (social media uploads)
- Different noise profiles
- Partial occlusions and artifact patterns
"""

import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import io
import random
from typing import Tuple, Optional


# =============================================================================
# JPEG Compression Simulation
# =============================================================================

class JPEGCompression:
    """
    Simulates JPEG compression artifacts during training.
    
    This is critical for robustness since most images on the web
    are JPEG compressed, which can obscure AI-generation artifacts.
    """
    
    def __init__(self, quality_range: Tuple[int, int] = (40, 95)):
        """
        Args:
            quality_range: (min_quality, max_quality) for JPEG compression
        """
        self.quality_range = quality_range
        
    def __call__(self, img: Image.Image) -> Image.Image:
        """Apply random JPEG compression to PIL Image."""
        quality = random.randint(*self.quality_range)
        
        # Compress and decompress via memory buffer
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=quality)
        buffer.seek(0)
        
        compressed = Image.open(buffer).convert('RGB')
        return compressed
    
    def __repr__(self):
        return f"JPEGCompression(quality_range={self.quality_range})"


# =============================================================================
# Gaussian Noise
# =============================================================================

class GaussianNoise:
    """
    Adds random Gaussian noise to images.
    
    Helps model learn to detect AI artifacts even in noisy conditions
    (low-light photos, sensor noise, etc.)
    """
    
    def __init__(self, std_range: Tuple[float, float] = (0.01, 0.05), p: float = 0.3):
        """
        Args:
            std_range: Range of standard deviation for noise
            p: Probability of applying noise
        """
        self.std_range = std_range
        self.p = p
        
    def __call__(self, tensor: torch.Tensor) -> torch.Tensor:
        """Add noise to tensor (C, H, W)."""
        if random.random() > self.p:
            return tensor
            
        std = random.uniform(*self.std_range)
        noise = torch.randn_like(tensor) * std
        noisy = tensor + noise
        
        # Clamp to valid range
        return torch.clamp(noisy, 0, 1)
    
    def __repr__(self):
        return f"GaussianNoise(std_range={self.std_range}, p={self.p})"


# =============================================================================
# MixUp Augmentation
# =============================================================================

def mixup_data(
    x: torch.Tensor, 
    y_binary: torch.Tensor,
    y_generator: torch.Tensor,
    alpha: float = 0.4
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor, torch.Tensor, torch.Tensor, float]:
    """
    MixUp: Creates virtual training examples by mixing pairs of images.
    
    x' = λ * x_i + (1-λ) * x_j
    
    For binary labels, we mix the labels:
    y' = λ * y_i + (1-λ) * y_j
    
    For generator labels, we return both labels and lambda for loss computation.
    
    Args:
        x: Batch of images (B, C, H, W)
        y_binary: Binary labels (B, 1)
        y_generator: Generator labels (B,)
        alpha: Beta distribution parameter (higher = more mixing)
        
    Returns:
        mixed_x: Mixed images
        y_binary_a, y_binary_b: Original binary labels
        y_generator_a, y_generator_b: Original generator labels
        lam: Mixing coefficient
    """
    if alpha > 0:
        lam = np.random.beta(alpha, alpha)
    else:
        lam = 1.0
        
    batch_size = x.size(0)
    index = torch.randperm(batch_size, device=x.device)
    
    mixed_x = lam * x + (1 - lam) * x[index]
    
    y_binary_a, y_binary_b = y_binary, y_binary[index]
    y_generator_a, y_generator_b = y_generator, y_generator[index]
    
    return mixed_x, y_binary_a, y_binary_b, y_generator_a, y_generator_b, lam


def mixup_criterion(
    criterion,
    pred_binary: torch.Tensor,
    pred_generator: torch.Tensor,
    y_binary_a: torch.Tensor,
    y_binary_b: torch.Tensor,
    y_generator_a: torch.Tensor,
    y_generator_b: torch.Tensor,
    lam: float
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """
    Compute MixUp loss with multi-task criterion.
    
    Loss is computed as weighted sum of losses for both mixed samples.
    """
    # Compute loss for both parts of the mix
    total_a, binary_a, gen_a = criterion(
        pred_binary, pred_generator, y_binary_a, y_generator_a
    )
    total_b, binary_b, gen_b = criterion(
        pred_binary, pred_generator, y_binary_b, y_generator_b
    )
    
    # Weighted combination
    total_loss = lam * total_a + (1 - lam) * total_b
    binary_loss = lam * binary_a + (1 - lam) * binary_b
    gen_loss = lam * gen_a + (1 - lam) * gen_b
    
    return total_loss, binary_loss, gen_loss


# =============================================================================
# CutMix Augmentation
# =============================================================================

def cutmix_data(
    x: torch.Tensor,
    y_binary: torch.Tensor,
    y_generator: torch.Tensor,
    alpha: float = 1.0
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor, torch.Tensor, torch.Tensor, float]:
    """
    CutMix: Cuts and pastes patches between training images.
    
    Unlike MixUp which blends entire images, CutMix cuts a rectangular
    region from one image and pastes it onto another. This forces the
    model to learn from partial image information.
    
    Args:
        x: Batch of images (B, C, H, W)
        y_binary: Binary labels (B, 1)
        y_generator: Generator labels (B,)
        alpha: Beta distribution parameter
        
    Returns:
        mixed_x: Images with cut-pasted regions
        y_binary_a, y_binary_b: Original binary labels
        y_generator_a, y_generator_b: Original generator labels
        lam: Actual mixing ratio (based on box area)
    """
    if alpha > 0:
        lam = np.random.beta(alpha, alpha)
    else:
        lam = 1.0
        
    batch_size = x.size(0)
    index = torch.randperm(batch_size, device=x.device)
    
    # Get bounding box
    _, _, H, W = x.shape
    bbx1, bby1, bbx2, bby2 = _rand_bbox(W, H, lam)
    
    # Apply cutmix
    mixed_x = x.clone()
    mixed_x[:, :, bby1:bby2, bbx1:bbx2] = x[index, :, bby1:bby2, bbx1:bbx2]
    
    # Adjust lambda based on actual box area
    lam = 1 - ((bbx2 - bbx1) * (bby2 - bby1) / (W * H))
    
    y_binary_a, y_binary_b = y_binary, y_binary[index]
    y_generator_a, y_generator_b = y_generator, y_generator[index]
    
    return mixed_x, y_binary_a, y_binary_b, y_generator_a, y_generator_b, lam


def _rand_bbox(W: int, H: int, lam: float) -> Tuple[int, int, int, int]:
    """Generate random bounding box for CutMix."""
    cut_ratio = np.sqrt(1.0 - lam)
    cut_w = int(W * cut_ratio)
    cut_h = int(H * cut_ratio)
    
    cx = np.random.randint(W)
    cy = np.random.randint(H)
    
    bbx1 = np.clip(cx - cut_w // 2, 0, W)
    bby1 = np.clip(cy - cut_h // 2, 0, H)
    bbx2 = np.clip(cx + cut_w // 2, 0, W)
    bby2 = np.clip(cy + cut_h // 2, 0, H)
    
    return bbx1, bby1, bbx2, bby2


# =============================================================================
# Combined Augmentation Pipeline
# =============================================================================

class MixUpCutMix:
    """
    Applies either MixUp or CutMix with given probabilities.
    
    Recommended usage: Apply with p=0.5, giving each technique ~25% chance.
    """
    
    def __init__(
        self, 
        mixup_alpha: float = 0.4,
        cutmix_alpha: float = 1.0,
        mixup_prob: float = 0.25,
        cutmix_prob: float = 0.25
    ):
        self.mixup_alpha = mixup_alpha
        self.cutmix_alpha = cutmix_alpha
        self.mixup_prob = mixup_prob
        self.cutmix_prob = cutmix_prob
        
    def __call__(
        self, 
        x: torch.Tensor, 
        y_binary: torch.Tensor,
        y_generator: torch.Tensor
    ):
        """
        Apply MixUp or CutMix to batch.
        
        Returns:
            Same format as mixup_data and cutmix_data, plus a flag indicating
            whether augmentation was applied.
        """
        r = random.random()
        
        if r < self.mixup_prob:
            print("[DEBUG] Applying MixUp augmentation")
            return (*mixup_data(x, y_binary, y_generator, self.mixup_alpha), True)
        elif r < self.mixup_prob + self.cutmix_prob:
            print("[DEBUG] Applying CutMix augmentation")  
            return (*cutmix_data(x, y_binary, y_generator, self.cutmix_alpha), True)
        else:
            # No augmentation - return original data
            batch_size = x.size(0)
            return (
                x, 
                y_binary, y_binary,
                y_generator, y_generator,
                1.0,
                False
            )


# =============================================================================
# Test Code
# =============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Testing Custom Augmentations")
    print("=" * 60)
    
    # Test JPEG compression
    print("\n[TEST] JPEG Compression...")
    jpeg_aug = JPEGCompression(quality_range=(40, 95))
    test_img = Image.new('RGB', (256, 256), color=(128, 128, 128))
    compressed = jpeg_aug(test_img)
    print(f"  Original size: {test_img.size}")
    print(f"  Compressed size: {compressed.size}")
    print(f"  {jpeg_aug}")
    
    # Test Gaussian noise
    print("\n[TEST] Gaussian Noise...")
    noise_aug = GaussianNoise(std_range=(0.01, 0.05), p=1.0)
    test_tensor = torch.rand(3, 64, 64)
    noisy = noise_aug(test_tensor)
    print(f"  Input range: [{test_tensor.min():.3f}, {test_tensor.max():.3f}]")
    print(f"  Output range: [{noisy.min():.3f}, {noisy.max():.3f}]")
    print(f"  {noise_aug}")
    
    # Test MixUp
    print("\n[TEST] MixUp...")
    batch_x = torch.rand(4, 3, 64, 64)
    batch_y_binary = torch.tensor([[1.0], [0.0], [1.0], [0.0]])
    batch_y_gen = torch.tensor([1, 0, 2, 0])
    
    mixed_x, y_a, y_b, g_a, g_b, lam = mixup_data(
        batch_x, batch_y_binary, batch_y_gen, alpha=0.4
    )
    print(f"  Lambda: {lam:.3f}")
    print(f"  Mixed shape: {mixed_x.shape}")
    
    # Test CutMix
    print("\n[TEST] CutMix...")
    cut_x, y_a, y_b, g_a, g_b, lam = cutmix_data(
        batch_x, batch_y_binary, batch_y_gen, alpha=1.0
    )
    print(f"  Lambda (after box adjustment): {lam:.3f}")
    print(f"  Cut shape: {cut_x.shape}")
    
    # Test combined
    print("\n[TEST] MixUpCutMix Combined...")
    combined = MixUpCutMix(mixup_prob=0.5, cutmix_prob=0.5)
    for i in range(5):
        result = combined(batch_x, batch_y_binary, batch_y_gen)
        applied = result[-1]
        print(f"  Iteration {i+1}: Augmentation applied = {applied}")
    
    print("\n" + "=" * 60)
    print("All augmentation tests passed!")
    print("=" * 60)
