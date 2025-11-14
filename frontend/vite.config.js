import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { proxy: {} },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    manifest: false,       // sem manifest
    cssCodeSplit: false,   // 1 CSS único
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',          // entrada fixa
        chunkFileNames: 'assets/[name].js',         // chunks por nome (sem hash/colisão)
        assetFileNames(assetInfo) {
          if (/\.(css)$/i.test(assetInfo.name ?? '')) return 'assets/index[extname]' // -> assets/index.css
          return 'assets/[name][extname]'           // imagens/fonts sem hash
        },
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor' // -> assets/vendor.js
        },
      },
    },
  },
})
