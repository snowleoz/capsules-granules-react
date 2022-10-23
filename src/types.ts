import { IOption } from 'capsule-particle'
import React, { createElement, useState } from 'react'

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
export type ParticleStateRef = Record<string, ReturnType<typeof useState<any>>[1]>

export type ImperativeRef = {
  registered: IProps['register']
}
