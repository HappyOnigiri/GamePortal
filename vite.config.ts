import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5181,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ethereal: resolve(__dirname, 'ethereal-strings/index.html'),
        focus: resolve(__dirname, 'focus-crystallizer/index.html'),
        orbital: resolve(__dirname, 'orbital-symphony/index.html'),
        timelapse: resolve(__dirname, 'time-lapse-note/index.html'),
        zenparticles: resolve(__dirname, 'zen-particles/index.html'),
      }
    }
  }
});
