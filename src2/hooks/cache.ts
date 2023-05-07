import { useRef, useCallback } from 'react'
import { merge } from 'lodash-es'

export type UseCacheReturn<T extends object> = ReturnType<typeof useCache<T>>

export type GetCacheType<T> = {
	(): T
	<K extends keyof T>(key: K | (string & object)): T[K]
}

/** 使用useRef缓存数据 */
const useCache = <T extends object>(data: T) => {
	const cacheData = useRef<T>(data)

	const setCache = useCallback(
		(
			data: T | object,
			options?: {
				merge?: boolean
			}
		) => {
			const { merge: mergeOption } = options || {}
			if (mergeOption) {
				merge(cacheData.current, data)
			} else {
				Object.assign(cacheData.current, data)
			}
			return cacheData.current
		},
		[]
	)

	const getCache: GetCacheType<T> = useCallback(<K extends keyof T>(key?: K | (string & object)) => {
		return key ? cacheData.current[key] : cacheData.current
	}, [])

	return {
		setCache,
		getCache
	}
}

export default useCache
