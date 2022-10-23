import React, { createElement, FC, useEffect, useMemo, useState } from 'react'
import { ReactCreateElements, ParticleStateRef, ReactCreateElementCmpt } from '../../types'

export interface IProps {
  // 组件
  particleCmpt: ReactCreateElementCmpt
  // 组件属性
  particleProps: Record<string, any>
  // 组件子级
  particleChildren?: ReactCreateElements
  // 组件KEY
  particleKey: string
  // 状态机容器
  particleStateRef: React.MutableRefObject<ParticleStateRef>
}

const Updater: FC<IProps> = props => {
  const { particleProps = {}, particleChildren, particleKey, particleCmpt, particleStateRef } = props
  console.log('props: ', props)
  const [updater, setUpdater] = useState()
  useEffect(() => {
    particleStateRef.current[`${particleKey}-updater`] = setUpdater
  }, [])
  const component = useMemo(() => {
    return createElement(particleCmpt, particleProps, particleChildren || particleProps.children)
  }, [updater])
  return component
}

export default Updater
