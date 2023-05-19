import React from 'react'
import type { ParticleReactItem } from '../../../typings'

export interface IProps {
	/** 当前配置 */
	$$config: ParticleReactItem
}

const Error = (props: IProps) => {
	const { $$config } = props
	const { key } = $$config || {}
	return <div key={`${key}-error`}>注册的组件有误，请检查</div>
}

export default Error
