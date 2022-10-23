import { createElement } from 'react'
import { RegisterRef, ReactElementsRef, ParticleStateRef } from '../types'
import { ParticleItem, PARTICLE_TOP } from 'capsule-particle'
import { Updater } from '../components'

export type ControllerExtra = {
  // 组件注册列表
  registerRef: React.MutableRefObject<RegisterRef>
  // React节点树信息
  reactElementsRef: React.MutableRefObject<ReactElementsRef>
  // 组件状态机容器
  particleStateRef: React.MutableRefObject<ParticleStateRef>
}

export function particleController(particleItem: ParticleItem, controllerExtra: ControllerExtra) {
  const { registerRef, reactElementsRef, particleStateRef } = controllerExtra
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
      ? reactElementsRef.current.children[`${parent}-children`]!.push(
          createElement(Updater, {
            particleCmpt: registered,
            particleProps: props,
            particleChildren: reactChildren,
            particleKey: key,
            particleStateRef
          })
        )
      : (reactElementsRef.current.element[key] = createElement(registered, { ...props, key }, reactChildren))
  } else {
    parent
      ? reactElementsRef.current.children[`${parent}-children`]!.push(
          createElement(Updater, {
            particleCmpt: registered,
            particleProps: props,
            particleKey: key,
            particleStateRef
          })
        )
      : (reactElementsRef.current.element[key] = createElement(registered, { ...props, key }, props.children))
  }
}
// createElement(registered, { ...props, key }, reactChildren)
// createElement(registered, { ...props, key }, props.children)
