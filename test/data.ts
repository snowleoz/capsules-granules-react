export const description = [
	{
		key: 'div1',
		type: 'div',
		children: [
			{
				key: 'div1-child1',
				type: 'div',
				props: {
					children: 'div1-child1'
				}
			},
			{
				key: 'div1-child2',
				type: 'div',
				props: {
					children: 'div1-child2'
				}
			}
		]
	},
	{
		key: 'div2',
		type: 'div',
		children: [
			{
				key: 'div2-child1',
				type: 'div',
				props: {
					children: 'div2-child1'
				}
			},
			{
				key: 'div2-child2',
				type: 'div',
				props: {
					children: 'div2-child2-child'
				}
			},
			{
				key: 'div2-child3',
				type: 'div',
				children: [
					{
						key: 'div2-child3-child1',
						type: 'div',
						props: {
							children: 'div2-child3-child1-child'
						}
					}
				]
			}
		]
	}
]
