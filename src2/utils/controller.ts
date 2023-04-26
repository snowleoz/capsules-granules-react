import { ParticleItem } from 'capsule-particle'
import { UseCacheReturn } from '../hooks'

export function controller(
	configItem: ParticleItem,
	cacheDataRef: UseCacheReturn,
	update: React.Dispatch<React.SetStateAction<number>>
) {
	console.log('configItem: ', configItem)
	cacheDataRef
	update
}
