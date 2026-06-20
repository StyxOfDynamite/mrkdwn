import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // See src/shims/codemirror-language-data-stub.ts and src/shims/katex-stub.ts for why
      // these are aliased away — both are statically imported inside @milkdown/crepe's
      // compiled bundle regardless of our config/feature flags.
      "@codemirror/language-data": fileURLToPath(
        new URL("./src/shims/codemirror-language-data-stub.ts", import.meta.url),
      ),
      katex: fileURLToPath(new URL("./src/shims/katex-stub.ts", import.meta.url)),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
