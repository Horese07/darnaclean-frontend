import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Proxy désactivé temporairement - utilisation d'URLs absolues
  // server: {
  //   proxy: {
  //     '/api': 'http://127.0.0.1:8000',
  //   },
  // },
})

