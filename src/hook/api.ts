import { createElement, useRef } from 'react'
import type { Particle, RemoveCallback, ParseDataToParticleCallback } from 'capsule-particle'
import type { ParticleApi, ParticleConfigItem, ParticleConfigs, IParticleProps } from '../types'
import type { ReactTreeType, ReactChildrenType } from '../types'
import ConfigRender, { dispatchItem, IProps as IConfigRenderProps } from '../components/ConfigRender'

export function useApi(props: {
	ReactTree: React.MutableRefObject<ReactTreeType<IConfigRenderProps>>
	reactChildren: React.MutableRefObject<ReactChildrenType>
	reactDispatch: React.MutableRefObject<dispatchItem>
	innerParticleRef: React.MutableRefObject<Particle<Array<ParticleConfigItem>> | undefined>
	registry: IParticleProps['registry']
	forceUpdate: () => void
}) {
	const { ReactTree, reactChildren, reactDispatch, innerParticleRef, registry, forceUpdate } = props
	const apiRef = useRef<ParticleApi>({
		add(
			data: ParticleConfigs,
			targetName?: string,
			options?: {
				order?: number
				callback?: ParseDataToParticleCallback
			}
		) {
			const { order, callback } = options || {}
			innerParticleRef.current?.add(data, targetName, {
				order,
				callback: (configItem, index, dataArr) => {
					const result = callback && callback(configItem, index, dataArr)
					if (result !== undefined) {
						return result
					}
					const { $$parent, name } = configItem
					reactChildren.current[name] = reactChildren.current[name] || []
					const CurrentRender = createElement(ConfigRender, {
						config: configItem,
						registry,
						children: reactChildren.current[name],
						dispatchRef: reactDispatch
					})
					if ($$parent) {
						// 添加到指定节点
						const parentChildren = reactChildren.current[$$parent]!
						order !== undefined ? parentChildren?.splice(order, 0, CurrentRender) : parentChildren?.push(CurrentRender)
						const parentDispatch = reactDispatch.current[$$parent]!
						parentDispatch({
							type: 'children',
							data: {
								children: parentChildren
							}
						})
					} else {
						// 添加到根节点
						order !== undefined
							? ReactTree.current?.splice(order, 0, CurrentRender)
							: ReactTree.current?.push(CurrentRender)
						forceUpdate()
					}
					return
				}
			})
		},
		remove(name: string, callback: RemoveCallback) {
			return innerParticleRef.current!.remove(name, (removeIndex, removeChildren, parent) => {
				if (parent) {
					// 从父级节点的子级数据中删除
					const parentChildren = reactChildren.current[parent]!
					parentChildren.splice(removeIndex, 1)
					const parentDispatch = reactDispatch.current[parent]!
					parentDispatch({
						type: 'children',
						data: {
							children: parentChildren
						}
					})
				} else {
					// 删除根节点数据
					ReactTree.current.splice(removeIndex, 1)
					forceUpdate()
				}
				// 删除指定元素的更新器和子级元素映射
				delete reactDispatch.current[name]
				delete reactChildren.current[name]
				removeChildren?.length &&
					removeChildren.forEach((childName) => {
						delete reactDispatch.current[childName]
						delete reactChildren.current[childName]
					})
				callback && callback(removeIndex, removeChildren, parent)
			})
		},
		update(
			data: {
				[name: string]: {
					children: Array<ParticleConfigItem>
					props?: Record<string, unknown>
					[prop: string]: unknown
				}
			},
			options?: {
				callback?: ParseDataToParticleCallback<ParticleConfigItem>
			}
		) {
			const { callback } = options || {}
			// 记录需要更新children的字段
			const updateNameForChild: string[] = []
			innerParticleRef.current?.update(data, {
				callback: (configItem, index, children) => {
					const result = callback && callback(configItem, index, children)
					if (result !== undefined) {
						return result
					}
					const { $$parent, name } = configItem
					const isUpdateNameForChild = updateNameForChild.includes($$parent!)
					const parentChildren = reactChildren.current[$$parent!]
					// 未被记录更新children的字段，需要重置子级容器
					if (!isUpdateNameForChild) {
						if (parentChildren) {
							reactChildren.current[$$parent!]!.splice(0, parentChildren?.length)
						} else {
							reactChildren.current[$$parent!] = []
						}
						updateNameForChild.push($$parent!)
					}
					reactChildren.current[name] = []
					reactChildren.current[$$parent!]!.push(
						createElement(ConfigRender, {
							config: configItem,
							registry,
							children: reactChildren.current[name],
							dispatchRef: reactDispatch
						})
					)
					return
				}
			})
			Object.entries(data).forEach((item) => {
				const [name, data] = item
				const { props } = data
				const updateDispatch = reactDispatch.current[name]
				if (!updateDispatch) {
					console.warn(`The corresponding updater cannot be found. The name of the current update is ${name}`)
					return false
				}
				const dispatchData = {
					...props
				}
				if (updateNameForChild.length && updateNameForChild.includes(name)) {
					dispatchData.children = reactChildren.current[name]
				}
				updateDispatch({
					type: 'props',
					data: dispatchData
				})
				return
			})
			return true
		},
		get(name?: string) {
			return innerParticleRef.current?.get(name)
		},
		getParticle() {
			return innerParticleRef.current!.getParticles()
		},
		registry(registryInfos: IParticleProps['registry']) {
			Object.assign(registry, registryInfos)
		}
	})
	return apiRef
}
