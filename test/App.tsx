import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { description } from './data'

import ParticleReact from '../src'

const registry = [
	{
		type: 'div',
		component: 'div'
	}
]

const App = () => {
	const particleReactRef = useRef()
	useEffect(() => {
		console.log('particleReactRef: ', particleReactRef)
	}, [])
	return (
		<div>
			<ParticleReact registry={registry} configs={description} ref={particleReactRef} />
		</div>
	)
}

const root = createRoot(document.getElementById('root') || document.body)
root.render(<App />)
