# TypeScript 核心知识点

TypeScript 是 JavaScript 的超集，在保留 JavaScript 运行时能力的同时，增加了静态类型系统、类型推导、接口、泛型、装饰器支持、类型级编程等能力。它本质上仍然会被编译为 JavaScript 执行，因此理解 TypeScript 时要始终区分两件事：

- 运行时真正存在的是 JavaScript 值和对象
- 编译时 TypeScript 只负责类型检查和开发期约束

---

## 1. TypeScript 的价值与核心特点

TypeScript 适合中大型前端项目、Node.js 项目、组件库和多人协作项目，核心价值主要体现在以下几个方面：

- 提前发现类型错误，减少低级 bug 进入运行时
- 提升代码可读性和可维护性，接口含义更清晰
- 更好的 IDE 支持，包括自动补全、重构、跳转、重命名
- 让复杂业务模型、函数签名、组件 props、接口响应结构更容易表达
- 更适合多人协作，公共 API 通过类型形成契约

需要注意：

- TypeScript 不能替代运行时校验
- 类型系统描述的是“程序员认为应该是什么”，不等于“外部输入一定是什么”
- 来自用户输入、接口返回、URL 参数、本地存储的数据，仍然需要必要的运行时校验

---

## 2. 基础类型

TypeScript 常见基础类型如下：

```ts
const username: string = 'alice'
const age: number = 18
const isAdmin: boolean = false
const nothing: null = null
const missing: undefined = undefined
const id: symbol = Symbol('id')
const big: bigint = 9007199254740991n
```

### 特殊类型

#### `any`

`any` 表示放弃类型检查，变量可以做任何操作。

```ts
let value: any = 1
value = 'hello'
value.foo.bar()
```

特点：

- 可以赋值给任意类型
- 任意类型也可以赋值给它
- 会破坏类型安全

实践建议：

- 尽量避免主动写 `any`
- 优先使用 `unknown`
- 历史项目迁移时可以临时使用，但要逐步收敛

#### `unknown`

`unknown` 表示“暂时不知道具体类型”，比 `any` 更安全。

```ts
let value: unknown

value = 'hello'
value = 123

if (typeof value === 'string') {
  console.log(value.toUpperCase())
}
```

特点：

- 可以接收任何值
- 使用前必须缩小类型
- 常用于外部输入、接口数据、异常对象

#### `void`

通常用于函数没有返回值的场景。

```ts
function log(message: string): void {
  console.log(message)
}
```

#### `never`

表示“不可能有值”，常用于：

- 永远抛异常的函数
- 死循环函数
- 联合类型穷尽检查

```ts
function fail(message: string): never {
  throw new Error(message)
}

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}
```

---

## 3. 类型推导与类型注解

TypeScript 会根据上下文自动推导类型。

```ts
const title = 'TypeScript'
const count = 3
```

### 什么时候写类型注解

- 函数参数必须显式写类型
- 公共函数返回值建议写
- 导出的对象、复杂数据结构建议写
- 类型含义不明显或希望约束更严格时写

```ts
function add(a: number, b: number): number {
  return a + b
}
```

实践建议：

- 简单局部变量优先依赖推导
- 公共 API 优先显式声明
- 不要把所有变量都手动写一遍类型，容易冗余

---

## 4. 联合类型、交叉类型、字面量类型

### 联合类型

表示值可能是多种类型之一。

```ts
let value: string | number
value = 'hello'
value = 123
```

使用前通常需要缩小类型：

```ts
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}
```

### 交叉类型

表示同时具备多个类型的特征。

```ts
type WithId = { id: number }
type WithName = { name: string }

type User = WithId & WithName
```

### 字面量类型

可以把具体值本身作为类型。

```ts
let direction: 'left' | 'right'
direction = 'left'
```

常用于：

- 状态枚举
- 请求方法
- 组件变体
- 业务状态流转

---

## 5. 数组、元组、对象类型

### 数组

```ts
const ids: number[] = [1, 2, 3]
const names: Array<string> = ['a', 'b', 'c']
```

