# UnDiffused: Privacy-First AI Image Detector

**UnDiffused** is a Chrome Extension (Manifest V3) designed to detect AI-generated images directly in your browser. Unlike other detectors, UnDiffused prioritizes privacy by performing all image analysis **locally on your device** using ONNX Runtime Web. No images are ever uploaded to a server.

---

## 🚀 Features

-   **Local Processing**: Powered by ONNX Runtime Web and WebAssembly.
-   **Privacy First**: No data leaves your machine. Your browsing history and images stay private.
-   **Context Menu Integration**: Right-click any image on any website to check if it's AI-generated.
-   **Liquid Glass UI**: A modern, sleek dark-mode interface built with Tailwind CSS and React.
-   **High Performance**: Uses an offscreen document for heavy model computation to keep the UI responsive.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
-   **Node.js** (v18 or higher)
-   **npm** (v9 or higher)
-   **Python 3.9+** (only required for training the model or generating icons)

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

### 3. Setup Python Environment (Optional)
If you want to train the model or generate icons, install the Python requirements:
```bash
pip install -r requirements.txt
```

### 4. Generate Icons
If the `icons/` folder is empty, generate the extension icons using the provided script:
```bash
python scripts/generate_icons.py
```

### 5. Build the Extension
Build the production-ready extension. This will create a `dist/` folder:
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

## 🧠 Training the Model (Advance Users)

The extension comes with a pre-trained model located in `public/model.onnx`. If you wish to retrain it:

1.  **Download Dataset**: Obtain the [CIFAKE: Real and AI-Generated Images](https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-fake-images) dataset.
2.  **Configure Path**: Update the `DATASET_PATH` in `scripts/train.py` to point to your local dataset.
3.  **Run Training**:
    ```bash
    python scripts/train.py
    ```
4.  The script will export a new `model.onnx` to the `public/` directory. Rebuild the extension after training.

---

## 💻 Tech Stack

-   **Framework**: [Vite](https://vitejs.dev/) + [CRXJS](https://crxjs.dev/vite-plugin)
-   **Frontend**: [React](https://reactjs.org/) + [Tailwind CSS](https://tailwindcss.com/)
-   **AI Engine**: [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
-   **Model Training**: Scikit-learn + OpenCV + skl2onnx
-   **Language**: TypeScript

---

## 🛡️ License

MIT License - feel free to use and contribute!
