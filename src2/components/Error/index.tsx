import React from 'react'
import type { RegistryItem } from '@/typings'

export interface IProps {
	errorRegistry?: RegistryItem
}

const Error = (props: IProps) => {
	const { errorRegistry } = props
	console.log('errorRegistry: ', errorRegistry)
	return <div>注册的组件有误，请检查</div>
}

export default Error
