import { ComponentType, MutableRefObject } from 'react'
import type {
	ParamDataItem,
	ParseDataToParticleCallback,
	ParticleDataItem,
	RemoveCallback,
	ParticleData
} from 'capsule-particle'

export type ParticleApi = {
	get(
		name?: string
	): Record<string, ParticleDataItem<ParticleConfigItem>> | ParticleDataItem<ParticleConfigItem> | undefined
	remove(name: string, callback?: RemoveCallback): boolean
	add(
		data: ParticleConfigs,
		targetName?: string,
		options?: {
			order?: number
			callback?: ParseDataToParticleCallback<ParticleConfigItem>
		}
	): void
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
	): void
	registry(registryInfos: IParticleProps['registry']): void
	getParticle(): ParticleData<ParticleConfigItem>
}

export type ParticleConfigItem = ParamDataItem & {
	/** 组件名称 */
	componentName: string
	/** 组件配置 */
	props?: Record<string, unknown>
	/** 子级配置 */
	children?: Array<ParticleConfigItem>
	/** 扩展配置 */
	[extra: string]: unknown
}

export type ParticleConfigs = Array<ParticleConfigItem> | ParticleConfigItem

export interface IParticleProps {
	/** 重新解析配置，更新标记 */
	forceRender?: unknown
	/** 外层容器类名 */
	wrapClassName?: string
	/** 实例对象 */
	particleRef?: MutableRefObject<ParticleApi | null>
	/** 渲染配置 */
	config: ParticleConfigs
	/** 渲染配置遍历回调 */
	configCallback?: ParseDataToParticleCallback
	/** 组件注册列表 */
	registry: {
		[name: string]: {
			component: ComponentType
			[extra: string]: unknown
		}
	}
}
