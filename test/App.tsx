import React from 'react'
import { createRoot } from 'react-dom/client'
import { description } from './data'
import ParticleReact from '../src/index'

const App = () => {
	return <ParticleReact config={description} registry={{}} />
}

const root = createRoot(document.getElementById('root') || document.body)
root.render(<App />)
