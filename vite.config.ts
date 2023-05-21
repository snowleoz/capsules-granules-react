import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [reactPlugin()],
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
