import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Em desenvolvimento, as chamadas para /api são repassadas para a API Spring Boot (pasta backend).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
