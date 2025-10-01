import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Generar manifest para mejor caché
    manifest: true,
    // Deshabilitar minificación de CSS para debugging (temporal)
    cssMinify: true,
    // Configuración de chunks para mejor caché
    rollupOptions: {
      output: {
        // Nombres de archivo con hash para caché busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Configuración del servidor de preview
  preview: {
    port: 5225,
    strictPort: true,
    host: true,
    cors: true
  }
})
