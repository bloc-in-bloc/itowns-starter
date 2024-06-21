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
        src: "node_modules/@bloc-in-bloc/itowns/dist/*",
        dest: "node_modules/.vite/Worker"
      }],
      verbose: true
    }),
  ]
})
