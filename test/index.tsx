import React, { useMemo, useRef } from 'react'
import ReactDom from 'react-dom/client'
import ParticleReact, { ImperativeRef } from '../src'

const divCmpt: React.FC<any> = props => {
  return <div>{props.children}</div>
}

const App = () => {
  const particleRef = useRef<ImperativeRef>(null)
  const register = useMemo(() => {
    return [
      {
        type: 'div',
        component: divCmpt
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
              key: 'test2-child1',
              type: 'div',
              props: {
                children: 'test2-child1'
              }
            },
            {
              key: 'test2-child2',
              type: 'div',
              props: {
                children: 'test2-child2'
              }
            }
          ]
        },
        {
          key: 'test3',
          type: 'div',
          children: [
            {
              key: 'test3-child1',
              type: 'div',
              props: {
                children: 'test3-child1'
              }
            },
            {
              key: 'test3-child2',
              type: 'div',
              props: {
                children: 'test3-child2'
              }
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
              key: 'test4-child1',
              type: 'div',
              props: {
                children: 'test4-child1'
              }
            },
            {
              key: 'test4-child2',
              type: 'div',
              props: {
                children: 'test4-child2'
              }
            }
          ]
        }
      ],
      type: 'div'
    }
  }, [])
  console.log('particleRef: ', particleRef)
  return <ParticleReact ref={particleRef} config={config} register={register} />
}

const container = document.getElementById('root')
if (container) {
  const root = ReactDom.createRoot(container)
  root.render(<App />)
}
