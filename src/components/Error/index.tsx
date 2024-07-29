import React, { ReactNode } from 'react'

export type IProps = {
	children?: ReactNode
}
function Error(props: IProps) {
	return (
		<div>
			Error component
			<div style={{ paddingLeft: '10px' }}>{props.children}</div>
		</div>
	)
}

export default Error