### 元组

元组用于长度固定、每一项类型固定的位置型数据。

```ts
const point: [number, number] = [100, 200]
const entry: [string, number, boolean] = ['age', 18, true]
```

### 对象类型

```ts
const person: {
  name: string
  age: number
  married?: boolean
} = {
  name: 'Tom',
  age: 20,
}
```

其中：

- `?` 表示可选属性
- 对象字面量会触发更严格的多余属性检查

---

## 6. 接口 `interface` 与类型别名 `type`

### interface

适合描述对象结构、类实现契约、可扩展 API。

```ts
interface User {
  id: number
  name: string
  age?: number
}
```

### type

更灵活，适合联合类型、交叉类型、工具类型、映射类型等。

```ts
type Status = 'idle' | 'loading' | 'success' | 'error'

type User = {
  id: number
  name: string
}
```

### 两者区别

- `interface` 可以重复声明并自动合并
- `type` 不能重复声明同名类型
- `type` 能表达联合、交叉、条件类型等更复杂能力
- 日常对象结构两者都可以，团队统一风格即可

---

## 7. 函数类型

### 参数和返回值

```ts
function greet(name: string): string {
  return `Hello, ${name}`
}
```

### 可选参数、默认参数、剩余参数

```ts
function createUser(name: string, age?: number) {
  return { name, age }
}

function fetchList(page = 1, pageSize = 10) {
  return { page, pageSize }
}

function sum(...nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0)
}
```

### 函数类型声明

```ts
type Handler = (event: Event) => void

const handleClick: Handler = (event) => {
  console.log(event.type)
}
```

### 函数重载

```ts
function parse(value: string): string[]
function parse(value: number): number
function parse(value: string | number) {
  if (typeof value === 'string') {
    return value.split(',')
  }
  return value * 2
}
```

---

## 8. 类型断言、非空断言、`as const`

### 类型断言

```ts
const input = document.getElementById('username') as HTMLInputElement
console.log(input.value)
```

类型断言不会做运行时转换，只是影响编译器判断。

### 非空断言 `!`

```ts
const app = document.getElementById('app')!
app.innerHTML = 'hello'
```

表示该值一定不是 `null` 或 `undefined`，但如果判断错了，运行时仍会报错。

### `as const`

```ts
const config = {
  theme: 'dark',
  pageSize: 20,
} as const
```

效果：

- 字面量类型不会被扩宽
- 属性变为只读

---

## 9. 类型缩小与类型守卫

### `typeof`

```ts
function printId(id: string | number) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase())
  } else {
    console.log(id.toFixed(0))
  }
}
```

### `instanceof`

```ts
function formatDate(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString()
  }
  return new Date(value).toISOString()
}
```

### `in`

```ts
type Fish = { swim: () => void }
type Bird = { fly: () => void }

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim()
  } else {
    animal.fly()
  }
}
```

### 自定义类型守卫

```ts
type User = {
  id: number
  name: string
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}
```

---

## 10. 泛型

泛型的核心是“类型参数化”，让函数、类型、接口在保持复用的同时保留具体类型信息。

### 泛型函数

```ts
function identity<T>(value: T): T {
  return value
}

const a = identity<string>('hello')
const b = identity(123)
```

### 泛型接口

```ts
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
```

### 泛型约束

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length
}
```

### `keyof` 结合泛型

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

---

## 11. `keyof`、`typeof`、索引访问类型

### `keyof`

```ts
type User = {
  id: number
  name: string
}

type UserKey = keyof User
```

### 类型层面的 `typeof`

```ts
const config = {
  apiBase: '/api',
  timeout: 5000,
}

type Config = typeof config
```

### 索引访问类型

```ts
type User = {
  id: number
  name: string
  address: {
    city: string
  }
}

type UserName = User['name']
type Address = User['address']
```

数组元素类型写法也很常见：

```ts
const list = [
  { id: 1, title: 'A' },
  { id: 2, title: 'B' },
]

type Item = (typeof list)[number]
```

---

## 12. 映射类型与工具类型

### 常用工具类型

```ts
interface User {
  id: number
  name: string
  age: number
}

