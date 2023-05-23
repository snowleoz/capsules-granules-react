import { createElement, FunctionComponent, ComponentClass } from 'react'
import Particle, { PARTICLE_TOP, FlatParticleTreeMap, Controller, removeCallbackParams } from 'capsule-particle'
import type { ParticleItem, ParticleItemPlus } from 'capsule-particle'

export type ParticleDataRef = {
	/** 组件注册信息映射表 */
	registeredMap?: Record<string, RegistryItem>
	/** 组件注册表 */
	registeredCmptMap?: Record<string, RegistryItem['component']>
	/** 对象树实例 */
	particleEntity?: Particle<ParticleReactItem>
	/** 当前的组件树 */
	reactTree: ReactCreateElementReturn[]
	/** 当前打平的组件树 */
	flatReactTree: {
		[key: string]: ReactCreateElementReturn | ReactCreateElementReturn[]
	}
	/** 每个树节点的children容器 */
	reactTreeChildren: {
		[key: string]: ReactCreateElementReturn[]
	}
	/** 每个组件的更新器 */
	reactUpdaters: {
		[key: string]: React.Dispatch<{
			props?: Record<string, any>
			children?: ReactCreateElementReturn[]
		}>
	} & {
		[PARTICLE_TOP]?: () => void
	}
	/** 外部传入的回调函数 */
	callbackExternal?: IParticleReactProps['callback']
}

export type ParticleReactVars = {
	/** 组件名称 */
	type: string
	/** 组件属性 */
	props?: Record<string, any>
	/** 组件子级 */
	children?: ParticleReactItem[]
}

export type ParticleReactItem = ParticleItem<ParticleReactVars>

export type ParticleReactItemPlus = ParticleItemPlus<ParticleReactVars>

export type RegistryItem = {
	type: string
	component: ReactCmpt
	[key: string]: any
}

export interface IParticleReactProps {
	/** 组件配置 */
	configs: ParticleReactItem[] | ParticleReactItem
	/** 注册列表 */
	registry: RegistryItem[]
	/** 组件树加载时的渲染 */
	feedback?: JSX.Element | string
	/** 遍历配置项时，调用回调函数 */
	callback?: (configItem: ParticleReactItemPlus) => void | false
	/** 配置加载完成时 */
	onLoaded?: () => void
}

/** React组件类型 */
export type ReactCmpt =
	| string
	| FunctionComponent<Record<string, any>>
	| ComponentClass<Record<string, any>, any>
	| ((props?: any) => JSX.Element)

export type ReactCreateElementReturn = ReturnType<typeof createElement> | null

export type ReactParticleRef = {
	getItem: (
		keys?: string | string[],
		options?: {
			clone?: boolean
		}
	) => ParticleItemPlus<ParticleReactItem> | FlatParticleTreeMap<ParticleReactItem> | null
	setItem(
		setdata:
			| {
					key: string
					data: Record<string, any>
			  }
			| Array<{
					key: string
					data: Record<string, any>
			  }>,
		options?: {
			merge?: boolean
		}
	): boolean
	remove(keys: string | string[]): void | removeCallbackParams
	append(
		key: string,
		data: ParticleReactItem,
		options?: {
			order?: number
			controller?: Controller<ParticleReactItem>
		}
	): ParticleItemPlus<ParticleReactItem> | void
	replace(
		key: string,
		data: ParticleReactItem
	): {
		removeInfos: removeCallbackParams
		appendInfos: ParticleItemPlus<ParticleReactItem>
	} | void
	getRegistered(): ParticleDataRef['registeredMap']
}

declare const _default: React.ForwardRefExoticComponent<IParticleReactProps & React.RefAttributes<ReactParticleRef>>
export default _default
