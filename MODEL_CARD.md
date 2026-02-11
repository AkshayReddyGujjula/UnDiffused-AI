# Model Card: UnDiffused AI Image Detector

## Model Details

### Model Description
UnDiffused is a binary classifier that detects AI-generated images. It uses an EfficientNet-B4 backbone with CBAM (Convolutional Block Attention Module) attention and a multi-head classifier for enhanced feature learning.

- **Developed by:** UnDiffused Team
- **Model Type:** Image Classification (Binary + Multi-class)
- **Architecture:** EfficientNet-B4 + CBAM + Multi-Head Classifier
- **Input Size:** 384×384 RGB images
- **Output:** Probability of image being AI-generated (0.0 = Real, 1.0 = AI)
- **License:** MIT

### Model Architecture

```
Input (3×384×384)
    │
    ▼
┌─────────────────────────┐
│  EfficientNet-B4        │
│  (pretrained ImageNet)  │
└─────────────────────────┘
    │ 1792 channels
    ▼
┌─────────────────────────┐
│  CBAM Attention         │
│  (Channel + Spatial)    │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  Global Average Pool    │
└─────────────────────────┘
    │ 1792 features
    ▼
┌─────────────────────────┐
│  Shared FC (512)        │
│  + ReLU + Dropout(0.4)  │
└─────────────────────────┘
    │
    ├──────────────────────┐
    ▼                      ▼
┌────────────┐      ┌────────────┐
│ Binary     │      │ Generator  │
│ Head (1)   │      │ Head (7)   │
└────────────┘      └────────────┘
    │                      │
    ▼                      ▼
  Sigmoid             Softmax
  (Real/AI)           (Which AI)
```

## Training Details

### Hyperparameters

| Parameter | Value |
|-----------|-------|
| Input Resolution | 384×384 |
| Backbone | EfficientNet-B4 |
| Optimizer | AdamW |
| Learning Rate | 3e-5 |
| Weight Decay | 1e-2 |
| Batch Size | 4-6 (effective 32 with accumulation) |
| Scheduler | CosineAnnealingWarmRestarts (T_0=10) |
| Loss Function | Focal Loss (γ=2, α=0.25) |
| Label Smoothing | 0.1 |
| Early Stopping | 15 epochs patience |
| Precision | FP16 (Mixed Precision) |

### Data Augmentation

**Training:**
- JPEG Compression (quality 40-95)
- RandomResizedCrop (scale 0.8-1.0)
- Horizontal Flip (p=0.5)
- Rotation (±15°)
- ColorJitter (brightness±0.3, contrast±0.3)
- Random Erasing (p=0.3)
- Gaussian Noise (std 0.01-0.03, p=0.2)
- MixUp (α=0.4, p=0.2) - Binary head only
- CutMix (α=1.0, p=0.2) - Binary head only

**Validation/Test:**
- Resize to 384×384
- Normalize (ImageNet stats)

### Dataset

| Source | Type | Count |
|--------|------|-------|
| DiffusionDB | AI (SD) | ~10,000 |
| User Provided | AI (Various) | Variable |
| COCO 2017 Val | Real | ~5,000 |
| User Provided | Real | Variable |

**Generator Classes:**
1. Real (human photographs)
2. Midjourney
3. Flux
4. DALL-E 3
5. Stable Diffusion 3.0
6. Adobe Firefly
7. Other AI

## Evaluation

### Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Accuracy | >90% | Overall classification accuracy |
| Precision | >0.90 | Proportion of AI predictions that are correct |
| Recall | >0.90 | Proportion of AI images correctly identified |
| F1 Score | >0.90 | Harmonic mean of precision and recall |
| AUC-ROC | >0.95 | Area under ROC curve |
| Inference | <500ms | CPU inference time per image |

### Known Limitations

1. **Heavily Compressed Images**: JPEG quality <40 may reduce accuracy due to loss of forensic artifacts

2. **Hybrid Images**: Images that combine AI and real elements (e.g., AI background with real subject) may be misclassified

3. **Edited Photos**: Heavily post-processed real photos may trigger false positives

4. **New Generators**: Models trained on older generators may have reduced accuracy on newer AI systems (e.g., future Midjourney versions)

5. **Resolution**: Images smaller than 256×256 are not recommended

## Ethical Considerations

### Intended Use
- Educational tool for understanding AI-generated content
- Research on synthetic media detection
- Personal verification of image authenticity

### Misuse Risks
- **False Accusations**: The model may produce false positives on edited photos
- **Overconfidence**: Users should not treat predictions as definitive proof
- **Adversarial Attacks**: Determined adversaries could potentially evade detection

### Recommendations
1. Always use predictions as one factor among many in authenticity assessment
2. Consider context and provenance of images
3. Do not use for legal or punitive decisions without additional verification
4. Regularly retrain on new generator outputs to maintain accuracy

## Technical Specifications

### ONNX Export

| Property | Value |
|----------|-------|
| Opset Version | 16 |
| Input Name | `input` |
| Input Shape | `[batch, 3, 384, 384]` |
| Output Name | `output` |
| Output Shape | `[batch, 1]` |
| Dynamic Axes | batch_size |

### Hardware Requirements

**Training:**
- GPU: NVIDIA GTX 1660 Ti (6GB) or better
- RAM: 16GB minimum
- Storage: 20GB for dataset

**Inference:**
- CPU: Any x86-64 processor
- RAM: 2GB minimum
- ONNX Runtime Web compatible

## Citation

```bibtex
@software{undiffused2024,
  title = {UnDiffused: Privacy-First AI Image Detector},
  author = {UnDiffused Team},
  year = {2024},
  url = {https://github.com/undiffused/undiffused}
}
```

## Contact

For questions or issues, please open a GitHub issue or contact the development team.
