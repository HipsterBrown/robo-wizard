import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'RoboWizard',
      fileName: format => `robo-wizard.${format}.js`
    }
  },
  plugins: [dts()]
})
