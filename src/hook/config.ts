import { useRef, useMemo, createElement, ReactNode, FunctionComponentElement } from 'react'
import { Particle } from 'capsule-particle'
import ConfigRender, { IProps as IConfigRenderProps, dispatchItem } from '../components/ConfigRender'
import { useForceUpdate, useApi } from './'
import type { IParticleProps, ParticleConfigItem } from '../types'

export type ReactTreeType = Array<FunctionComponentElement<IConfigRenderProps>>

export type ReactChildrenType = {
	[parentName: string]: Array<ReactNode>
}

export const useConfig = (props: IParticleProps) => {
	const { config, registry, forceRender = 0, particleRef, configCallback } = props

	const { forceUpdate } = useForceUpdate()

	/** React 组件树 */
	const ReactTree = useRef<ReactTreeType>([])

	/** React 子级引用 */
	const reactChildren = useRef<ReactChildrenType>({})

	/** React 元素更新器 */
	const reactDispatch = useRef<dispatchItem>({})

	/** Particle 实例对象 */
	const innerParticleRef = useRef<Particle<Array<ParticleConfigItem>>>()

	/** 缓存数据 */
	const cacheDataRef = useRef<{
		forceRender?: unknown
	}>({})

	useMemo(() => {
		// 更新标记变化才解析配置
		if (cacheDataRef.current.forceRender === forceRender) {
			return
		}
		const formatConfig = Array.isArray(config) ? config : [config]
		innerParticleRef.current = new Particle(formatConfig, (configItem, index, configArr) => {
			const callbackResult = configCallback && configCallback(configItem, index, configArr)
			if (callbackResult !== undefined) {
				return callbackResult
			}
			const { $$parent, name } = configItem
			reactChildren.current[name] = reactChildren.current[name] || []
			// 不存在父级，则是顶层元素
			if (!$$parent) {
				ReactTree.current.push(
					createElement(ConfigRender, {
						config: configItem,
						registry,
						children: reactChildren.current[name],
						dispatchRef: reactDispatch
					})
				)
			} else {
				reactChildren.current[$$parent as string]!.push(
					createElement(ConfigRender, {
						config: configItem,
						registry,
						children: reactChildren.current[name],
						dispatchRef: reactDispatch
					})
				)
			}
			return
		})
		if (particleRef) {
			particleRef.current = apiRef.current
		}
		cacheDataRef.current.forceRender = forceRender
	}, [forceRender, config, registry, configCallback])

	const apiRef = useApi({
		ReactTree,
		reactChildren,
		reactDispatch,
		innerParticleRef,
		registry,
		forceUpdate
	})

	return {
		ReactTree,
		apiRef
	}
}
