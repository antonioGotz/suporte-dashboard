// THIS FILE IS DEV-ONLY: Use this config only for local development (vite dev).
// IMPORTANT: Production builds MUST NOT use this file. The production build
// explicitly uses `frontend/vite.config.js` (see package.json build script
// which runs `vite build --config vite.config.js`). Any filenames below are
// EXAMPLES/DEV-only and should NOT be relied on for deployment.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Resolve target proxy dinamicamente a partir de variáveis de ambiente.
// Perfeito para 'yarn dev' (rodar local).
const getProxyTarget = () => {
  const env = process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (!env) return 'http://localhost:8000';
  // remove eventual sufixo /api para usar apenas o host:path base no proxy
  return String(env).replace(/\/api\/?$/, '');
};

export default defineConfig({
  plugins: [react()],

  // (SEU CÓDIGO - MANTIDO)
  // Configuração do servidor de desenvolvimento local.
  server: {
    proxy: {
      '/api': {
        target: getProxyTarget(),
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // (NOSSA NOVA CONFIGURAÇÃO - ADICIONADA)
  // Isto é o (Passo A.1) da nossa configuração de deploy Sênior.
  // Garante que o 'yarn build' gere nomes de arquivo fixos (sem hashes).
  build: {
    // Não gere o manifest
    manifest: false,
    rollupOptions: {
      output: {
        // NÃO use hashes nos nomes dos arquivos (ex: index-a1b2c3.js)
        // Force nomes fixos (ex: index.js)
        entryFileNames: `assets/index.js`,
        chunkFileNames: `assets/index-chunk.js`,
        assetFileNames: `assets/index.[ext]` // (ex: index.css)
      }
    }
  }
})