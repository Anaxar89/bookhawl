import { defineConfig } from 'vite'

export default defineConfig({
  // Con dominio custom (bookhawl.it) base torna a '/'
  // In locale funziona uguale
  base: '/',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  server: {
    port: 3000,
  }
})