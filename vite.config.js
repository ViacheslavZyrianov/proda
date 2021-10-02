import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import legacyPlugin from 'vite-plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({}),
    legacyPlugin({
      targets: [
        '> 0.5%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
      ],
    })
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild'
  }
})
