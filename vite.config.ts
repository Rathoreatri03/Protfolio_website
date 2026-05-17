import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/Portfolio_website/" : "/",
  plugins: [
    tanstackStart({
      spa: {},
    }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
});
