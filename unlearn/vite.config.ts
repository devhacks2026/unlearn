import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwind's vite plugin
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // tells vite to use both react and tailwind when processing app
  plugins: [react(), tailwindcss()],
});