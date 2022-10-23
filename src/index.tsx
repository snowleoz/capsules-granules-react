import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useState } from 'react'
import Particle, { IOption } from 'capsule-particle'
import { particleController } from './utils'
import { IProps, ImperativeRef, RegisterRef, reactElementsRef } from './types'

const ParticleReact = (props: IProps, ref: React.Ref<ImperativeRef>) => {
  const { config, register = [] } = props
  // 渲染组件
  const [elements, setElements] = useState<any>(null)
  // 注册列表
  const registerRef = useRef<RegisterRef>({
    register: register,
    registerMap: register.reduce((acc, cur) => {
      acc[cur.type] = cur.component
      return acc
    }, {} as RegisterRef['registerMap'])
  })
  // react 组件渲染树
  const reactElementsRef = useRef<reactElementsRef>({
    children: {},
    element: {}
  })
  // 配置字段实例
  const particleRef = useRef<Particle | null>(null)
  useImperativeHandle(
    ref,
    () => ({
      registered: registerRef.current.register
    }),
    [config]
  )
  const controller = useCallback<Required<IOption>['controller']>(particleItem => {
    particleController(particleItem, {
      registerRef,
      reactElementsRef
    })
  }, [])
  useEffect(() => {
    particleRef.current = new Particle({
      description: config,
      controller
    })
    console.log('reactElementsRef: ', reactElementsRef)
    setElements(Object.values(reactElementsRef.current.element))
  }, [config])
  return elements ? elements : <div>Hello capsule</div>
}

export default forwardRef(ParticleReact)
