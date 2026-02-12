from optimum.exporters.onnx import main_export
import os

OUTPUT_DIR = "onnx_output"
MODEL_ID = "mmanikanta/SWIN-AI-Image-Detector"

def export():
    print(f"Exporting {MODEL_ID} to {OUTPUT_DIR}...")
    
    # Exporting using Optimum's main_export function
    # This handles the loading, tracing, and saving of the ONNX model and config
    main_export(
        model_name_or_path=MODEL_ID,
        output=OUTPUT_DIR,
        task="image-classification",
        opset=17, # Standard opset
        no_post_process=True # We prefer raw logits for the extension
    )
    
    print(f"✅ Export complete! Model saved to: {os.path.abspath(OUTPUT_DIR)}")

if __name__ == "__main__":
    export()
