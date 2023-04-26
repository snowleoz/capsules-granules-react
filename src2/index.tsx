import React, { useMemo, Fragment, useState } from 'react'
import Particle from 'capsule-particle'
import { useCache, UseCacheReturn } from './hooks'
import { initRegistry, controller } from './utils'
import type { IParticleReactProps } from '../typings'

const ParticleReact = (props: IParticleReactProps) => {
	const { registry, feedback, configs } = props
	/** 组件刷新器 */
	const [, update] = useState(0)

	/** 缓存数据 */
	const cacheDataRef = useCache({
		/** 组件注册表 */
		registeredMap: undefined,
		/** 对象树实例 */
		particleEntity: undefined,
		/** 当前的组件树 */
		reactTree: undefined,
		/** 当前打平的组件树 */
		flatReactTree: undefined,
		/** 每个树节点的children容器 */
		reactTreeChildren: undefined
	})

	/**
	 * 仅第一次渲染时接受registry，后续注册组件需通过api注册
	 * 仅第一次渲染时接受configs，后续需通过api来对组件树进行增删改查
	 */
	useMemo(() => {
		cacheDataRef.setCache({
			registeredMap: initRegistry(registry),
			particleEntity: new Particle(configs, (configItem) => {
				controller(configItem, cacheDataRef as UseCacheReturn, update)
			})
		})
	}, [])
	return <Fragment>{cacheDataRef.getCache('reactTree') ? <div>React</div> : feedback || null}</Fragment>
}

export default ParticleReact
