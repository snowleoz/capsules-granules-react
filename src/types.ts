import { IOption } from 'capsule-particle'
import React, { createElement } from 'react'

export interface IProps {
  /** 组件描述 */
  config: {
    type: string
    props?: Record<string, any>
    particleOption?: Record<string, any>
  } & IOption['description']
  /** 组件注册 */
  register: Array<{
    type: string
    component: Parameters<typeof createElement>[0]
  }>
  /** 组件渲染前加载的预置组件 loading */
  loading?: React.FC | React.ClassicComponent | string
}

export type RegisterRef = {
  register: IProps['register']
  registerMap: Record<string, Parameters<typeof createElement>[0]>
}
export type reactElementsRef = {
  children: Record<string, Array<React.ReactElement>>
  element: Record<string, React.ReactElement>
}

export type ImperativeRef = {
  registered: IProps['register']
}
