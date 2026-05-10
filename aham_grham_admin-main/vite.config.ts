import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  base: "/pulse-ui/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
