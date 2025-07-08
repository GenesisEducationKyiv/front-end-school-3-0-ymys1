import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-slot'],
          store: ['@reduxjs/toolkit', 'react-redux'],
          api: ['@apollo/client', 'graphql'],
          utils: ['@mobily/ts-belt', 'lucide-react', 'clsx', 'tailwind-merge'],
        }
      },
    }
  }
})
