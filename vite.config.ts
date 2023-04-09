import { defineConfig } from 'vite'
import { resolve } from 'path'
import reactPlugin from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const typePath = resolve(process.cwd(), './typings/index.d.ts')
const distPath = resolve(process.cwd(), './dist')

export default defineConfig({
  plugins: [
    reactPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: typePath,
          dest: distPath
        }
      ]
    })
  ],
  build: {
    target: ['es2015'],
    lib: {
      entry: './src/index.tsx',
      formats: ['cjs', 'es', 'umd'],
      name: 'capsule-particle-react',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['lodash-es', 'react', 'react-dom'],
      output: {
        globals: {
          'lodash-es': '_',
          react: 'react',
          'react-dom': 'reactDom'
        }
      }
    }
  }
})
