import { useState, useCallback } from 'react'
export function useForceUpdate() {
	const [forceFlag, $setForceUpdate] = useState<number>(0)
	const forceUpdate = useCallback(() => {
		$setForceUpdate((flag) => flag + 1)
	}, [])
	return {
		forceFlag,
		forceUpdate
	}
}
