import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so built assets reference relative paths.
  // This helps when the site is deployed to a subpath or served
  // from the filesystem with certain static servers. Note: you
  // still must serve built files over HTTP (not file://) because
  // browsers block module/script requests from origin `null`.
  base: './',
  plugins: [react()],
})
