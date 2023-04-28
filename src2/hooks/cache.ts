import { useRef, useCallback } from 'react'

export type UseCacheReturn<T extends object> = ReturnType<typeof useCache<T>>

/** 使用useRef缓存数据 */
const useCache = <T extends object>(data: T) => {
	const cacheData = useRef<T>(data)

	const setCache = useCallback((data: T | object) => {
		Object.assign(cacheData.current, data)
	}, [])

	const getCache = useCallback(<K extends keyof T>(key: K): T[K] => {
		return cacheData.current[key]
	}, [])

	return {
		setCache,
		getCache
	}
}

export default useCache
