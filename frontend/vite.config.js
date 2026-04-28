import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'illustrious-charm-production-92de.up.railway.app',
      'localhost',
      '127.0.0.1'
    ]
  }
})
