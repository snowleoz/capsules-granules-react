import { Description } from 'capsule-particle'
import React, { createElement, Dispatch } from 'react'
import { ReducerPayload } from './components/Updater'

export interface IProps {
  /** 组件描述 */
  config: {
    type: string
    props?: Record<string, any>
    particleOption?: Record<string, any>
  } & Description
  /** 组件注册 */
  register: Array<{
    type: string
    component: ReactCreateElementCmpt
  }>
  /** 组件渲染前加载的预置组件 loading */
  loading?: React.ReactElement
}

export type ReactCreateElements = ReactCreateElement[] | null
export type ReactCreateElement = ReturnType<typeof createElement> | null
export type ReactCreateElementCmpt = Parameters<typeof createElement>[0]
export type RegisterRef = {
  register: IProps['register']
  registerMap: Record<string, Parameters<typeof createElement>[0]>
}
export type ReactElementsRef = {
  children: Record<string, Array<ReturnType<typeof createElement>>>
  element: Record<string, ReturnType<typeof createElement>>
}

export type reactUpdateQuotoRef = Record<
  string,
  {
    data: ReducerPayload
  }
>

export type particleDispatchRef = Record<string, Dispatch<ReducerPayload>>

export type ImperativeRef = RegisterRef
