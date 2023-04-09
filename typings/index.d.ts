import Particle, { Description } from 'capsule-particle'
import React, { createElement, Dispatch } from 'react'
import { ReducerPayload } from '../src/components/Updater'

export interface IProps {
  /** 组件描述 */
  config: {
    type: string
    props?: Record<string, any>
    particleOption?: Record<string, any>
  } & Description
  /** 是否深拷贝描述 */
  cloneDeepConfig?: boolean
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

export type ImperativeRef = RegisterRef & {
  getParticle: () => ReturnType<Particle['getParticle']> | undefined
  getItem: (keys?: string[], dataType?: 'object' | 'array') => ReturnType<Particle['getItem']>
  append: (key: string, config: IProps['config'] | IProps['config'][], order?: number | undefined) => ReturnType<Particle['append']>
  remove: (keys: string[]) => ReturnType<Particle['remove']>
  setItem: (key: string, data: Record<string, any>) => ReturnType<Particle['setItem']>
  replace: (key: string, config: IProps['config']) => ReturnType<Particle['replace']>
}

const ParticleReact: React.ForwardRefExoticComponent<IProps & React.RefAttributes<ImperativeRef>>
export default ParticleReact
