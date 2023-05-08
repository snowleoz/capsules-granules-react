import { createElement } from 'react'
import { Updater } from '../components'
import { PARTICLE_TOP } from 'capsule-particle'
import type { ParticleDataRef } from '../'
import { Error } from '../components'
import type { ParticleReactItem } from '../../typings'

export function controller(
	configItem: ParticleReactItem,
	registeredCmptMap: ParticleDataRef['registeredCmptMap'],
	particleDataRef: React.MutableRefObject<ParticleDataRef>
) {
	const { type, key, props = {}, __particle } = configItem
	const { parent } = __particle
	/** 必须存在组件类型和注册信息 */
	if (type && registeredCmptMap) {
		let Component = registeredCmptMap[type]
		/** 找不到注册信息的，会转为错误报告组件 */
		if (!Component) {
			Component = Error
			console.error(
				'Component not registered, skipping rendering, config is ',
				JSON.stringify(configItem),
				'.Using the Error component instead'
			)
		}
		const particleData = particleDataRef.current
		/** 保存当前组件children的应用，方便之后将子级的信息推入 */
		particleData.reactTreeChildren[key] = []
		const { reactTreeChildren, reactUpdaters, reactTree } = particleData
		const currentReactTreeChildren = reactTreeChildren[key]
		const ParticleCmpt = createElement(Updater, {
			config: configItem,
			render: Component,
			renderProps: props,
			renderChildren: currentReactTreeChildren,
			reactUpdaters,
			key: `${key}-updater`
		})
		if (parent === PARTICLE_TOP) {
			reactTree.push(ParticleCmpt)
		} else {
			const parentChildren = reactTreeChildren[parent]!
			parentChildren.push(ParticleCmpt)
		}
		/** 将数据存储到缓存中 */
		particleData.flatReactTree[key] = ParticleCmpt
	} else {
		console.error('Missing component information, current component configuration is ', JSON.stringify(configItem))
	}
}
