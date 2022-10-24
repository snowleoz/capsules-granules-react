import { createElement } from 'react'
import { RegisterRef, ReactElementsRef, particleDispatchRef } from '../types'
import { ParticleItem, PARTICLE_TOP } from 'capsule-particle'
import { Updater } from '../components'

export type ControllerExtra = {
  // 组件注册列表
  registerRef: React.MutableRefObject<RegisterRef>
  // React节点树信息
  reactElementsRef: React.MutableRefObject<ReactElementsRef>
  // 组件状态机容器
  particleDispatchRef: React.MutableRefObject<particleDispatchRef>
}

export function particleController(particleItem: ParticleItem, controllerExtra: ControllerExtra) {
  const { registerRef, reactElementsRef, particleDispatchRef } = controllerExtra
  const { type, key, props = {}, children, __particle } = particleItem
  const registered = registerRef.current.registerMap[type]
  if (!registered) {
    console.warn(`Unregistered control type, type is ${type},please check register`)
    return
  }
  const parent = __particle.parent !== PARTICLE_TOP && __particle.parent
  if (children?.length) {
    const reactChildren = (reactElementsRef.current.children[`${key}-children`] = [])
    const element = createElement(Updater, {
      particleCmpt: registered,
      particleProps: props,
      particleChildren: reactChildren,
      particleKey: key,
      particleDispatchRef,
      key: `${key}-updater`
    })
    parent ? reactElementsRef.current.children[`${parent}-children`]!.push(element) : (reactElementsRef.current.element[key] = element)
  } else {
    const element = createElement(Updater, {
      particleCmpt: registered,
      particleProps: props,
      particleKey: key,
      particleDispatchRef,
      key: `${key}-updater`
    })
    parent ? reactElementsRef.current.children[`${parent}-children`]!.push(element) : (reactElementsRef.current.element[key] = element)
  }
}
