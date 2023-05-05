import { useImperativeHandle, Ref } from 'react'
import { ParticleDataRef } from '../'
import { UseCacheReturn } from '../hooks'

export type ImperativeRef = {
	getItem: (key?: string) => Record<string, any>
}

const useImperative = (ref: Ref<ImperativeRef>, particleDataRef: UseCacheReturn<ParticleDataRef>, deps = []) => {
	useImperativeHandle(
		ref,
		() => {
			return {
				getItem(key?: string) {
					const flatReactTree = particleDataRef.getCache('flatReactTree')
					if (!key) {
						return flatReactTree
					}
					return flatReactTree[key]
				}
			}
		},
		deps
	)
}

export default useImperative
