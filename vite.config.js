import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname),

  base: '/',

  publicDir: resolve(__dirname, 'public'),

  server: {
    port: 3000,
    open: '/',   // apre SEMPRE la login
  },

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        app:   resolve(__dirname, 'app.html')
      }
    }
  }
})