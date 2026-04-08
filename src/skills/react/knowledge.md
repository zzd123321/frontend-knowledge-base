# React 核心知识点

React 是一个用于构建用户界面的 JavaScript 库，核心思想是通过组件化和声明式编程来管理复杂界面。现代 React 开发通常配合函数组件、Hooks、状态管理、路由、构建工具和 TypeScript 一起使用，因此学习 React 时不能只停留在 JSX 和 `useState`，而要把组件模型、状态流转、渲染机制、性能优化和工程化一起理解。

---

## 1. React 的核心思想

React 的核心可以概括为以下几点：

- 声明式 UI
- 组件化开发
- 单向数据流
- 用状态驱动视图

### 声明式 UI

开发者只需要描述“当前状态下界面应该长什么样”，而不是自己手动更新 DOM。

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

在这个例子里，我们不需要：

- 手动查询 DOM
- 手动设置文本内容
- 手动维护更新逻辑

React 会根据状态变化自动重新渲染组件。

### 组件化

页面由许多小组件组成，每个组件负责自己的 UI 和逻辑。

优点：

- 复用性高
- 可维护性更好
- 有利于团队协作
- 易于测试和拆分复杂功能

### 单向数据流

React 中数据通常从父组件流向子组件，子组件通过 props 接收数据。  
这种单向数据流让数据来源更清晰，也更容易定位问题。

---

## 2. JSX

JSX 是 JavaScript 的语法扩展，允许我们在 JS 里写类似 HTML 的结构。

```tsx
const element = <h1>Hello React</h1>
```

它本质上不是字符串模板，而是会被编译为 `React.createElement` 或新的 JSX runtime 调用。

### JSX 的特点

- 看起来像 HTML，但本质是 JavaScript 表达式
- 可以在 `{}` 中插入变量、表达式
- 最终会编译成 React 元素对象

```tsx
const name = 'Tom'
const element = <h1>Hello, {name}</h1>
```

### JSX 常见规则

- 必须有一个根节点，或者使用 Fragment
- 标签要闭合
- 使用 `className` 而不是 `class`
- 使用驼峰命名，如 `onClick`、`tabIndex`

```tsx
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
)
```

---

## 3. React 元素与组件

### React 元素

React 元素是用来描述 UI 的普通对象，是渲染的最小单位。

```tsx
const element = <button>Click</button>
```

### 组件

组件是返回 React 元素的函数或类。

现代 React 主要使用函数组件。

```tsx
function Welcome() {
  return <h1>Hello</h1>
}
```

组件本质上是 UI 的抽象和封装，通常具备：

- 输入：props
- 内部状态：state
- 输出：React 元素树

---

## 4. Props 与单向数据流

Props 是组件的输入，用于父组件向子组件传递数据。

```tsx
type UserCardProps = {
  name: string
  age: number
}

function UserCard({ name, age }: UserCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{age}</p>
    </div>
  )
}
```

父组件使用：

```tsx
<UserCard name="Tom" age={20} />
```

### Props 特点

- 只读
- 由父组件控制
- 子组件不应直接修改 props

如果子组件需要通知父组件，通常通过回调函数：

```tsx
type ChildProps = {
  onSubmit: (id: number) => void
}
```

---

## 5. State 与状态更新

State 是组件内部可变化的数据。

### `useState`

```tsx
const [count, setCount] = useState(0)
```

这里：

- `count` 是当前状态
- `setCount` 是更新函数

### 状态更新特点

- 状态更新会触发重新渲染
- 更新通常是异步调度的
- 不应直接修改状态值

错误示例：

```tsx
count = count + 1
```

正确示例：

```tsx
setCount(count + 1)
```

### 基于旧状态更新

当新状态依赖旧状态时，优先函数式更新：

```tsx
setCount((prev) => prev + 1)
```

这样可以避免闭包拿到旧值的问题。

---

## 6. 事件处理

React 事件绑定和原生 DOM 事件很像，但有自己的合成事件系统。

```tsx
function Button() {
  function handleClick() {
    console.log('clicked')
  }

  return <button onClick={handleClick}>Click</button>
}
```

### 注意点

