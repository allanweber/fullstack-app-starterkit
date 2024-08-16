import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { default as viteReact } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), viteReact()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend API
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
