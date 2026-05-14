"""
Export a trained PyTorch checkpoint to ONNX.

Usage:
    python scripts/export_onnx.py \
        --checkpoint checkpoints/global/best.pt \
        --model_type global \
        --num_classes 3 \
        --output models/model_global.onnx

Supported model types: global (ResNet-50), local (EfficientNet-B0)
"""

import argparse

import torch
import torchvision.models as models
import torch.nn as nn


def load_model(model_type: str, num_classes: int, checkpoint: str) -> nn.Module:
    if model_type == "global":
        model = models.resnet50(weights=None)
        model.fc = nn.Linear(model.fc.in_features, num_classes)
    elif model_type == "local":
        model = models.efficientnet_b0(weights=None)
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, num_classes)
    else:
        raise ValueError(f"Unknown model_type: {model_type}")

    state = torch.load(checkpoint, map_location="cpu")
    model.load_state_dict(state)
    model.eval()
    return model


def main():
    parser = argparse.ArgumentParser(description="Export PyTorch model to ONNX")
    parser.add_argument("--checkpoint",  required=True, help="Path to .pt checkpoint")
    parser.add_argument("--model_type",  required=True, choices=["global", "local"])
    parser.add_argument("--num_classes", type=int, default=2)
    parser.add_argument("--output",      required=True, help="Output .onnx path")
    parser.add_argument("--opset",       type=int, default=17)
    args = parser.parse_args()

    model = load_model(args.model_type, args.num_classes, args.checkpoint)

    dummy = torch.zeros(1, 3, 224, 224)
    torch.onnx.export(
        model,
        dummy,
        args.output,
        opset_version=args.opset,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
        do_constant_folding=True,
    )
    print(f"Exported: {args.output}")


if __name__ == "__main__":
    main()
