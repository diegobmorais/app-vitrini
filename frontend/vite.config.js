import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from 'path'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/sanctum': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src')
    },
  },
})
