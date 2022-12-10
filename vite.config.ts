import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "dist",
    lib: {
      entry: {
        ParticlesEmmiter: "./src/index.ts",
        SizeChange: "./src/SizeChange/index.ts",
        ColorSelection: "./src/ColorSelection/index.ts",
      },
      formats: ["es", "cjs"],
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
});
