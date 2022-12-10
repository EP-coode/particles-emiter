import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "dist",
    lib: {
      entry: {
        ParticlesEmmiter: resolve(__dirname, "src/index.ts"),
        SizeChange: resolve(__dirname, "src/SizeChange/index.ts"),
        ColorSelection: resolve(__dirname, "src/ColorSelection/index.ts"),
      },
      formats: ["es", "cjs"],
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
});
