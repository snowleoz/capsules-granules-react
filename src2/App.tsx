import React, { useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { description } from './data'

import ParticleReact from '.'

const registry = [
	{
		type: 'div',
		component: 'div'
	}
]

const App = () => {
	const [, setUpdate] = useState(0)
	const onButtonClick = useCallback(() => {
		setUpdate((update) => update++)
	}, [])
	return (
		<div>
			<ParticleReact registry={registry} configs={description} />
			<input type={'button'} onClick={onButtonClick} value="Update" />
		</div>
	)
}

const root = createRoot(document.getElementById('root') || document.body)
root.render(<App />)
