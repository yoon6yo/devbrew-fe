import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'preload-css',
      transformIndexHtml(html: string) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="([^"]+\.css[^"]*)"/g,
          '<link rel="preload" as="style" href="$1"><link rel="stylesheet" crossorigin href="$1"'
        )
      },
    },
    ViteMinifyPlugin(),
    compression({ algorithms: ['gzip'], exclude: /\.(png|jpg|gif|webp|avif|woff2?)$/ }),
    compression({ algorithms: ['brotliCompress'], exclude: /\.(png|jpg|gif|webp|avif|woff2?)$/ }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: { '/api': 'http://localhost:8080' },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/react-router')) {
            return 'router'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules', 'e2e'],
  },
})
