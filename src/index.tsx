import { useConfig } from './hook'
import type { IParticleProps } from './types'
export type * from './types'

function ParticleReact(props: IParticleProps) {
	const { ReactTree } = useConfig(props)
	return ReactTree.current
}

export default ParticleReact
