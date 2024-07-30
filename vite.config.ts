import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'

export default defineConfig({
	mode: 'production',
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
			external: ['capsule-particle', 'react', 'react-dom'],
			output: {
				globals: {
					react: 'react',
					'react-dom': 'reactDom'
				}
			}
		}
	}
})
