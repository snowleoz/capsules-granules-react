import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useState, Fragment } from 'react'
import Particle, { IOption } from 'capsule-particle'
import { particleController } from './utils'
import { IProps, ReactCreateElements, ImperativeRef, RegisterRef, ReactElementsRef, ParticleStateRef } from './types'

const ParticleReact = (props: IProps, ref: React.Ref<ImperativeRef>) => {
  const { config, register = [], loading } = props
  // 渲染组件
  const [elements, setElements] = useState<ReactCreateElements>(null)
  // 注册列表
  const registerRef = useRef<RegisterRef>({
    register: register,
    registerMap: register.reduce((acc, cur) => {
      acc[cur.type] = cur.component
      return acc
    }, {} as RegisterRef['registerMap'])
  })
  // react 组件渲染树
  const reactElementsRef = useRef<ReactElementsRef>({
    children: {},
    element: {}
  })
  // 组件状态机
  const particleStateRef = useRef<ParticleStateRef>({})
  // 配置字段实例
  const particleRef = useRef<Particle | null>(null)
  useImperativeHandle(
    ref,
    () => ({
      registered: registerRef.current.register
    }),
    [config]
  )
  // 配置控制器，用于给配置标记、信息收集
  const controller = useCallback<Required<IOption>['controller']>(particleItem => {
    particleController(particleItem, {
      registerRef,
      reactElementsRef,
      particleStateRef
    })
  }, [])
  // 解析配置，生成React树
  useEffect(() => {
    particleRef.current = new Particle({
      description: config,
      controller
    })
    setElements(Object.values(reactElementsRef.current.element))
  }, [config])
  if (elements) {
    return React.createElement(Fragment, undefined, elements)
  }
  return <div>{loading || null}</div>
}

export default forwardRef(ParticleReact)
