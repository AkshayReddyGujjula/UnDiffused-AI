"""
Apply dynamic INT8 quantization to an exported ONNX model.

Usage:
    python scripts/quantize_onnx.py \
        --input  models/model_global.onnx \
        --output models/model_global_quantized.onnx

Dynamic quantization reduces model size by ~4x and inference latency on CPU
with minimal accuracy loss. Static quantization requires calibration data and
can yield slightly better results; dynamic is the default here.
"""

import argparse
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Quantize ONNX model to INT8")
    parser.add_argument("--input",  required=True, help="Input .onnx path")
    parser.add_argument("--output", required=True, help="Output quantized .onnx path")
    parser.add_argument(
        "--mode", choices=["dynamic", "static"], default="dynamic",
        help="Quantization mode (dynamic does not need calibration data)"
    )
    parser.add_argument(
        "--calibration_data", default=None,
        help="Path to calibration image directory (required for static mode)"
    )
    args = parser.parse_args()

    try:
        from onnxruntime.quantization import quantize_dynamic, QuantType
        from onnxruntime.quantization import quantize_static, CalibrationDataReader
    except ImportError:
        raise SystemExit("Install onnxruntime: pip install onnxruntime")

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)

    if args.mode == "dynamic":
        quantize_dynamic(
            model_input=args.input,
            model_output=args.output,
            weight_type=QuantType.QInt8,
        )
        print(f"Dynamic INT8 quantization complete: {args.output}")

    else:
        if not args.calibration_data:
            raise SystemExit("--calibration_data is required for static quantization")

        import numpy as np
        import os
        from PIL import Image

        class ImageCalibReader(CalibrationDataReader):
            def __init__(self, data_dir: str, n_samples: int = 100):
                self.images = [
                    os.path.join(data_dir, f)
                    for f in os.listdir(data_dir)
                    if f.lower().endswith((".jpg", ".jpeg", ".png"))
                ][:n_samples]
                self.idx = 0
                self.mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
                self.std  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

            def get_next(self):
                if self.idx >= len(self.images):
                    return None
                img = Image.open(self.images[self.idx]).convert("RGB").resize((224, 224))
                arr = np.array(img, dtype=np.float32) / 255.0
                arr = (arr - self.mean) / self.std
                arr = arr.transpose(2, 0, 1)[np.newaxis]  # NCHW
                self.idx += 1
                return {"input": arr}

        quantize_static(
            model_input=args.input,
            model_output=args.output,
            calibration_data_reader=ImageCalibReader(args.calibration_data),
            weight_type=QuantType.QInt8,
        )
        print(f"Static INT8 quantization complete: {args.output}")


if __name__ == "__main__":
    main()
