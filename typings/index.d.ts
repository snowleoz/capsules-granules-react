import { createElement } from 'react'
import type { Description } from 'capsule-particle'

export interface ParticleReactItem extends Description {
	/** 组件名称 */
	type: string
	/** 组件属性 */
	props?: Record<string, any>
}

export type RegistryItem = {
	type: string
	component: ReturnType<typeof createElement> | ((props: IProps) => JSX.Element)
	defaultProps?: Record<string, any>
	[key: string]: any
}

export interface IParticleReactProps {
	/** 组件配置 */
	configs: ParticleReactItem[] | ParticleReactItem
	/** 注册列表 */
	registry: RegistryItem[]
	/** 组件树加载时的渲染 */
	feedback?: JSX.Element | string
}