- 事件名使用驼峰命名，如 `onClick`
- 传入的是函数，不是函数调用结果

错误：

```tsx
<button onClick={handleClick()}>Click</button>
```

### 传参方式

```tsx
<button onClick={() => handleDelete(id)}>删除</button>
```

### 合成事件

React 使用 SyntheticEvent 统一浏览器差异。  
大多数时候按普通事件对象使用即可。

---

## 7. 条件渲染与列表渲染

### 条件渲染

常见写法：

```tsx
{isLogin ? <UserPanel /> : <LoginButton />}
```

或者：

```tsx
{loading && <Spinner />}
```

### 列表渲染

```tsx
{list.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

### `key` 的作用

`key` 用于标识列表项身份，帮助 React 在协调过程中正确复用节点。

最佳实践：

- 使用稳定唯一 id
- 不建议在动态列表里使用 index 作为 key

如果列表会插入、删除、重排，使用 index 可能导致：

- 输入框内容错位
- 子组件状态复用异常
- 动画表现错误

---

## 8. 受控组件与非受控组件

### 受控组件

表单值由 React state 控制。

```tsx
function SearchBox() {
  const [keyword, setKeyword] = useState('')

  return (
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  )
}
```

特点：

- 数据源统一
- 更适合表单校验、联动、可预测更新

### 非受控组件

表单值主要由 DOM 自己维护，通过 ref 获取。

```tsx
function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit() {
    console.log(inputRef.current?.value)
  }

  return <input ref={inputRef} />
}
```

实践中：

- 复杂表单通常用受控组件
- 某些高性能或简单场景可结合非受控方式

---

## 9. Hooks 基础

Hooks 是 React 函数组件中使用状态、生命周期和复用逻辑的方式。

常见 Hooks：

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- `useRef`
- `useContext`
- `useReducer`

### Hooks 规则

1. 只能在函数组件或自定义 Hook 中调用
2. 不能放在条件、循环、嵌套函数中调用

原因是 React 需要依赖 Hook 调用顺序来匹配状态槽位。

---

## 10. `useEffect`

`useEffect` 用于处理副作用。

副作用包括：

- 请求接口
- 订阅事件
- 操作 DOM
- 定时器
- 手动同步外部系统

### 基础用法

```tsx
useEffect(() => {
  document.title = 'Home'
}, [])
```

### 依赖数组

- `[]`：仅首次挂载后执行一次
- `[count]`：依赖变化时重新执行
- 不传：每次渲染后都执行

```tsx
useEffect(() => {
  console.log(count)
}, [count])
```

### 清理函数

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => {
    clearInterval(timer)
  }
}, [])
```

非常适合清理：

- 定时器
- 事件监听
- 订阅
- 请求取消

### 常见误区

- 把本应在渲染阶段推导的值写进 `useEffect`
- 依赖项不全导致逻辑错乱
- 在 effect 中无节制更新状态引发循环

---

## 11. `useMemo` 与 `useCallback`

### `useMemo`

缓存计算结果。

```tsx
const total = useMemo(() => {
  return list.reduce((sum, item) => sum + item.price, 0)
}, [list])
```

适用场景：

- 计算昂贵的派生值
- 需要稳定引用的对象

### `useCallback`

缓存函数引用。

```tsx
const handleSubmit = useCallback(() => {
  console.log('submit')
}, [])
```

适用场景：

- 传给被 `memo` 包裹的子组件
- 作为依赖传入其他 Hooks

### 不要滥用

`useMemo` 和 `useCallback` 不是“默认都加”。  
如果没有明显性能收益，过度使用反而增加心智负担。

---

## 12. `useRef`

`useRef` 有两个主要用途：

### 1. 获取 DOM 引用

```tsx
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])
```

### 2. 保存不会触发重渲染的可变值

```tsx
const timerRef = useRef<number | null>(null)
```

特点：

- `.current` 可变
- 修改 `.current` 不会触发重新渲染

适合保存：

- DOM 节点
- 定时器 id
- 上一次值
- 某些实例对象

---

## 13. `useContext`

Context 用于跨层级共享数据，避免层层 props 透传。

