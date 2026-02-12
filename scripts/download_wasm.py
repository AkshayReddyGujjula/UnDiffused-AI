import requests
import os

WASM_DIR = "public/wasm"
# Keep this aligned with package.json onnxruntime-web dependency.
VERSION = "1.18.0"
FILES = [
    "ort-wasm.wasm",
    "ort-wasm-simd.wasm",
    "ort-wasm-simd-threaded.wasm"
]

def download_wasm():
    if not os.path.exists(WASM_DIR):
        os.makedirs(WASM_DIR)
        
    for file in FILES:
        url = f"https://cdn.jsdelivr.net/npm/onnxruntime-web@{VERSION}/dist/{file}"
        print(f"Downloading {file} from {url}...")
        try:
            r = requests.get(url)
            r.raise_for_status()
            with open(os.path.join(WASM_DIR, file), 'wb') as f:
                f.write(r.content)
            print(f"✅ Saved {file}")
        except Exception as e:
            print(f"❌ Failed to download {file}: {e}")

if __name__ == "__main__":
    download_wasm()
