import React, { useMemo, Fragment, useState, forwardRef } from 'react'
import Particle from 'capsule-particle'
import { useCache, useImperative } from './hooks'
import { initRegistry, controller } from './utils'
import type { IParticleReactProps, RegistryItem, ParticleReactItem, ReactElements } from '../typings'

export type ParticleDataRef = {
	/** 组件注册信息映射表 */
	registeredMap?: Record<string, RegistryItem>
	/** 组件注册表 */
	registeredCmptMap?: Record<string, RegistryItem['component']>
	/** 对象树实例 */
	particleEntity?: Particle
	/** 当前的组件树 */
	reactTree: ReactElements[]
	/** 当前打平的组件树 */
	flatReactTree: Record<string, ReactElements>
	/** 每个树节点的children容器 */
	reactTreeChildren: Record<string, ReactElements[]>
	/** 每个组件的更新器 */
	reactUpdaters: Record<string, React.Dispatch<any>>
}

const ParticleReact = (props: IParticleReactProps, ref: any) => {
	const { registry, feedback, configs } = props

	/** 组件刷新器 */
	const [updateCount, update] = useState(0)

	/** 缓存数据 */
	const particleDataRef = useCache<ParticleDataRef>({
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
			 * TODO Particle 增加泛型
			 * 注意：此时particleDataRef还无法获取到注册信息，直接从参数传入
			 * */
			const particleEntity = new Particle(configs, (configItem) => {
				controller(configItem as unknown as ParticleReactItem, registeredCmptMap, particleDataRef)
			})
			particleDataRef.setCache({
				registeredMap,
				registeredCmptMap,
				particleEntity
			})
			update((count) => ++count)
		} else {
			/** TODO: 组件使用Error Boundaries */
			throw new Error('Missing valid component registration information')
		}
	}, [])

	const ReactTree = useMemo(() => {
		return particleDataRef.getCache('reactTree')
	}, [updateCount])

	return <Fragment>{ReactTree.length ? ReactTree : feedback || null}</Fragment>
}

export default forwardRef(ParticleReact)
