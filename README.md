# UnDiffused: Local AI Image Detector

UnDiffused is a Chrome/Chromium extension that scans images in-page and runs AI-image detection fully on-device using ONNX Runtime Web.

## Features
- Local inference in the browser (no backend inference service)
- Right-click image scan from context menu
- Popup drag-and-drop scan
- Forensic analysis toolkit (ELA, noise, FFT, gradients, metadata, and more)
- React + TypeScript UI injected via Shadow DOM

## Architecture
- Extension: Manifest V3
- Frontend: React + Vite + TypeScript
- Inference runtime: `onnxruntime-web` (WASM backend)
- Current bundled model asset: `public/models/model_quantized.onnx`

Note: the repository currently contains multiple model training/export scripts (ResNet and Swin-related tooling). Keep runtime and model-export interfaces aligned when changing models.

## Installation (development)
1. Install dependencies:
```bash
npm install
```
2. Build extension:
```bash
npm run build
```
3. Open `chrome://extensions`, enable Developer Mode, and load the `dist` folder.

## Development
- Node.js 18+
- TypeScript strict mode is enabled
- Main extension entries:
  - Background service worker: `src/background/main.ts`
  - Content script: `src/content/index.tsx`
  - Popup: `src/popup/index.tsx`

## Privacy
- Image analysis is performed locally in browser contexts controlled by the extension.
- The extension does not send image bytes to a remote inference API.

## License
MIT
