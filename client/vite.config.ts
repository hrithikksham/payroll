import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': 'https://payroll-x3t0.onrender.com'
    }
  }
});