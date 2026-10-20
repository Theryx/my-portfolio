import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `npm run dev:live` serves the app locally but sends /api to the deployed
// site, so Studio can be previewed against real data. Saves made there go to
// the production database.
const LIVE_API = 'https://react-portfolio-pi-topaz.vercel.app'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    hmr: {
      clientPort: 5173,
    },
    proxy: mode === 'live'
      ? { '/api': { target: LIVE_API, changeOrigin: true, secure: true } }
      : undefined,
  },
}))
