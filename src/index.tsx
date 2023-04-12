import React, {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useCallback,
	useState,
	Fragment,
	useMemo
} from 'react'
import Particle, { IOption } from 'capsule-particle'
import { controllers } from './utils'
import { forEach } from 'lodash-es'
import {
	IProps,
	ReactCreateElements,
	ImperativeRef,
	RegisterRef,
	ReactElementsRef,
	particleDispatchRef,
	reactUpdateQuotoRef
} from '../typings'

const ParticleReact = (props: IProps, ref: React.Ref<ImperativeRef>) => {
	const { config, register = [], loading, cloneDeepConfig = false } = props

	/**  渲染组件 */
	const [elements, setElements] = useState<ReactCreateElements>(null)

	/**  注册列表 */
	const registerRef = useRef<RegisterRef>({
		register: register,
		registerMap: register.reduce((acc, cur) => {
			acc[cur.type] = cur.component
			return acc
		}, {} as RegisterRef['registerMap'])
	})
	/**  react 组件渲染树 */
	const reactElementsRef = useRef<ReactElementsRef>({
		children: {},
		element: {}
	})
	/**  react 更新队列 */
	const reactUpdateQuotoRef = useRef<reactUpdateQuotoRef>({})
	/** react 更新定时器 */
	const reactUpdateTimer = useRef<any>()
	/**  组件状态机，用于传递到更新层收集更新器（dispatch） */
	const particleDispatchRef = useRef<particleDispatchRef>({})
	/**  Particle 实例 */
	const particleRef = useRef<Particle | null>(null)
	/** ReactParticle 的实例方法 */
	const reactParticleRef = useRef<ImperativeRef>({
		/** 组件注册列表 */
		register: registerRef.current.register,
		/** 组件注册映射表 */
		registerMap: registerRef.current.registerMap,
		/** 获取配置树 */
		getParticle: () => {
			return particleRef.current?.getParticle()
		},
		/** 获取指定配置或所有打平配置 */
		getItem: (keys?: string[], dataType?: 'object' | 'array') => {
			return particleRef.current?.getItem(keys, dataType)
		},
		/** 新增配置到指定节点中 */
		append: (key: string, config: IProps['config'] | IProps['config'][], order?: number | undefined) => {
			particleRef.current?.append(key, config, { order })
		},
		/** 删除指定的配置 */
		remove: (keys: string[]) => {
			particleRef.current?.remove(keys)
		},
		/** 设置指定的节点的配置 */
		setItem: (key: string, data: Record<string, any>) => {
			return particleRef.current?.setItem(key, data) as boolean
		},
		/** 替换指定节点 */
		replace: (key: string, config: IProps['config']) => {
			particleRef.current?.replace(key, config)
		}
	})

	// 对外暴露的实例函数
	useImperativeHandle(ref, () => reactParticleRef.current, [config])

	const updater = useCallback(() => {
		clearTimeout(reactUpdateTimer.current)
		const quotoKeys = Object.keys(reactUpdateQuotoRef.current)
		if (quotoKeys.length) {
			reactUpdateTimer.current = setTimeout(() => {
				forEach(quotoKeys, (key) => {
					const quotoItem = reactUpdateQuotoRef.current[key]
					const { data } = quotoItem!
					particleDispatchRef.current[`${key}-updater`]!(data)
				})
				reactUpdateQuotoRef.current = {}
			}, 8)
		}
	}, [])

	// 配置控制器，用于给配置标记、信息收集
	const controller = useCallback<Required<IOption>['controller']>((particleItem, status) => {
		controllers[status!.type](particleItem, status!, {
			registerRef,
			reactElementsRef,
			particleDispatchRef,
			reactUpdateQuotoRef,
			reactParticleRef
		})
		updater()
	}, [])

	// 解析配置，生成React树
	useEffect(() => {
		particleRef.current = new Particle({
			description: config,
			controller,
			cloneDeepDesc: cloneDeepConfig
		})
		setElements(Object.values(reactElementsRef.current.element))
	}, [config])

	const render = useMemo(() => {
		if (elements) {
			return React.createElement(Fragment, undefined, elements)
		}
		return <div>{loading || null}</div>
	}, [elements])

	return render
}

export default forwardRef(ParticleReact)
