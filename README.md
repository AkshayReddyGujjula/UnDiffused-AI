# 👁️ UnDiffused: Privacy-First AI Image Detector

**UnDiffused** is a premium Chrome Extension that identifies AI-generated images directly within your browser. Powered by state-of-the-art computer vision, it provides professional-grade forensic tools while keeping your data **100% private and local**.

---

## ✨ Features

* **🛡️ Total Privacy**: No images ever leave your device. All analysis is performed locally using ONNX Runtime Web.
* **🧠 Advanced Detection**: Uses an **EfficientNet-B4** architecture with **CBAM Attention** for high-accuracy synthetic image detection.
* **🔍 Forensic Suite**: Professional tools to spot AI inconsistencies:
  * **Error Level Analysis (ELA)**: Detects compression anomalies.
  * **Noise Analysis**: Uncovers sensor fingerprint irregularities.
  * **FFT Analysis**: Highlights periodic patterns typical in AI generation.
  * **Luminance Gradient**: Verifies lighting consistency across the image.
* **🎨 Liquid Glass UI**: A stunning, responsive interface with smooth "fluid water" animations and premium glassmorphism.
* **⚡ Instant Scan**: Right-click any image on the web or drag-and-drop into the popup for immediate results.

---

## 🚀 Easy Installation

Since UnDiffused is in active development, you can install it manually in Chrome:

1. **Download**: Click the green **Code** button and select **Download ZIP**. Extract the folder.
2. **Open Extensions**: Go to `chrome://extensions/` in your browser.
3. **Developer Mode**: Enable the toggle in the top-right corner.
4. **Load Unpacked**: Click **Load unpacked** and select the `dist` folder in the project directory.
    * *Note: If `dist` is missing, follow the Developer Setup below.*

---

## 🛠️ Developer Setup

If you want to build or contribute to the project:

### 1. Prerequisites

* **Node.js** (v18+)
* **NPM**

### 2. Setup

```bash
# Clone and install
git clone https://github.com/AkshayReddyGujjula/UnDiffused-AI.git
cd UnDiffused-AI
npm install

# Build the project
npm run build
```

---

## 🧠 Tech Stack

* **Framework**: React 18 + Vite + TypeScript
* **AI Engine**: ONNX Runtime Web (WASM/WebGL)
* **Architecture**: EfficientNet-B4 + CBAM Attention
* **Styling**: Tailwind CSS + "Liquid Glass" Design System

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for details.
