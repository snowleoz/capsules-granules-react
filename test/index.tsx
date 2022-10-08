import React, { useMemo } from 'react'
import ReactDom from 'react-dom/client'
import ParticleReact from '../src'

const App = () => {
  const register = useMemo(() => {
    return [
      {
        type: 'div',
        component: 'div'
      }
    ]
  }, [])
  const config = useMemo(() => {
    return {
      key: 'test',
      children: [
        {
          key: 'test2',
          type: 'div',
          children: [
            {
              key: 'test2-child1'
            },
            {
              key: 'test2-child2'
            }
          ],
          props: {
            children: 'test2'
          }
        },
        {
          key: 'test3',
          type: 'div',
          children: [
            {
              key: 'test3-child1'
            },
            {
              key: 'test3-child2'
            }
          ],
          props: {
            children: 'test3'
          }
        },
        {
          key: 'test4',
          type: 'div',
          children: [
            {
              key: 'test4-child1'
            },
            {
              key: 'test4-child2'
            }
          ],
          props: {
            children: 'test4'
          }
        }
      ],
      type: 'div'
    }
  }, [])
  return <ParticleReact config={config} register={register} />
}

const container = document.getElementById('root')
if (container) {
  const root = ReactDom.createRoot(container)
  root.render(<App />)
}
