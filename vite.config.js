import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Đổi port sang 3000
    proxy: {
    '/lms': {
      target: 'https://13.231.75.96:8443',
      changeOrigin: true,
      secure: false
    }
  }
  },
})
