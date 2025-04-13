import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy all API requests through the same domain
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: true,
          ws: true,
        },
        '/auth': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: true,
          ws: true,
        },
        '/uploads': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: true,
        }
      }
    },
    // Ensure Render can serve the build correctly
    build: {
      outDir: 'dist',
      sourcemap: true,
    }
  }
})
