import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // can change this if needed
    open: true, // auto-opens browser on dev start
    proxy: {
      "/api": {
        target: "http://localhost:5000", //  backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
