import { useConfig } from './hook'
import type { IParticleProps } from './types'

function ParticleReact(props: IParticleProps) {
	const { ReactTree, apiRef } = useConfig(props)
	console.log('#1 apiRef: ', apiRef)
	return ReactTree.current
}

export default ParticleReact
