import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/apps/markup-app/', // Importante: ruta donde estará tu app
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})