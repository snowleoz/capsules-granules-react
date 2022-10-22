import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback, createElement, useState } from 'react'
import Particle, { IOption, ParticleItem } from 'capsule-particle'
// import { controller } from './utils'

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

export type ImperativeRef = {
  registered: IProps['register']
}

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
  const reactElement = useRef<{
    children: Record<string, any>
    element: Record<string, any>
  }>({
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
  const controller = useCallback((particleItem: ParticleItem) => {
    const { type, key, props = {}, children, __particle } = particleItem
    const registered = registerRef.current.registerMap[type]
    if (!registered) {
      console.warn(`Unregistered control type, type is ${type},please check register`)
      return
    }
    /** __particleTop__ 以后要从库里导出 */
    const parent = __particle.parent !== '__particleTop__' && __particle.parent
    if (children?.length) {
      const reactChildren = (reactElement.current.children[`${key}-children`] = [])
      parent
        ? reactElement.current.children[`${parent}-children`].push(createElement(registered, { ...props, key }, reactChildren))
        : (reactElement.current.element[key] = createElement(registered, { ...props, key }, reactChildren))
    } else {
      parent
        ? reactElement.current.children[`${parent}-children`].push(createElement(registered, { ...props, key }, props.children))
        : (reactElement.current.element[key] = createElement(registered, { ...props, key }, props.children))
    }
  }, [])
  useEffect(() => {
    console.time('particleRef')
    particleRef.current = new Particle({
      description: config,
      controller
    })
    setElements(Object.values(reactElement.current.element))
    console.timeEnd('particleRef')
  }, [config])
  console.log('elements: ', elements)
  return elements ? elements : <div>Hello capsule</div>
}

export default forwardRef(ParticleReact)
