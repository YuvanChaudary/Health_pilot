import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "/styles": path.resolve(__dirname, "styles") // ✅ enables absolute import
    }
  },
  server: {
    port: 5173,
    open: true,
    // 🔥 This tells Vite to fallback to index.html for unknown routes
    historyApiFallback: true
  }
});
