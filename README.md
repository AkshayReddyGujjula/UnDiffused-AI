# UnDiffused 🔍

**Privacy-first Chrome Extension that detects AI-generated images.**

All processing happens locally on your device — no data leaves your browser.

## ✨ Features

- 🔒 **100% Privacy** - Local ONNX inference, no server calls
- 🎨 **Liquid Glass UI** - Stunning dark mode design with optical physics effects
- ⚡ **Fast Detection** - Trained on CIFAKE dataset using gradient texture analysis
- 🖱️ **Easy to Use** - Right-click any image → "Scan with UnDiffused"

## 🚀 Setup

### Prerequisites

1. **Node.js** (v18+): [Download here](https://nodejs.org/)
2. **Python 3.11+**: Already installed ✓

### Installation

```bash
# 1. Install npm dependencies
npm install

# 2. Train the model (using the virtual environment)
C:\venv\undiff\Scripts\python.exe scripts/train.py

# 3. Build the extension
npm run build
```

### Loading in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` folder

## 📁 Project Structure

```
AI-Image-Checker/
├── manifest.json          # Chrome Extension manifest
├── package.json           # npm dependencies
├── vite.config.ts         # Vite + CRXJS bundler config
├── tailwind.config.js     # Liquid Glass design tokens
├── scripts/
│   └── train.py           # ML training pipeline
├── public/
│   └── model.onnx         # Trained ONNX model (generated)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── src/
    ├── background/
    │   └── main.ts        # Context menu & message routing
    ├── content/
    │   ├── index.tsx      # Shadow DOM injection
    │   ├── Scanner.tsx    # Main UI component
    │   └── styles.ts      # Tailwind styles for Shadow DOM
    ├── components/
    │   └── GlassCard.tsx  # Liquid Glass container
    └── offscreen/
        ├── offscreen.html # Offscreen document
        └── worker.ts      # ONNX inference engine
```

## 🧠 How It Works

1. **Feature Extraction**: Images are resized to 128×128, converted to grayscale, and processed with a Laplacian filter to detect texture edges.

2. **Gradient Analysis**: Sobel operators calculate gradient magnitude, revealing telltale patterns in AI-generated images.

3. **Classification**: PCA reduces dimensions to 50 features, then Logistic Regression classifies real vs. AI-generated.

4. **Local Inference**: The TypeScript implementation in `worker.ts` exactly matches the Python training pipeline, ensuring consistent results.

## 🎨 Design System: Liquid Glass

The UI implements Apple's "Liquid Glass" aesthetic:

```css
/* Surface: Dark, translucent */
background: rgba(0, 0, 0, 0.3);

/* Optical Physics: Blur + Saturation + Brightness */
backdrop-filter: blur(24px) saturate(180%) brightness(120%);

/* Specular Edges: Light simulation */
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
```

## 📝 License

MIT