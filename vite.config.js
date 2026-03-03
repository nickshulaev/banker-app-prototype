import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/banker-app-prototype/",
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
