# UnDiffused: Privacy-First AI Image Detector

**UnDiffused** is a Chrome Extension (Manifest V3) designed to detect AI-generated images directly in your browser. Unlike other detectors, UnDiffused prioritizes privacy by performing all image analysis **locally on your device** using ONNX Runtime Web. No images are ever uploaded to a server.

---

## 🚀 Features

-   **Local Processing**: Powered by ONNX Runtime Web and WebAssembly.
-   **Privacy First**: No data leaves your machine. Your browsing history and images stay private.
-   **Context Menu Integration**: Right-click any image on any website to check if it's AI-generated.
-   **Liquid Glass UI**: A modern, sleek dark-mode interface built with Tailwind CSS and React.
-   **High Performance**: Uses an offscreen document for heavy model computation to keep the UI responsive.
-   **State-of-the-Art Model**: EfficientNet-B4 with attention mechanisms for maximum accuracy.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
-   **Node.js** (v18 or higher)
-   **npm** (v9 or higher)
-   **Python 3.9+** (required for training the model)
-   **CUDA 11.8+** (recommended for GPU training)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/UnDiffused-AI.git
cd UnDiffused-AI
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Setup Python Environment
```bash
pip install -r requirements.txt
```

### 4. Build the Extension
```bash
npm run build
```

---

## 🔧 Loading the Extension in Chrome

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** (toggle in the top right corner).
3.  Click **Load unpacked**.
4.  Navigate to your project directory and select the `dist` folder.
5.  UnDiffused is now ready! Pin it to your toolbar for easy access.

---

## 🧠 Training the Model

### Quick Start
```bash
# 1. Install training dependencies
pip install -r requirements.txt

# 2. Prepare your dataset (place images in D:\Datasets)
#    Required structure:
#    D:\Datasets\
#    ├── REAL\
#    │   └── *.jpg/png
#    └── FAKE\
#        └── *.jpg/png (or subdirectories by generator)

# 3. Quick validation test (<30 minutes)
python scripts/train.py --test --epochs 3

# 4. Full training
python scripts/train.py --epochs 100 --batch-size 4 --accumulate 8
```

### Training Options

| Argument | Default | Description |
|----------|---------|-------------|
| `--data-dir` | `D:\Datasets` | Path to dataset |
| `--epochs` | 100 | Number of training epochs |
| `--batch-size` | 4 | Batch size (keep low for 6GB VRAM) |
| `--accumulate` | 8 | Gradient accumulation steps |
| `--lr` | 3e-5 | Learning rate |
| `--test` | - | Quick test mode (<30 min) |
| `--resume` | - | Resume from checkpoint |
| `--no-mixup` | - | Disable MixUp/CutMix |

### Dataset Structure

```
D:\Datasets\
├── REAL\
│   ├── photo001.jpg
│   ├── photo002.png
│   └── ...
└── FAKE\
    ├── midjourney\
    │   └── *.jpg
    ├── stable_diffusion\
    │   └── *.jpg
    └── other\
        └── *.jpg
```

**Tip**: Use the dataset builder to download pre-made datasets:
```bash
python scripts/dataset_builder.py --output D:\Datasets
```

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| GPU | GTX 1060 6GB | RTX 3060 12GB |
| RAM | 16GB | 32GB |
| Storage | 20GB | 50GB |
| Training Time | 24-48h | 12-24h |

---

## 📊 Benchmark Results

Run benchmarks on your trained model:
```bash
# Evaluate model
python scripts/benchmark.py --checkpoint lightning_logs/version_0/checkpoints/best.ckpt --data D:\Datasets

# Benchmark ONNX inference speed
python scripts/export_onnx.py benchmark --model public/model.onnx --iterations 100
```

---

## 📁 Project Structure

```
UnDiffused-AI/
├── scripts/
│   ├── train.py           # Main training script
│   ├── models.py          # EfficientNet-B4 + CBAM architecture
│   ├── augmentations.py   # Data augmentation pipeline
│   ├── dataset_builder.py # Automated dataset preparation
│   ├── export_onnx.py     # ONNX export with TTA
│   └── benchmark.py       # Evaluation script
├── public/
│   └── model.onnx         # Trained model for browser
├── src/                   # Chrome extension source
├── MODEL_CARD.md          # Detailed model documentation
└── requirements.txt       # Python dependencies
```

---

## 💻 Tech Stack

-   **Framework**: [Vite](https://vitejs.dev/) + [CRXJS](https://crxjs.dev/vite-plugin)
-   **Frontend**: [React](https://reactjs.org/) + [Tailwind CSS](https://tailwindcss.com/)
-   **AI Engine**: [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
-   **Model Training**: PyTorch + PyTorch Lightning + timm
-   **Language**: TypeScript + Python

---

## 🛡️ License

MIT License - feel free to use and contribute!