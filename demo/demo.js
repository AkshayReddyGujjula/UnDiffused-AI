// standard ImageNet mean/std
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

let session = null;

// Helpers
function log(msg) {
    document.getElementById('results').textContent = msg;
    console.log(msg);
}

function updateStatus(msg) {
    document.getElementById('status').textContent = msg;
}

// 1. Load Model
async function loadModel() {
    updateStatus("Loading...");
    try {
        // Try WebGPU first, then WASM
        const options = {
            executionProviders: ['wasm'], // Start with WASM for stability. Change to ['webgpu', 'wasm'] to test GPU.
            graphOptimizationLevel: 'all'
        };

        // Point to the quantified model we just made
        // Note: You must serve this folder or copy the model here
        session = await ort.InferenceSession.create('./model_quantized.onnx', options);

        updateStatus("✅ Model Loaded!");
        document.getElementById('runBtn').disabled = false;
        log("Model loaded successfully. Ready for image.");
    } catch (e) {
        updateStatus("❌ Error: " + e.message);
        console.error(e);
    }
}

// 2. Preprocess Image
async function preprocess(imageElement) {
    const width = 224;
    const height = 224;

    // Draw to canvas to resize and get data
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height).data; // RGBA flat array

    // Float32 Float Array for Tensor: [1, 3, 224, 224]
    const float32Data = new Float32Array(1 * 3 * width * height);

    // HWC -> CHW and Normalize
    for (let c = 0; c < 3; c++) { // Channel: 0=R, 1=G, 2=B
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                // Input Index: (h * width + w) * 4 (RGBA) + c
                // Output Index: c * (height * width) + h * width + w

                const pixelVal = imgData[(h * width + w) * 4 + c]; // 0-255
                const normalized = (pixelVal / 255.0 - MEAN[c]) / STD[c];

                float32Data[c * width * height + h * width + w] = normalized;
            }
        }
    }

    return new ort.Tensor('float32', float32Data, [1, 3, width, height]);
}

// 3. Inference
async function runInference() {
    if (!session) return;
    const img = document.getElementById('preview');
    if (!img.src) return;

    log("Preprocessing...");
    const tensor = await preprocess(img);

    log("Running Inference...");
    const start = performance.now();

    const feeds = { pixel_values: tensor }; // 'pixel_values' is the input name we verified
    const results = await session.run(feeds);

    const end = performance.now();
    const time = (end - start).toFixed(2);

    // Post-process
    const logits = results.logits.data; // Float32Array of size 2
    const probs = softmax(logits);

    log(`Inference Time: ${time} ms\n\n` +
        `Raw Logits: [${logits[0].toFixed(4)}, ${logits[1].toFixed(4)}]\n` +
        `Probabilities:\n` +
        `  Index 0 (FAKE?): ${(probs[0] * 100).toFixed(2)}%\n` +
        `  Index 1 (REAL?): ${(probs[1] * 100).toFixed(2)}%`
    );
}

function softmax(arr) {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}

function previewImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('preview').src = e.target.result;
        reader.readAsDataURL(file);
    }
}
