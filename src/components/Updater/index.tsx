import { useMemo, useReducer, createElement, ReactNode } from 'react'
import { ReactCreateElementReturn, ReactCmpt, ParticleReactItemPlus, ParticleDataRef } from '../../../typings'

type IState = {
	/** 当前组件的子级 */
	children?: ReactNode[]
	/** 当前组件的属性 */
	props: Record<string, any>
}

type IPayload = Partial<IState>

export interface IProps {
	/** 当前配置 */
	config: ParticleReactItemPlus
	/** 当前渲染的组件 */
	render: ReactCmpt
	/** 当前组件的属性 */
	renderProps: Record<string, unknown>
	/** 当前组件的子级 */
	renderChildren?: ReactCreateElementReturn[]
	/** 更新器容器 */
	reactUpdaters: ParticleDataRef['reactUpdaters']
}

function reducer(state: IState, payload: IPayload) {
	const { children, props } = payload
	const newState = { ...state }
	if (children) {
		newState.children = children
	}
	if (props) {
		Object.assign(newState, { props })
	}
	return newState
}

const Updater = (props: IProps) => {
	const { render, renderProps, renderChildren, config, reactUpdaters } = props

	/** 从当前组件配置中获取唯一标记 */
	const { key } = config

	const [state, dispatch] = useReducer(reducer, {
		props: renderProps,
		children: renderChildren
	}) as [IState, React.Dispatch<IPayload>]

	useMemo(() => {
		/** 将组件的更新器存储到外部更新容器中 */
		reactUpdaters[key] = dispatch
	}, [key])

	const renderCmpt = useMemo(() => {
		const formatChildren = state.children?.length ? state.children : state.props?.children || null
		return createElement(render, state.props, formatChildren)
	}, [state.props, state.children])

	return renderCmpt
}

export default Updater
