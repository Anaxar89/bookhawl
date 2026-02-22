import { defineConfig } from 'vite'

export default defineConfig({
  base: '/bookhawl/',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  server: {
    port: 3000,
  }
})
