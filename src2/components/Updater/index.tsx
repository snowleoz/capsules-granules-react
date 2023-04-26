import React, { useMemo, useReducer } from 'react'

type IState = {
	status: 'loading' | 'done'
}

type IAction = {
	type?: string
	payload: IState
}

function reducer(state: IState, action: IAction) {
	const { type, payload } = action
	switch (type) {
		default:
			return { ...state, ...payload }
	}
}
const initialState: IState = {
	status: 'loading'
}

const Updater = () => {
	const [state, dispatch] = useReducer(reducer, initialState) as [IState, React.Dispatch<IAction>]
	state
	dispatch
	const render = useMemo(() => {
		return <div></div>
	}, [])
	return render
}

export default Updater
