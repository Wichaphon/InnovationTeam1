import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    // This is the key part for Docker compatibility
    host: true, // Listen on all network interfaces
    watch: {
      usePolling: true,
    },
  },  
})
