import React, { useMemo, useReducer, createElement } from 'react'
import { ParticleDataRef } from '../../'
import { ReactElements, ParticleReactItem } from '../../../typings'

type IAction = {
	type?: string
	payload: object
}

function reducer(state: object, action: IAction) {
	const { type, payload } = action
	switch (type) {
		default:
			return { ...state, ...payload }
	}
}

export interface IProps {
	/** 当前配置 */
	config: ParticleReactItem
	/** 当前渲染的组件 */
	render: ReactElements
	/** 当前组件的属性 */
	renderProps: Record<string, unknown>
	/** 当前组件的子级 */
	renderChildren?: ReactElements[]
	/** 更新器容器 */
	reactUpdaters: ParticleDataRef['reactUpdaters']
}

const Updater = (props: IProps) => {
	const { render, renderProps, renderChildren, config, reactUpdaters } = props
	const { key } = config
	console.log('key: ', key)
	const [state, dispatch] = useReducer(reducer, {
		...renderProps,
		key,
		$$config: config
	})

	useMemo(() => {
		reactUpdaters[config.key] = dispatch
	}, [])

	const renderCmpt = useMemo(() => {
		return createElement(render, state, renderChildren)
	}, [state, renderChildren])
	return renderCmpt
}

export default Updater
