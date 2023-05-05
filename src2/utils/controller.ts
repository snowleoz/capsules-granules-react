import { createElement } from 'react'
import { Updater } from '../components'
import { PARTICLE_TOP } from 'capsule-particle'
import type { ParticleDataRef } from '../'
import type { UseCacheReturn } from '../hooks'
import { Error } from '../components'
import type { ParticleReactItem } from '../../typings'

export function controller(
	configItem: ParticleReactItem,
	registeredCmptMap: ParticleDataRef['registeredCmptMap'],
	cacheDataRef: UseCacheReturn<ParticleDataRef>
) {
	const { type, key, props = {}, __particle } = configItem
	const { parent } = __particle
	if (type && registeredCmptMap) {
		let Component = registeredCmptMap[type]
		if (!Component) {
			Component = Error
			console.error(
				'Component not registered, skipping rendering, config is ',
				JSON.stringify(configItem),
				'.Using the Error component instead'
			)
		}
		const reactUpdaters = cacheDataRef.getCache('reactUpdaters')
		/** 保存当前组件children的应用，方便之后将子级的信息推入 */
		cacheDataRef.setCache(
			{
				reactTreeChildren: {
					[key]: []
				}
			},
			{
				merge: true
			}
		)
		const reactTreeChildren = cacheDataRef.getCache('reactTreeChildren')[key]
		const ParticleCmpt = createElement(Updater, {
			config: configItem,
			render: Component,
			renderProps: props,
			renderChildren: reactTreeChildren,
			reactUpdaters,
			key: `${key}-updater`
		})
		if (parent === PARTICLE_TOP) {
			const reactTree = cacheDataRef.getCache('reactTree')
			reactTree.push(ParticleCmpt)
		} else {
			const parentChildren = cacheDataRef.getCache('reactTreeChildren')[parent]!
			parentChildren.push(ParticleCmpt)
		}
		/** 将数据存储到缓存中 */
		cacheDataRef.setCache(
			{
				flatReactTree: {
					[key]: ParticleCmpt
				}
			},
			{
				merge: true
			}
		)
	} else {
		console.error('Missing component information, current component configuration is ', JSON.stringify(configItem))
	}
}
