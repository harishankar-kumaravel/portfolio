import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    react({
      exclude: [
        /src\/data\/portfolio\.js/,
        /src\/data\/drivePortfolio\.js/
      ]
    })
  ],
})
