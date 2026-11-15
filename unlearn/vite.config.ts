import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwind's vite plugin
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // tells vite to use both react and tailwind when processing app
  plugins: [react(), tailwindcss()],

  // tell Vite that when browser sends request beginning with /api,
  // forward that request to the express backend
  // frontend can request '/api/chat' instead of 'http://localhost:3001/api/chat'
  // simplifies frontend code and avoid cross-origin request during local dev
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        // changes proxied request's Host header to match target server
        changeOrigin: true,
      },
    },
  },
});