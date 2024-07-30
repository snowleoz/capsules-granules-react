import React, { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { description } from './data'
import ParticleReact, { ParticleApi } from '../src/index'

const App = () => {
	const particleApi = useRef<ParticleApi>(null)
	return <ParticleReact config={description} registry={{}} particleRef={particleApi} />
}

const root = createRoot(document.getElementById('root') || document.body)
root.render(<App />)
