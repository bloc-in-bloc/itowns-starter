import { defineConfig } from 'vite'
import copy from "rollup-plugin-copy";

export default defineConfig({
  base: '/itowns-starter/',
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  define: {
    'window.global': {}
  },
  plugins: [
    copy({
      targets: [{
        src: "node_modules/itowns-potree2/dist/itowns_potree2worker.js",
        dest: "node_modules/.vite/Worker/",
        rename: "Potree2Worker.js"
      }],
      verbose: true
    }),
  ]
})
