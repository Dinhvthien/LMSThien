import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/lms': {
        target: 'https://api.dinhvanthien.shop',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // ⚠️ Cấu hình cho build production
  build: {
    outDir: 'dist'
  },
  // ⚠️ Cấu hình bắt buộc cho SPA như React
  base: '/',
})
