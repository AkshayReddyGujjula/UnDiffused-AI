import torch
import onnxruntime as ort
import numpy as np
from transformers import AutoImageProcessor, AutoModelForImageClassification
from skimage import data
from PIL import Image
import torch.nn.functional as F

# Config
PYTORCH_MODEL_ID = "mmanikanta/SWIN-AI-Image-Detector"
ONNX_MODEL_PATH = "onnx_output/model_quantized.onnx"

def to_numpy(tensor):
    return tensor.detach().cpu().numpy() if tensor.requires_grad else tensor.cpu().numpy()

def main():
    print("Loading PyTorch model...")
    processor = AutoImageProcessor.from_pretrained(PYTORCH_MODEL_ID)
    pt_model = AutoModelForImageClassification.from_pretrained(PYTORCH_MODEL_ID)
    
    print(f"Loading Quantized ONNX model: {ONNX_MODEL_PATH}...")
    ort_session = ort.InferenceSession(ONNX_MODEL_PATH)
    
    # Test Image (Astronaut)
    image = Image.fromarray(data.astronaut()).convert("RGB")
    
    # Preprocess
    inputs = processor(images=image, return_tensors="pt")
    
    # 1. PyTorch Inference
    print("Running PyTorch inference...")
    with torch.no_grad():
        pt_outputs = pt_model(**inputs)
        pt_logits = pt_outputs.logits
        pt_probs = F.softmax(pt_logits, dim=-1)

    # 2. ONNX Inference
    print("Running ONNX inference...")
    onnx_inputs = {ort_session.get_inputs()[0].name: to_numpy(inputs["pixel_values"])}
    onnx_outs = ort_session.run(None, onnx_inputs)
    onnx_logits = onnx_outs[0]
    # Softmax on numpy
    def softmax(x):
        e_x = np.exp(x - np.max(x))
        return e_x / e_x.sum(axis=0)
    
    onnx_probs = softmax(onnx_logits[0])

    # Comparison
    print("\n" + "="*50)
    print("PARITY CHECK")
    print("="*50)
    print(f"PyTorch Logits: {pt_logits.numpy()[0]}")
    print(f"ONNX Logits:    {onnx_logits[0]}")
    print("-" * 30)
    print(f"PyTorch Probs:  {pt_probs.numpy()[0]}")
    print(f"ONNX Probs:     {onnx_probs}")
    
    # MSE Check
    mse = np.mean((pt_logits.numpy() - onnx_logits)**2)
    print("-" * 30)
    print(f"Mean Squared Error (Logits): {mse:.6f}")
    
    if mse < 0.1: # Quantization introduces some noise, <0.1 is usually good for logits
        print("✅ PARITY SUCCESS (Differences are within acceptable quantization range)")
    else:
        print("⚠️  PARITY WARNING (Large difference detected)")

if __name__ == "__main__":
    main()
