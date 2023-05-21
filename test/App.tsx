import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { description } from './data'

import ParticleReact, { ReactParticleRef } from '../dist'

const registry = [
	{
		type: 'div',
		component: 'div'
	}
]

const App = () => {
	const particleReactRef = useRef<ReactParticleRef>(null)
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