```tsx
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  )
}

function Toolbar() {
  const theme = useContext(ThemeContext)
  return <div>{theme}</div>
}
```

适合场景：

- 主题
- 当前用户
- 国际化
- 表单上下文

注意：

- Context 很方便，但不要把所有状态都塞进去
- 高频变化的大状态放 Context 里可能导致不必要重渲染

---

## 14. `useReducer`

当状态逻辑复杂、多个字段联动、状态迁移明确时，`useReducer` 会比多个 `useState` 更适合。

```tsx
type State = {
  count: number
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}
```

使用：

```tsx
const [state, dispatch] = useReducer(reducer, { count: 0 })
```

适合：

- 表单状态机
- 异步请求状态
- 复杂业务状态切换

---

## 15. 自定义 Hook

自定义 Hook 是 React 逻辑复用的重要方式。

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}
```

使用：

```tsx
const width = useWindowWidth()
```

优点：

- 复用状态逻辑
- 代码来源清晰
- 替代类组件时代高阶组件和 render props 的一部分用途

约定：

- 命名以 `use` 开头
- 内部可使用其他 Hook

---

## 16. 渲染机制与 Re-render

React 组件的核心行为是“状态变化后重新执行组件函数，生成新的 UI 描述”。

### 重新渲染不等于重新操作整棵 DOM

过程通常是：

1. 组件函数重新执行
2. 生成新的 React 元素树
3. React 进行协调
4. 只更新真实 DOM 中必要部分

### 触发重新渲染的常见原因

- state 更新
- props 变化
- context 变化
- 父组件重新渲染

### 如何减少不必要渲染

- 合理拆分组件
- 使用 `memo`
- 稳定 props 引用
- 避免无意义的状态提升

---

## 17. `React.memo`

`React.memo` 用于记忆函数组件，避免在 props 未变化时重复渲染。

```tsx
const UserCard = memo(function UserCard({ name }: { name: string }) {
  return <div>{name}</div>
})
```

注意：

- 只做浅比较
- 如果 props 是新对象或新函数引用，仍可能重新渲染

通常需要和 `useMemo` / `useCallback` 配合。

不要滥用：

- 小组件或廉价渲染场景不一定值得

---

## 18. React 中的闭包问题

函数组件每次渲染都会形成新的作用域，因此很容易出现闭包拿到旧值的问题。

示例：

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count)
  }, 1000)

  return () => clearInterval(timer)
}, [])
```

这里如果依赖数组为空，`count` 可能一直是初始值。

解决思路：

- 补全依赖
- 使用函数式更新
- 使用 ref 存最新值
- 按场景重新设计 effect 逻辑

---

## 19. 组件通信

React 组件通信常见方式：

### 父传子：props

最基础方式。

### 子传父：回调函数

```tsx
function Parent() {
  function handleChange(value: string) {}
  return <Child onChange={handleChange} />
}
```

### 跨层级：Context

避免层层透传。

### 全局共享：状态管理库

如：

- Redux Toolkit
- Zustand
- Jotai
- Recoil

在现代 React 项目里，选择状态管理方案要看项目复杂度和团队习惯。

---

## 20. 表单处理

React 表单的关键点是理解受控组件。

### 常见写法

```tsx
const [form, setForm] = useState({
  username: '',
  password: '',
})

function handleChange(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const { name, value } = e.target
  setForm((prev) => ({
    ...prev,
    [name]: value,
  }))
}
```

### 实战中常见问题

- 多字段更新逻辑复杂
- 校验逻辑分散
- 表单性能问题

因此很多项目会使用：

- React Hook Form
- Formik

---

## 21. 条件渲染与组件卸载

React 中条件渲染会直接决定组件是否存在。

```tsx
{visible && <Dialog />}
```

当 `visible` 变成 `false` 时：

- 组件会卸载
- effect 清理函数会执行
- 内部 state 会消失

如果希望“隐藏但保留状态”，需要：

- 不要直接卸载
- 或借助缓存/状态提升/外部存储方案

---

## 22. React Router 基础

React Router 是 React 主流路由方案。

### 基础概念

