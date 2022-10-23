import { createElement } from 'react'
import { RegisterRef, reactElementsRef } from '../types'
import { ParticleItem, PARTICLE_TOP } from 'capsule-particle'

export type ControllerExtra = {
  // 组件注册列表
  registerRef: React.MutableRefObject<RegisterRef>
  // React节点树信息
  reactElementsRef: React.MutableRefObject<reactElementsRef>
}

export function particleController(particleItem: ParticleItem, controllerExtra: ControllerExtra) {
  const { registerRef, reactElementsRef } = controllerExtra
  const { type, key, props = {}, children, __particle } = particleItem
  const registered = registerRef.current.registerMap[type]
  if (!registered) {
    console.warn(`Unregistered control type, type is ${type},please check register`)
    return
  }
  const parent = __particle.parent !== PARTICLE_TOP && __particle.parent
  if (children?.length) {
    const reactChildren = (reactElementsRef.current.children[`${key}-children`] = [])
    parent
      ? reactElementsRef.current.children[`${parent}-children`]!.push(createElement(registered, { ...props, key }, reactChildren))
      : (reactElementsRef.current.element[key] = createElement(registered, { ...props, key }, reactChildren))
  } else {
    parent
      ? reactElementsRef.current.children[`${parent}-children`]!.push(createElement(registered, { ...props, key }, props.children))
      : (reactElementsRef.current.element[key] = createElement(registered, { ...props, key }, props.children))
  }
}
