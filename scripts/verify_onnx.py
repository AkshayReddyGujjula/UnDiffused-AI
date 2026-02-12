import onnx

ONNX_PATH = "onnx_output/model.onnx"

def check_onnx(path):
    print(f"Checking {path}...")
    try:
        model = onnx.load(path)
        onnx.checker.check_model(model)
        print("✅ ONNX Validity Check: PASSED")
    except Exception as e:
        print(f"❌ ONNX Validity Check: FAILED ({e})")
        return

    print("\nGraph Inputs:")
    for inp in model.graph.input:
        shape = [d.dim_value if d.dim_value > 0 else "BATCH" for d in inp.type.tensor_type.shape.dim]
        print(f"  Name: '{inp.name}' | Shape: {shape} | Type: {inp.type.tensor_type.elem_type}")

    print("\nGraph Outputs:")
    for out in model.graph.output:
        shape = [d.dim_value if d.dim_value > 0 else "BATCH" for d in out.type.tensor_type.shape.dim]
        print(f"  Name: '{out.name}' | Shape: {shape} | Type: {out.type.tensor_type.elem_type}")

if __name__ == "__main__":
    check_onnx(ONNX_PATH)
