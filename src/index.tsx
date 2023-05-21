import React, { useMemo, Fragment, useState, forwardRef, useRef, Ref } from 'react'
import Particle, { PARTICLE_TOP } from 'capsule-particle'
import { useImperative } from './hooks'
import { initRegistry, controller } from './utils'
import type { IParticleReactProps, ParticleReactItem, ParticleDataRef, ReactParticleRef } from '../typings'

const ParticleReact = (props: IParticleReactProps, ref: Ref<ReactParticleRef>) => {
	const { registry, feedback, configs } = props

	/** 组件刷新器 */
	const [updateCount, update] = useState(0)

	/** 缓存数据 */
	const particleDataRef = useRef<ParticleDataRef>({
		/** 组件注册信息映射表 */
		registeredMap: undefined,
		/** 组件注册表 */
		registeredCmptMap: undefined,
		/** 对象树实例 */
		particleEntity: undefined,
		/** 当前的组件树 */
		reactTree: [],
		/** 当前打平的组件树 */
		flatReactTree: {},
		/** 每个树节点的children容器 */
		reactTreeChildren: {},
		/** 每个组件的更新器 */
		reactUpdaters: {}
	})

	/** 对外暴露实例方法 */
	useImperative(ref, particleDataRef, [])

	/**
	 * 仅第一次渲染时接受registry，后续注册组件需通过api注册
	 * 仅第一次渲染时接受configs，后续需通过api来对组件树进行增删改查
	 */
	useMemo(() => {
		const registryInfo = initRegistry(registry)
		if (registryInfo) {
			const { registeredMap, registeredCmptMap } = registryInfo
			/**
			 * 注意：此时particleDataRef还无法获取到注册信息，直接从参数传入
			 * */
			const particleEntity = new Particle<ParticleReactItem>(configs, (configItem) => {
				controller(configItem, registeredCmptMap, particleDataRef)
			})
			particleDataRef.current = {
				...particleDataRef.current,
				registeredMap,
				registeredCmptMap,
				particleEntity
			}
			const { reactTree } = particleDataRef.current
			/** 补充顶层元素 */
			particleDataRef.current.flatReactTree[PARTICLE_TOP] = reactTree
			particleDataRef.current.reactTreeChildren[PARTICLE_TOP] = reactTree
			particleDataRef.current.reactUpdaters[PARTICLE_TOP] = () => {
				update((count) => ++count)
			}
			update((count) => ++count)
		} else {
			/** TODO: 组件使用Error Boundaries */
			throw new Error('Missing valid component registration information')
		}
	}, [])

	const ReactTree = useMemo(() => {
		return particleDataRef.current.reactTree
	}, [updateCount])

	return <Fragment>{ReactTree.length ? ReactTree : feedback || null}</Fragment>
}

export default forwardRef(ParticleReact)
