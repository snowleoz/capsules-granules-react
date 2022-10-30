import { createElement } from 'react'
import { RegisterRef, ReactElementsRef, particleDispatchRef, reactUpdateQuotoRef } from '../types'
import Particle, { ParticleItem, PARTICLE_TOP, CallbackStatusParam, FlatParticle, PARTICLE_FLAG } from 'capsule-particle'
import { Updater } from '../components'
import { forFun } from './common'

export type ControllerExtra = {
  // 组件注册列表
  registerRef: React.MutableRefObject<RegisterRef>
  // React节点树信息
  reactElementsRef: React.MutableRefObject<ReactElementsRef>
  // 组件状态机容器
  particleDispatchRef: React.MutableRefObject<particleDispatchRef>
}

export type ControllerExtraWithOperation = ControllerExtra & {
  reactUpdateQuotoRef: React.MutableRefObject<reactUpdateQuotoRef>
  particleRef: React.MutableRefObject<Particle | null>
}

export function particleInitController(particleItem: ParticleItem, status: CallbackStatusParam, controllerExtra: ControllerExtra) {
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

export function particleAppendController(particleItem: ParticleItem, status: CallbackStatusParam, controllerExtra: ControllerExtraWithOperation) {
  // 将新增配置更新到树中
  particleInitController(particleItem, status, controllerExtra)
  const { reactUpdateQuotoRef, reactElementsRef } = controllerExtra
  const { children } = reactElementsRef.current
  const { operationKey } = status
  forFun(operationKey!, key => {
    if (!reactUpdateQuotoRef.current[key]) {
      reactUpdateQuotoRef.current[key] = {
        data: {
          children: children[`${parent}-children`]
        }
      }
    }
  })
}

export function particleRemoveController(particleItem: ParticleItem, status: CallbackStatusParam, controllerExtra: ControllerExtraWithOperation) {
  const { operationKey } = status
  const { reactUpdateQuotoRef, particleRef, reactElementsRef } = controllerExtra
  const flatParticle = particleRef.current!.getItem() as FlatParticle
  forFun(operationKey!, key => {
    const currentParticle = flatParticle[key]
    if (currentParticle) {
      const currentParticleExtra = currentParticle[PARTICLE_FLAG]
      const { parent, index } = currentParticleExtra
      const currentChildren = reactElementsRef.current.children[`${parent}-children`]!
      currentChildren.splice(index, 1)
      if (!reactUpdateQuotoRef.current[parent]) {
        reactUpdateQuotoRef.current[parent] = {
          data: {
            children: currentChildren
          }
        }
      }
    }
  })
}

export function particleSetItemController(particleItem: ParticleItem, status: CallbackStatusParam, controllerExtra: ControllerExtraWithOperation) {
  const { key } = particleItem
  const { data = {} } = status
  const { reactUpdateQuotoRef } = controllerExtra
  if (data.props) {
    reactUpdateQuotoRef.current[key] = {
      data: {
        props: data.props
      }
    }
  }
}

export function particleReplaceController(particleItem: ParticleItem, status: CallbackStatusParam, controllerExtra: ControllerExtraWithOperation) {
  /**
   * ！！注意：
   * 替换配置时，会先触发remove事件，此时已将更新信息推入更新堆栈，且更新器是做了防抖操作的，不会立即执行，待执行时，更新信息中的children（是引用）已包含替换的信息
   */
  // 将替换配置更新到树中
  particleInitController(particleItem, status, controllerExtra)
  // 以下为兜底操作，防止存在耗时的callback，没赶上remove的更新
  const { particleRef, reactUpdateQuotoRef, reactElementsRef } = controllerExtra
  const flatParticle = particleRef.current!.getItem() as FlatParticle
  const { relatKey } = status
  const currentRelatKey = relatKey![0] as string
  const currentParticle = flatParticle[currentRelatKey]!
  const { parent } = currentParticle[PARTICLE_FLAG]
  if (!reactUpdateQuotoRef.current[parent]) {
    reactUpdateQuotoRef.current[parent] = {
      data: {
        children: reactElementsRef.current.children[`${parent}-children`]
      }
    }
  }
}

export const controllers = {
  init: particleInitController,
  append: particleAppendController,
  remove: particleRemoveController,
  setItem: particleSetItemController,
  replace: particleReplaceController
}
