import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Particle, { IOption } from 'capsule-particle'
import { controller } from './utils'

export interface IProps {
  /** 组件描述 */
  config: {
    type: string
    props?: Record<string, any>
    particle?: Record<string, any>
  } & IOption['description']
  /** 组件注册 */
  register: Array<{
    type: string
    component: React.FC | React.ClassicComponent | string
  }>
  /** 组件渲染前加载的预置组件 loading */
  loading?: React.FC | React.ClassicComponent | string
}

export type ImperativeRef = {
  registered: IProps['register']
}

const ParticleReact = (props: IProps, ref: React.Ref<ImperativeRef>) => {
  const { config, register } = props
  // 注册列表
  const registerRef = useRef<IProps['register']>(register)
  // 配置字段实例
  const particleRef = useRef<Particle | null>(null)
  useImperativeHandle(
    ref,
    () => ({
      registered: registerRef.current
    }),
    [config]
  )
  useEffect(() => {
    particleRef.current = new Particle({
      description: config,
      controller
    })
  }, [config])

  return <div>Hello capsule</div>
}

export default forwardRef(ParticleReact)
