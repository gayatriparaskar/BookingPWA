import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./backend/server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: "./frontend",
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["../frontend", "../backend/shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "../backend/server/**"],
    },
  },
  build: {
    outDir: "../dist",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
      "@shared": path.resolve(__dirname, "./backend/shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
