# UnDiffused: Local AI Image Detector

UnDiffused is a powerful, privacy-first Chrome/Chromium extension that detects AI-generated images locally using a sophisticated dual-model ensemble and on-device ONNX Runtime inference.

## ✨ Features

- **Local Inference**: Zero-copy analysis fully on-device. No image bytes ever leave your machine.
- **Dual-Model Ensemble**: Combines Global and Local deep learning models for maximum accuracy.
- **Adaptive Scanning**: Intelligent subject-aware cropping focused on high-detail areas.
- **Fast Exit Strategy**: High-confidence global scans skip unnecessary processing for near-instant results.
- **Deep Scan Mode**: Comprehensive tiling analysis for forensic-level inspection of large images.
- **Forensic Toolkit**: Built-in tools for ELA (Error Level Analysis), Noise extraction, FFT (Fast Fourier Transform), Contrast Gradients, and Metadata inspection.

## 🧠 Model Architecture

UnDiffused uses a state-of-the-art ensemble approach to distinguish between authentic photographs and AI-generated content:

### 1. Dual-Model Ensemble

- **Global Model**: Analyzes overall image structure, global lighting consistency, and semantic coherence using a 4-quadrant quadrant strategy.
- **Local Model**: Specialized in detecting microscopic AI signatures, GAN artifacts, and diffusion noise patterns in high-resolution local patches.

### 2. Intelligent Inference Pipeline

- **Adaptive Subject-Aware Cropping**: The engine computes a saliency/quality map to identify the most informative regions of an image, generating high-detail crops (224x224) for local analysis.
- **Weighted Fusion**: Results are aggregated using a weighted ensemble (25% Global / 75% Local) with localized refinement based on the **Average of Top 3** highest local scores.
- **WASM Acceleration**: Leverages `onnxruntime-web` with WebAssembly (SIMD + Multi-threading) for high-performance inference.

## 🛠️ Technical Stack

- **Runtime**: ONNX Runtime Web (WASM backend)
- **Frontend**: React + TypeScript + Vite
- **UI Injection**: Shadow DOM for complete stylesheet isolation and zero-conflict with host pages.
- **Parallelization**: Inference is offloaded to an inline Web Worker with `ImageBitmap` transfers to prevent UI thread blocking.

## 🚀 Installation (Development)

1. **Clone and Install**:

   ```bash
   npm install
   ```

2. **Build the Extension**:

   ```bash
   npm run build
   ```

3. **Load in Chrome**:
   - Open `chrome://extensions`
   - Enable **Developer Mode**
   - Click **Load unpacked** and select the `dist` folder.

## 📂 Project Structure

- `src/background/`: Service worker for context menus and extension lifecycle.
- `src/content/`: Core detection logic, Shadow DOM UI, and forensic tools.
- `src/content/inference/`: The "Brain" of UnDiffused.
  - `pipeline.ts`: Orchestrates the scanning phases (Global -> Local).
  - `worker.ts`: Handles heavy ONNX inference and data preprocessing.
  - `crops.ts`: Implements adaptive and tile-based cropping strategies.
- `public/models/`: Bundled ONNX model assets for local execution.

## 🔐 Privacy

UnDiffused is built on the principle of local-first privacy. Image analysis is performed entirely within the sandboxed context of your browser. No data, telemetry, or image bytes are transmitted to external servers.

## 📄 License

MIT
