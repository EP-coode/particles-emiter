import { defineConfig } from "vite";
import dts from "vite-plugin-dts";


export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: {
        ParticlesEmmiter: "./src/index.ts",
        SizeChange: "./src/SizeChange/index.ts",
        ColorSelection: "./src/ColorSelection/index.ts"
      },
      formats: ["es", "cjs"],
    },
  }
});