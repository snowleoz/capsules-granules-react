export type CloneMatchType = '$date$/' | '$function$/' | undefined

export function cloneDeep(data: object) {
	const saveDateToJSON = Date.prototype.toJSON
	Date.prototype.toJSON = function () {
		return `$date$/${this.getTime()}`
	}
	Function.prototype.toJSON = function () {
		return `$function$/${this.toString()}`
	}
	const result = JSON.parse(JSON.stringify(data), (_key, value) => {
		if (typeof value === 'string' && value.charAt(0) === '$') {
			let matchType: CloneMatchType = undefined
			const newValue: string = value.replace(/\$(\d|\w)+\$\//, (match) => {
				matchType = match as CloneMatchType
				return ''
			})
			if (matchType === '$date$/') {
				return parseInt(newValue)
			}
			if (matchType === '$function$/') {
				return new Function(`return ${newValue}`)()
			}
			return newValue
		}
		return value
	})
	Date.prototype.toJSON = saveDateToJSON
	Function.prototype.toJSON = undefined
	return result
}
