"""
UnDiffused Model Architecture
=============================
Production-grade EfficientNet-B4 based AI Image Detector with:
- CBAM (Convolutional Block Attention Module) attention
- Multi-head classifier (Binary + Generator classification)
- Focal Loss with label smoothing

Optimized for GTX 1660 Ti (6GB VRAM) at 384x384 input resolution.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import timm
from typing import Tuple, Optional


# =============================================================================
# CBAM: Convolutional Block Attention Module
# =============================================================================

class ChannelAttention(nn.Module):
    """Channel attention module for CBAM."""
    
    def __init__(self, in_channels: int, reduction_ratio: int = 16):
        super().__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)
        
        # Shared MLP
        self.mlp = nn.Sequential(
            nn.Conv2d(in_channels, in_channels // reduction_ratio, 1, bias=False),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_channels // reduction_ratio, in_channels, 1, bias=False)
        )
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        avg_out = self.mlp(self.avg_pool(x))
        max_out = self.mlp(self.max_pool(x))
        attention = torch.sigmoid(avg_out + max_out)
        return x * attention


class SpatialAttention(nn.Module):
    """Spatial attention module for CBAM."""
    
    def __init__(self, kernel_size: int = 7):
        super().__init__()
        padding = kernel_size // 2
        self.conv = nn.Conv2d(2, 1, kernel_size, padding=padding, bias=False)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        concat = torch.cat([avg_out, max_out], dim=1)
        attention = torch.sigmoid(self.conv(concat))
        return x * attention


class CBAM(nn.Module):
    """
    Convolutional Block Attention Module.
    
    Applies channel attention followed by spatial attention to focus
    on forensically-relevant features in the image.
    """
    
    def __init__(self, in_channels: int, reduction_ratio: int = 16, kernel_size: int = 7):
        super().__init__()
        self.channel_attention = ChannelAttention(in_channels, reduction_ratio)
        self.spatial_attention = SpatialAttention(kernel_size)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.channel_attention(x)
        x = self.spatial_attention(x)
        return x


# =============================================================================
# Multi-Head Classifier
# =============================================================================

class MultiHeadClassifier(nn.Module):
    """
    Multi-head classifier for AI image detection.
    
    Head 1: Binary classification (Real vs AI)
    Head 2: Generator classification (which AI model made this)
    
    The generator head provides auxiliary supervision that helps learn
    more discriminative features for the primary binary task.
    """
    
    # Generator classes
    GENERATORS = ['real', 'midjourney', 'flux', 'dalle3', 'sd3', 'firefly', 'other']
    NUM_GENERATORS = len(GENERATORS)
    
    def __init__(self, in_features: int, dropout: float = 0.4):
        super().__init__()
        
        # Shared feature projection
        self.shared = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
        )
        
        # Binary head: Real (0) vs AI (1)
        self.binary_head = nn.Linear(512, 1)
        
        # Generator head: 7-way classification
        self.generator_head = nn.Linear(512, self.NUM_GENERATORS)
        
    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Returns:
            binary_logits: Shape (B, 1) - logits for Real/AI classification
            generator_logits: Shape (B, 7) - logits for generator classification
        """
        features = self.shared(x)
        binary_logits = self.binary_head(features)
        generator_logits = self.generator_head(features)
        return binary_logits, generator_logits


# =============================================================================
# Focal Loss with Label Smoothing
# =============================================================================

class FocalLoss(nn.Module):
    """
    Focal Loss for handling class imbalance and hard examples.
    
    FL(p_t) = -alpha_t * (1 - p_t)^gamma * log(p_t)
    
    With optional label smoothing to prevent overconfidence.
    """
    
    def __init__(
        self, 
        alpha: float = 0.25, 
        gamma: float = 2.0, 
        label_smoothing: float = 0.1
    ):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.label_smoothing = label_smoothing
        
    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        """
        Args:
            logits: Shape (B, 1) - raw logits
            targets: Shape (B, 1) - binary labels (0 or 1)
        """
        # Apply label smoothing
        if self.label_smoothing > 0:
            targets = targets * (1 - self.label_smoothing) + 0.5 * self.label_smoothing
        
        # Compute focal loss
        probs = torch.sigmoid(logits)
        
        # For positive samples (AI images)
        pos_loss = -self.alpha * ((1 - probs) ** self.gamma) * targets * F.logsigmoid(logits)
        
        # For negative samples (Real images)
        neg_loss = -(1 - self.alpha) * (probs ** self.gamma) * (1 - targets) * F.logsigmoid(-logits)
        
        loss = pos_loss + neg_loss
        return loss.mean()


