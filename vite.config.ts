import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import relay from 'vite-plugin-relay';
import { chromeExtension } from 'vite-plugin-chrome-extension';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/manifest.json',
    },
  },
  plugins: [react(), relay, chromeExtension()],
});
