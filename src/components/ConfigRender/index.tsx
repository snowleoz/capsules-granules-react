import React, { useReducer, useEffect, useMemo, createElement, ReactNode } from 'react'
import { IParticleProps, ParticleConfigItem } from '../../types'
import Error from '../Error'

export type dispatchItem = {
	[configName: string]: React.Dispatch<{
		type: 'children' | 'props'
		data: Partial<typeof initialState>
	}>
}

export type IProps = Pick<IParticleProps, 'registry'> & {
	config: ParticleConfigItem & {
		props?: {
			[prop: string]: unknown
			children?: ReactNode | null
		}
	}
	dispatchRef?: React.MutableRefObject<dispatchItem>
	children?: ReactNode | null
}

type IState = {
	props: {
		children?: ReactNode | null
		[prop: string]: unknown
	}
	children?: ReactNode | null
}

const initialState: IState = {
	props: {},
	children: null
}

function reducer(state: IState, action: { type: string; data: Partial<IState> }) {
	const { type, data } = action
	switch (type) {
		default: {
			const { props = {}, children = null } = data || {}
			return {
				...state,
				props,
				children: children || props?.children
			}
		}
	}
}

function ConfigRender(props: IProps) {
	const { registry, config, dispatchRef, children } = props

	const { props: configProps, name: configName } = config

	const [state, dispatch] = useReducer(reducer, {
		props: configProps || {},
		children: (Array.isArray(children) ? (children.length && children) || configProps?.children : children) || null
	})

	useEffect(() => {
		if (dispatchRef?.current) {
			dispatchRef.current[configName] = dispatch
		}
	}, [])

	const CurrentComponent = useMemo(() => {
		const { componentName } = config
		const registryComponent = registry[componentName]?.component
		if (!registryComponent) {
			console.error(
				'The corresponding control cannot be found. The current registration list is: ',
				registry,
				', componentName is',
				componentName
			)
		}
		return registryComponent || Error
	}, [])

	return createElement(
		CurrentComponent,
		{
			key: configName,
			...state.props
		},
		state.children
	)
}

export default ConfigRender
