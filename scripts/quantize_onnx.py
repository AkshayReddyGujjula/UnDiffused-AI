import os
from onnxruntime.quantization import quantize_dynamic, QuantType

INPUT_MODEL = "onnx_output/model.onnx"
OUTPUT_MODEL = "onnx_output/model_quantized.onnx"

def quantize():
    print(f"Quantizing {INPUT_MODEL}...")
    
    if not os.path.exists(INPUT_MODEL):
        print(f"Error: {INPUT_MODEL} not found.")
        return

    # Dynamic Quantization (INT8)
    # This reduces weights to 8-bit integers, usually 4x smaller execution
    quantize_dynamic(
        model_input=INPUT_MODEL,
        model_output=OUTPUT_MODEL,
        weight_type=QuantType.QUInt8 # QUInt8 is standard for broad compatibility
    )
    
    # Compare sizes
    orig_size = os.path.getsize(INPUT_MODEL) / (1024 * 1024)
    quant_size = os.path.getsize(OUTPUT_MODEL) / (1024 * 1024)
    
    print("-" * 40)
    print(f"Original Size:  {orig_size:.2f} MB")
    print(f"Quantized Size: {quant_size:.2f} MB")
    print(f"Reduction:      {orig_size / quant_size:.1f}x")
    print("-" * 40)
    print(f"✅ Quantized model saved to: {OUTPUT_MODEL}")

if __name__ == "__main__":
    quantize()
