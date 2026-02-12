import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
# Use skimage data to avoid download errors
from skimage import data
from PIL import Image
import numpy as np
import torch.nn.functional as F

# Config
MODEL_ID = "mmanikanta/SWIN-AI-Image-Detector"

def get_pil_image():
    # Astronaut is a standard real person image included in scikit-image
    # No internet needed for this one
    try:
        img_array = data.astronaut()
        return Image.fromarray(img_array).convert("RGB"), "Real_Astronaut_Local"
    except Exception as e:
        print(f"Could not load local skimage data: {e}")
        # Fallback to creating a dummy noise image (which should look fake/random)
        return Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)), "Random_Noise_Should_Be_Fake"

def main():
    print(f"Loading model: {MODEL_ID}...")
    try:
        processor = AutoImageProcessor.from_pretrained(MODEL_ID)
        model = AutoModelForImageClassification.from_pretrained(MODEL_ID)
    except Exception as e:
        print(f"FAILED to load model: {e}")
        return

    # Force 224x224 resize in processor just in case
    # processor.size = {"height": 224, "width": 224} 

    print(f"Model ID2LABEL: {model.config.id2label}")
    
    image, name = get_pil_image()
    print(f"Testing with: {name}")

    inputs = processor(images=image, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=-1)
        predicted_class_idx = logits.argmax(-1).item()
        label = model.config.id2label[predicted_class_idx]

    print("-" * 40)
    print(f"Prediction: {label} (Index: {predicted_class_idx})")
    print(f"Probabilities: {probs.detach().numpy()[0]}")
    # Explicitly print mapping guess
    print("-" * 40)
    print(f"Index 0 ({model.config.id2label[0]}): {probs[0][0]:.4f}")
    print(f"Index 1 ({model.config.id2label[1]}): {probs[0][1]:.4f}")
    print("-" * 40)

if __name__ == "__main__":
    main()
