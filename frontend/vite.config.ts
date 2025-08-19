import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  build: {
    rollupOptions: {
      external: [
        // Adicione módulos que devem ser externalizados se necessário
      ]
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://10.3.70.107:8085',
        changeOrigin: true
      }
    }
  }
})