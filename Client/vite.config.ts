import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// If deploying to Vercel/Render with root domain:
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    port: 5000,
  }
});
