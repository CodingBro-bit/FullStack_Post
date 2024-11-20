import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Proxy requests to the Node server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Rewrite path if necessary
      },
    },
  },
});
