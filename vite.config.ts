import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  // Use relative paths for Chrome extension compatibility
  base: './',
  worker: {
    format: 'es',
    plugins: () => [
      // Add any worker-specific plugins here if needed
    ]
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  },
  build: {
    rollupOptions: {
      input: {
        offscreen: 'src/offscreen/offscreen.html',
        popup: 'src/popup/popup.html',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
