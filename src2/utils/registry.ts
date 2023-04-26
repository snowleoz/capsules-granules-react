import { isValidElement } from 'react'
import { forEach } from 'lodash-es'
import { Error } from '../components'
import type { RegistryItem } from '../../typings'

/** 检查组件注册的有效性 */
export function checkRegistry(registryItem: RegistryItem) {
	const { type, component } = registryItem
	return type && component && (typeof component === 'string' || isValidElement(component))
}

export function initRegistry(registry: RegistryItem[]) {
	if (registry) {
		const registryMap: Record<string, RegistryItem> = {}
		forEach(registry, (registryItem) => {
			const isVaild = checkRegistry(registryItem)
			if (isVaild) {
				registryMap[registryItem.type] = registryItem
			} else {
				/** 如果有type信息，则将组件替换为错误展示组件 */
				if (registryItem.type) {
					registryItem.component = Error
					registryItem.defaultProps = registryItem
				}
				console.error('Incorrect registration information, please check, registry key is ', registryItem.type)
			}
		})
		return registryMap
	} else {
		console.error('Invalid registration information, please check registry props')
	}
	return null
}
