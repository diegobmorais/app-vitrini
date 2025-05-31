import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from 'path'

export default defineConfig({
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
