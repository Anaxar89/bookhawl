import { defineConfig } from 'vite'
import { resolve } from 'path'
import { renameSync, existsSync } from 'fs'

export default defineConfig({
  base: '/',

  root: resolve(__dirname, 'src/pages'),
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
        const authPath  = resolve(__dirname, 'dist/auth.html')
        const indexPath = resolve(__dirname, 'dist/index.html')
        if (existsSync(authPath)) {
          renameSync(authPath, indexPath)
          console.log('✅ dist/auth.html → dist/index.html')
        }
      }
    }
  ],

  server: {
    port: 3000,
    open: '/auth.html'
  }
})