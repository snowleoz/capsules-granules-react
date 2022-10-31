<div align="center">
  <br>
  <h1>capsule-particle-react</h1>
  <p align="left">
    根据对象描述，渲染出对应的React组件，提供对组件的新增、修改、删除、替换等方法。
  </p>
  <p align="left">
  </p>
</div>

## 目录
1. [安装](#install)
2. [使用](#usage)

<h2 align="center" id="install">安装</h2>
<br/>

Install with npm:

```bash
npm install capsule-particle-react --save
```

Install with yarn:

```bash
yarn add capsule-particle-react --save
```

<h2 align="center" id="usage">使用</h2>
<br/>


```javascript
 <ParticleReact
  // 实例函数
  ref={particleRef}
  // 组件描述
  config={config}
  // 组件注册信息
  register={register} 
  // 内部是否默认深拷贝
  cloneDeepConfig={false}
 />
```

## ParticleReact 属性

---

### ref - `React.RefObject<ImperativeRef>`

ParticleReact 的实例函数容器，组件树构成后，会注入新增、删除、修改、替换等操作函数；

(Note: config 也可以是个数组)

---

### config - `configParticle`

```javascript
  {
    // 组件的唯一key
    key: string
    // 组件在注册列表中的名称
    type: string
    // 传递给组件的属性
    props: object
    // 组件的子级
    children: configParticle
    // 扩展设置项
    particleOption: object
  }
```

---

### register `obejct`

```javascript
  {
    // 组件的名称
    type: string
    // 对应的组件实体
    component: React.Component
  }
```

---

### cloneDeepConfig `boolean`

是否对配置进行深拷贝，默认为false

(Note: 如果设置为true，需要安装lodash)

---

### loading - `React.ReactElement`

配置解析过程中的loading组件

---

## ReactParticle 实例方法 - `ImperativeRef`

---

正在建设中...
