# 👁️ UnDiffused: Privacy-First AI Image Detector

**UnDiffused** is a cutting-edge Chrome Extension that identifies AI-generated images directly within your browser. 

Unlike most detectors that send your data to a remote server, UnDiffused performs all analysis **100% locally on your computer**. Your images and browsing habits stay private, exactly where they belong.

---

## ✨ Features

*   **🛡️ Total Privacy**: No images ever leave your device. Analysis is powered by ONNX Runtime Web using your local CPU/GPU.
*   **🔍 Professional Image Analysis**: Beyond just a "Real vs AI" score, UnDiffused provides a suite of forensic tools:
    *   **Error Level Analysis (ELA)**: Spots inconsistencies in image compression.
    *   **Noise Pattern Analysis**: Examines sensor fingerprints to find anomalies.
    *   **Clone Detection**: Highlights duplicated regions inside an image.
    *   **Frequency Domain (FFT)**: Reveals periodic patterns common in AI generation.
    *   **Luminance Gradient**: Checks if the lighting follows consistent geometric patterns.
*   **💾 Download Results**: Save your analysis results as high-quality PNGs for sharing or evidence.
*   **💎 Modern UI**: A sleek, dark-mode "Liquid Glass" interface that feels premium and responsive.
*   **⚡ Context Menu**: Just right-click any image on the web and select "Scan with UnDiffused".

---

## 🚀 Easy Installation (For Everyone)

Since UnDiffused is currently in development, you can install it using Chrome's Developer Mode:

1.  **Download the Code**: Click the green **Code** button at the top and select **Download ZIP**. Extract the folder to your desktop.
2.  **Open Chrome Extensions**: Type `chrome://extensions/` in your browser address bar.
3.  **Enable Developer Mode**: Turn on the switch in the top-right corner.
4.  **Load the Extension**: Click **Load unpacked** and select the `dist` folder inside the extracted project directory.
    *   *Note: If the `dist` folder is missing, see the Developer Setup section below.*
5.  **Start Scanning**: You can now right-click any image on the web to start an analysis!

---

## 🛠️ Developer Setup (For Technical Users)

If you want to build the project from scratch or contribute:

### 1. Prerequisites
- **Node.js**: [Download here](https://nodejs.org/) (Version 18 or higher recommended).
- **Python**: [Download here](https://www.python.org/) (Version 3.9+ required for training scripts).

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/AkshayReddyGujjula/UnDiffused-AI.git
cd UnDiffused-AI

# Install frontend dependencies
npm install

# Install python dependencies (for training/scripts)
pip install -r requirements.txt
```

### 3. Build & Run
```bash
# Compile and build the extension
npm run build

# To run in development mode with hot-reload:
npm run dev
```

### 4. Training a Custom Model (Optional)
The extension uses a pre-trained model. To train your own:
1. Place your dataset in `C:\Users\...\DataSets\train` (or update `scripts/train.py`).
2. Run: `python scripts/train.py`
3. The new `model.onnx` will be automatically exported to the `public/` directory.

---

## 🧠 Tech Stack

- **Frontend**: React 18, Tailwind CSS, TypeScript
- **Bundler**: Vite + CRXJS (Vite Chrome Extension Plugin)
- **AI Engine**: ONNX Runtime Web (WASM/WebGL)
- **Model Architecture**: ResNet50 (Fine-tuned for synthetic image detection)
- **Design**: "Liquid Glass" Frosted UI

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.