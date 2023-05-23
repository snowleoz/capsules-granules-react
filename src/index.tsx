import React, { useMemo, Fragment, useState, forwardRef, useRef, Ref, useEffect } from 'react'
import Particle, { PARTICLE_TOP } from 'capsule-particle'
import { useImperative } from './hooks'
import { initRegistry, controller } from './utils'
import type { IParticleReactProps, ParticleReactItem, ParticleDataRef, ReactParticleRef } from '../typings'

const ParticleReact = (props: IParticleReactProps, ref: Ref<ReactParticleRef>) => {
	const { registry, feedback, configs, callback, onLoaded } = props

	/** 组件刷新器 */
	const [updateCount, update] = useState(0)

	/** 缓存组件树数据 */
	const particleDataRef = useRef<ParticleDataRef>({
		/** 组件注册信息映射表 */
		registeredMap: {},
		/** 组件注册表 */
		registeredCmptMap: {},
		/** 对象树实例 */
		particleEntity: undefined,
		/** 当前的组件树 */
		reactTree: [],
		/** 当前打平的组件树 */
		flatReactTree: {},
		/** 每个树节点的children容器 */
		reactTreeChildren: {},
		/** 每个组件的更新器 */
		reactUpdaters: {},
		/** 外部的callback */
		callbackExternal: callback
	})

	/** 对外暴露实例方法 */
	useImperative(ref, particleDataRef, [])

	/**
	 * 仅第一次渲染时接受registry，后续注册组件需通过api注册
	 * 仅第一次渲染时接受configs，后续需通过api来对组件树进行增删改查
	 */
	useMemo(() => {
		const registryInfo = initRegistry(registry)
		/**
		 * 没有注册组件，跳过渲染
		 * todo 组件信息可在配置中声明，不一定需要注册才可使用
		 */
		if (registryInfo) {
			const { registeredMap, registeredCmptMap } = registryInfo
			/**
			 * 注意：此时particleDataRef还无法获取到注册信息，直接从参数传入
			 * */
			const particleEntity = new Particle<ParticleReactItem>(configs, (configItem) => {
				controller(configItem, registeredCmptMap, particleDataRef)
				particleDataRef.current.callbackExternal && particleDataRef.current.callbackExternal(configItem)
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

	useEffect(() => {
		/** 组件初始化渲染完成 */
		if (updateCount === 1) {
			onLoaded && onLoaded()
		}
	}, [updateCount, onLoaded])

	useEffect(() => {
		particleDataRef.current.callbackExternal = callback
	}, [callback])

	const ReactTree = useMemo(() => {
		return particleDataRef.current.reactTree
	}, [updateCount])

	return <Fragment>{ReactTree.length ? ReactTree : feedback || null}</Fragment>
}

export default forwardRef(ParticleReact)
export { ReactParticleRef }
