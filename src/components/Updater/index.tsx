import React, { createElement, FC, useEffect, useReducer, useMemo } from 'react'
import { ReactCreateElements, particleDispatchRef, ReactCreateElementCmpt } from '../../types'

export interface IProps {
  // 组件
  particleCmpt: ReactCreateElementCmpt
  // 组件属性
  particleProps: Record<string, any>
  // 组件子级
  particleChildren?: ReactCreateElements
  // 组件KEY
  particleKey: string
  // 状态机容器
  particleDispatchRef: React.MutableRefObject<particleDispatchRef>
}

export type StateType = {
  stateParticleProps: IProps['particleProps']
  stateParticleChildren: IProps['particleChildren']
}

export type ReducerPayload = {
  props: IProps['particleProps']
  children: IProps['particleChildren']
}

function reducer(state: StateType, payload: ReducerPayload) {
  const { props, children } = payload
  return {
    stateParticleProps: props ? { ...state.stateParticleProps, ...props } : state.stateParticleProps,
    stateParticleChildren: children || state.stateParticleChildren
  }
}

const Updater: FC<IProps> = props => {
  const { particleProps = {}, particleChildren, particleKey, particleCmpt, particleDispatchRef } = props

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    stateParticleProps: {
      ...particleProps,
      key: particleKey
    },
    stateParticleChildren: particleChildren
  })

  useEffect(() => {
    particleDispatchRef.current[`${particleKey}-updater`] = dispatch
  }, [])

  const render = useMemo(() => {
    const { stateParticleProps, stateParticleChildren } = state
    return createElement(particleCmpt, stateParticleProps, stateParticleChildren || stateParticleProps.children)
  }, [state.stateParticleChildren, state.stateParticleProps])

  return render
}

export default Updater