type UserPatch = Partial<User>
type FullUser = Required<User>
type ReadonlyUser = Readonly<User>
type UserBase = Pick<User, 'id' | 'name'>
type UserWithoutAge = Omit<User, 'age'>
```

### `Record`

```ts
type Status = 'idle' | 'loading' | 'success'

const statusText: Record<Status, string> = {
  idle: '空闲',
  loading: '加载中',
  success: '成功',
}
```

### 其他常见工具

```ts
type A = 'a' | 'b' | 'c'

type B = Exclude<A, 'a'>
type C = Extract<A, 'a' | 'd'>
type SafeName = NonNullable<string | null | undefined>
```

---

## 13. 条件类型与 `infer`

```ts
type IsString<T> = T extends string ? true : false
```

### `infer`

```ts
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = (name: string) => number
type R = GetReturnType<Fn>
```

提取 Promise 结果：

```ts
type AwaitedValue<T> = T extends Promise<infer R> ? R : T
```

---

## 14. 枚举、联合字面量与常量对象

### `enum`

```ts
enum RequestMethod {
  Get = 'GET',
  Post = 'POST',
}
```

### 联合字面量

```ts
type RequestMethod = 'GET' | 'POST'
```

### `as const` 常量对象

```ts
const REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
} as const

type RequestMethod = typeof REQUEST_METHOD[keyof typeof REQUEST_METHOD]
```

业务前端项目里，很多场景更推荐联合字面量或 `as const`。

---

## 15. 类、访问修饰符、抽象类

```ts
class User {
  constructor(public name: string, private age: number) {}

  greet() {
    return `Hello, ${this.name}`
  }
}
```

访问修饰符：

- `public`：默认，任何地方都可访问
- `private`：只能类内部访问
- `protected`：类内部和子类可访问

抽象类示例：

```ts
abstract class Shape {
  abstract getArea(): number
}

class Circle extends Shape {
  constructor(private radius: number) {
    super()
  }

  getArea() {
    return Math.PI * this.radius * this.radius
  }
}
```

---

## 16. `tsconfig.json` 常用配置

常见重要配置包括：

- `strict`
- `target`
- `module`
- `moduleResolution`
- `lib`
- `baseUrl`
- `paths`
- `jsx`
- `allowJs`
- `checkJs`
- `skipLibCheck`
- `noImplicitAny`
- `strictNullChecks`

其中最关键的通常是 `strict`，新项目建议直接开启。

---

## 17. 模块系统与声明文件

### 类型导入

```ts
import type { User } from './user'
```

### 声明文件 `.d.ts`

```ts
declare module 'legacy-lib' {
  export function start(): void
}
```

扩展环境变量：

```ts
interface ImportMetaEnv {
  readonly VITE_API_BASE: string
}
```

---

## 18. TypeScript 与运行时校验

TypeScript 只做编译期检查，不能替代运行时校验。

```ts
interface User {
  id: number
  name: string
}

const data = await fetch('/api/user').then((r) => r.json()) as User
```

上面即使断言成 `User`，也不代表后端返回一定真的符合结构。  
因此真实项目里要把 TypeScript 和运行时校验配合使用。

---

## 19. TypeScript 最佳实践

- 新项目优先开启 `strict`
- 公共 API、组件 props、接口响应结构显式建模
- 外部输入优先用 `unknown`
- 少用 `any`
- 少用无依据的 `as`
- 优先让类型自然推导
- 类型设计要服务于可读性和维护性

---

## 20. 综合示例

```ts
type UserRole = 'admin' | 'editor' | 'visitor'

interface User {
  id: number
  name: string
  role: UserRole
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'role' in value
  )
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const result: ApiResponse<unknown> = await response.json()

  if (!isUser(result.data)) {
    throw new Error('Invalid user data')
  }

  return result.data
}
```

这个例子串联了：

- 联合字面量类型
- 接口
- 泛型
- `unknown`
- 类型守卫
- Promise 返回值约束
