import { useRef, useCallback } from 'react'
import { forEach } from 'lodash-es'

export type UseCacheReturn = ReturnType<typeof useCache>

/** 使用useRef缓存数据 */
const useCache = <T extends Record<string, unknown>>(data: T) => {
	const cacheData = useRef<T>(data)

	const setCache = useCallback((data: T | Record<string, unknown>) => {
		Object.assign(cacheData.current, data)
	}, [])

	const getCache = useCallback((key: keyof T | (string & object)) => {
		if (Array.isArray(key)) {
			const result: Record<string, unknown> = {}
			forEach(key, (keyItem) => {
				result[keyItem] = cacheData.current[keyItem]
			})
			return result
		} else {
			return cacheData.current[key]
		}
	}, [])

	return {
		setCache,
		getCache
	}
}

export default useCache
