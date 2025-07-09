import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@enums": path.resolve(__dirname, "./src/enums"),
      "@myFirebase": path.resolve(__dirname, "./src/firebase"),
      "@hooks": path.resolve(__dirname, "./src/store/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@schemas": path.resolve(__dirname, "./src/schemas"),
      "@localization": path.resolve(__dirname, "./src/localization"),
    },
  },
});
