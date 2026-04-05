import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dual-target build:
// - Vercel sets VERCEL=1 during its builds → serve from root '/'
// - GitHub Pages (via `npm run deploy`) → serve from '/astro-chakra/'
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/astro-chakra/',
})
