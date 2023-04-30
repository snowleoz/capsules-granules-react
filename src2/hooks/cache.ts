import { useRef, useCallback } from 'react'
import { merge } from 'lodash-es'

export type UseCacheReturn<T extends object> = ReturnType<typeof useCache<T>>

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
		},
		[]
	)

	const getCache = useCallback(<K extends keyof T>(key: K | (string & object)): T[K] => {
		return cacheData.current[key]
	}, [])

	return {
		setCache,
		getCache,
		cacheData
	}
}

export default useCache