- 路由配置
- 嵌套路由
- 动态路由
- 编程式导航
- 懒加载

### 常见用法

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/user/:id" element={<UserDetail />} />
</Routes>
```

获取参数：

```tsx
const { id } = useParams()
```

跳转：

```tsx
const navigate = useNavigate()
navigate('/login')
```

---

## 23. React 性能优化

React 性能优化不能只背概念，要理解几个核心方向。

### 1. 减少不必要渲染

- 合理拆组件
- `memo`
- 稳定引用

### 2. 控制状态粒度

- 不要把局部状态无意义上提
- 避免大组件承载过多状态

### 3. 大列表虚拟化

如使用：

- `react-window`
- `react-virtualized`

### 4. 懒加载

```tsx
const UserPage = lazy(() => import('./UserPage'))
```

### 5. 正确使用 key

避免列表协调错误。

### 6. 避免在 render 中创建高成本逻辑

把昂贵计算交给 `useMemo` 或提前处理。

---

## 24. React 18 重要变化

React 18 常见面试点包括：

- 并发渲染能力基础
- 自动批处理增强
- `createRoot`
- `startTransition`
- `useTransition`
- `useDeferredValue`
- Suspense 能力增强

### `createRoot`

```tsx
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
```

### 自动批处理

React 18 会在更多场景下自动合并多次状态更新，减少不必要渲染。

### `startTransition`

适合把非紧急更新标记为低优先级，例如搜索筛选、大列表切换。

---

## 25. 严格模式 StrictMode

开发环境下，React StrictMode 会帮助发现潜在问题。

它可能会：

- 额外执行某些渲染流程
- 重复触发一些生命周期和 effect 行为检查

目的不是“出 bug”，而是帮助你发现：

- 副作用不纯
- 清理不完整
- 依赖不正确

在开发中要理解这种行为，不要误判为线上 bug。

---

## 26. React 中的不可变更新

React 状态更新强调不可变数据思维。

错误写法：

```tsx
user.name = 'Jerry'
setUser(user)
```

正确写法：

```tsx
setUser((prev) => ({
  ...prev,
  name: 'Jerry',
}))
```

原因：

- React 更容易基于引用变化判断更新
- 不可变更新更利于调试、撤销、时间旅行、性能优化

复杂场景可借助 Immer。

---

## 27. React 与服务端渲染

React 不一定只能做 CSR。

### CSR

浏览器加载 JS 后再渲染页面。

优点：

- 前后端分离清晰
- 交互开发灵活

缺点：

- 首屏和 SEO 不够理想

### SSR

服务端先生成 HTML，再交给客户端接管。

优点：

- 首屏更快
- SEO 更好

缺点：

- 开发复杂度更高
- 服务端成本更高

现代 React SSR 常配合 Next.js。

---

## 28. React 开发最佳实践

- 优先使用函数组件和 Hooks
- 状态尽量就近管理，不要过度提升
- 区分“派生数据”和“真实状态”
- 纯派生值不要额外用 state 保存
- `useEffect` 只处理副作用
- 合理拆分自定义 Hook
- 公共组件的 props 设计要清晰稳定
- 不要默认 everywhere 使用 `memo/useMemo/useCallback`
- 动态列表使用稳定 key
- 在复杂项目中建立统一状态管理和组件规范

---

## 29. 一个综合示例

```tsx
import { useEffect, useMemo, useState } from 'react'

type User = {
  id: number
  name: string
}

export default function UserList() {
  const [keyword, setKeyword] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchUsers() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/users')
        const data = await response.json()

        if (!cancelled) {
          setUsers(data)
        }
      } catch {
        if (!cancelled) {
          setError('加载失败')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredUsers = useMemo(
    () => users.filter((user) => user.name.includes(keyword)),
    [users, keyword]
  )

  if (loading) return <p>加载中...</p>
  if (error) return <p>{error}</p>

  return (
    <section>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜索用户名"
      />

      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  )
}
```

这个例子串联了：

- `useState`
- `useEffect`
- `useMemo`
- 受控输入
- 条件渲染
- 列表渲染
- `key`
- 异步请求与清理

这也是 React 业务开发中最常见的一组核心能力。
