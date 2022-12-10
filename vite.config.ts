// vite.config.ts
const path = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ParticlesEmmiter',
      fileName: (format) => `ParticlesEmmiter.${format}.js`,
    },
  },
});