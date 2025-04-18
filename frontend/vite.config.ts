/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom'
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    allowedHosts: ["Vite"],
    watch: {
      usePolling: true,
    },
  },
})