class MultiTaskLoss(nn.Module):
    """
    Combined loss for multi-head classification.
    
    Total = alpha * FocalLoss(binary) + beta * CrossEntropy(generator)
    
    Default weights prioritize binary classification (0.7) while still
    leveraging generator classification for feature learning (0.3).
    """
    
    def __init__(
        self, 
        alpha: float = 0.7, 
        beta: float = 0.3,
        focal_gamma: float = 2.0,
        focal_alpha: float = 0.25,
        label_smoothing: float = 0.1
    ):
        super().__init__()
        self.alpha = alpha
        self.beta = beta
        
        self.focal_loss = FocalLoss(
            alpha=focal_alpha, 
            gamma=focal_gamma, 
            label_smoothing=label_smoothing
        )
        
        self.generator_loss = nn.CrossEntropyLoss(label_smoothing=label_smoothing)
        
    def forward(
        self, 
        binary_logits: torch.Tensor, 
        generator_logits: torch.Tensor,
        binary_targets: torch.Tensor,
        generator_targets: torch.Tensor
    ) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Returns:
            total_loss: Combined weighted loss
            binary_loss: Loss from binary head
            generator_loss: Loss from generator head
        """
        binary_loss = self.focal_loss(binary_logits, binary_targets)
        gen_loss = self.generator_loss(generator_logits, generator_targets)
        
        total_loss = self.alpha * binary_loss + self.beta * gen_loss
        
        return total_loss, binary_loss, gen_loss


# =============================================================================
# Main Model: EfficientNet-B4 Detector
# =============================================================================

class EfficientNetB4Detector(nn.Module):
    """
    Production-grade AI Image Detector using EfficientNet-B4 backbone.
    
    Features:
    - Pre-trained EfficientNet-B4 backbone (timm)
    - CBAM attention for forensic artifact focus
    - Multi-head classifier (Binary + Generator)
    
    Memory footprint at 384x384 with FP16:
    - Model: ~70MB parameters
    - Forward pass: ~3GB VRAM
    - Safe batch size: 4-6 on 6GB GPU
    """
    
    def __init__(
        self, 
        pretrained: bool = True, 
        dropout: float = 0.4,
        use_cbam: bool = True
    ):
        super().__init__()
        
        print("[DEBUG] Initializing EfficientNet-B4 backbone...")
        
        # Load pretrained EfficientNet-B4 without classifier head
        self.backbone = timm.create_model(
            'efficientnet_b4',
            pretrained=pretrained,
            num_classes=0,  # Remove classifier
            global_pool=''  # Remove global pooling (we'll add our own)
        )
        
        # Get feature dimension (1792 for EfficientNet-B4)
        self.feature_dim = self.backbone.num_features
        print(f"[DEBUG] Backbone feature dimension: {self.feature_dim}")
        
        # CBAM attention module
        self.use_cbam = use_cbam
        if use_cbam:
            self.cbam = CBAM(self.feature_dim)
            print("[DEBUG] CBAM attention enabled")
        
        # Global average pooling
        self.global_pool = nn.AdaptiveAvgPool2d(1)
        
        # Multi-head classifier
        self.classifier = MultiHeadClassifier(self.feature_dim, dropout=dropout)
        
        print(f"[DEBUG] Model initialized with {self.count_parameters():,} parameters")
        
    def count_parameters(self) -> int:
        """Count trainable parameters."""
        return sum(p.numel() for p in self.parameters() if p.requires_grad)
        
    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass.
        
        Args:
            x: Input tensor of shape (B, 3, H, W)
            
        Returns:
            binary_logits: Shape (B, 1)
            generator_logits: Shape (B, 7)
        """
        # Extract features from backbone
        features = self.backbone(x)  # (B, 1792, H/32, W/32)
        
        # Apply CBAM attention
        if self.use_cbam:
            features = self.cbam(features)
        
        # Global pooling
        features = self.global_pool(features)  # (B, 1792, 1, 1)
        features = features.flatten(1)  # (B, 1792)
        
        # Multi-head classification
        binary_logits, generator_logits = self.classifier(features)
        
        return binary_logits, generator_logits
    
    def get_binary_prediction(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Get binary prediction for inference.
        
        Returns:
            probabilities: Shape (B,) - probability of being AI-generated
            predictions: Shape (B,) - binary predictions (0=Real, 1=AI)
        """
        binary_logits, _ = self.forward(x)
        probabilities = torch.sigmoid(binary_logits).squeeze(-1)
        predictions = (probabilities > 0.5).float()
        return probabilities, predictions


# =============================================================================
# Model for ONNX Export (Binary only, with Sigmoid)
# =============================================================================

class EfficientNetB4DetectorONNX(nn.Module):
    """
    Wrapper for ONNX export - returns only binary probability.
    
    This simplified version is used for browser inference where we only
    need the Real/AI probability, not the generator classification.
    """
    
    def __init__(self, detector: EfficientNetB4Detector):
        super().__init__()
        self.detector = detector
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Returns probability of image being AI-generated."""
        binary_logits, _ = self.detector(x)
        return torch.sigmoid(binary_logits)


# =============================================================================
# Utility Functions
# =============================================================================

def get_model(pretrained: bool = True, use_cbam: bool = True) -> EfficientNetB4Detector:
    """Factory function to create the detector model."""
    return EfficientNetB4Detector(pretrained=pretrained, use_cbam=use_cbam)


def load_model_for_inference(checkpoint_path: str, device: str = 'cpu') -> EfficientNetB4Detector:
    """Load a trained model for inference."""
    model = EfficientNetB4Detector(pretrained=False)
    state_dict = torch.load(checkpoint_path, map_location=device, weights_only=True)
    
    # Handle Lightning checkpoint format
    if 'state_dict' in state_dict:
        state_dict = state_dict['state_dict']
        # Remove 'model.' prefix if present
        state_dict = {k.replace('model.', ''): v for k, v in state_dict.items()}
    
    model.load_state_dict(state_dict)
    model.eval()
    print(f"[DEBUG] Loaded model from {checkpoint_path}")
    return model


# =============================================================================
# Test Code
# =============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Testing EfficientNet-B4 Detector Architecture")
    print("=" * 60)
    
    # Create model
    model = get_model(pretrained=True, use_cbam=True)
    
    # Test forward pass
    print("\n[TEST] Forward pass with batch of 2 images at 384x384...")
    x = torch.randn(2, 3, 384, 384)
    binary_logits, generator_logits = model(x)
    
    print(f"  Input shape: {x.shape}")
    print(f"  Binary logits shape: {binary_logits.shape}")
    print(f"  Generator logits shape: {generator_logits.shape}")
    
    # Test loss computation
    print("\n[TEST] Loss computation...")
    criterion = MultiTaskLoss()
    binary_targets = torch.tensor([[1.0], [0.0]])  # First is AI, second is Real
    generator_targets = torch.tensor([1, 0])  # Midjourney and Real
    
    total_loss, binary_loss, gen_loss = criterion(
        binary_logits, generator_logits, 
        binary_targets, generator_targets
    )
    
    print(f"  Total loss: {total_loss.item():.4f}")
    print(f"  Binary loss: {binary_loss.item():.4f}")
    print(f"  Generator loss: {gen_loss.item():.4f}")
    
    # Test ONNX wrapper
    print("\n[TEST] ONNX export wrapper...")
    onnx_model = EfficientNetB4DetectorONNX(model)
    probs = onnx_model(x)
    print(f"  Output probabilities shape: {probs.shape}")
    print(f"  Probabilities: {probs.squeeze().tolist()}")
    
    # Memory estimation
    print("\n[INFO] Memory estimation:")
    param_size = sum(p.numel() * p.element_size() for p in model.parameters())
    print(f"  Model parameters: {model.count_parameters():,}")
    print(f"  Parameter memory: {param_size / 1024**2:.1f} MB")
    
    print("\n" + "=" * 60)
    print("All tests passed!")
    print("=" * 60)
