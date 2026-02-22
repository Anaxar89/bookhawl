import { defineConfig } from 'vite'
import { resolve } from 'path'
import { renameSync, existsSync } from 'fs'

export default defineConfig({
  base: '/',

  root: resolve(__dirname),
  publicDir: resolve(__dirname, 'public'),

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index:    resolve(__dirname, 'src/pages/auth.html'),
        callback: resolve(__dirname, 'src/pages/auth-callback.html'),
        app:      resolve(__dirname, 'src/pages/app.html'),
      }
    }
  },

  plugins: [
    {
      name: 'rename-auth-to-index',
      closeBundle() {
        const from = resolve(__dirname, 'dist/src/pages/auth.html')
        const to   = resolve(__dirname, 'dist/index.html')
        if (existsSync(from)) {
          renameSync(from, to)
          console.log('✅ auth.html → dist/index.html')
        }
      }
    }
  ],

  server: {
    port: 3000,
    open: '/src/pages/auth.html'
  }
})