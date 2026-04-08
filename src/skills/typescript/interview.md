# TypeScript 面试题


## Q1. TypeScript 和 JavaScript 的关系是什么？

**答：**

TypeScript 是 JavaScript 的超集，核心意思是：绝大多数合法的 JavaScript 代码本身也是合法的 TypeScript。TypeScript 在 JavaScript 的基础上增加了静态类型系统、接口、泛型、类型推导、声明文件等能力，但最终仍然需要编译为 JavaScript 才能在浏览器或 Node.js 环境中运行。

从运行机制上看，JavaScript 是运行时语言，TypeScript 主要工作在编译阶段。也就是说：

- 开发阶段：TypeScript 帮我们检查类型、提供补全和重构能力
- 构建阶段：TypeScript 被擦除或转译
- 运行阶段：真正执行的是 JavaScript

这也是为什么要始终记住一句话：TypeScript 增强的是“开发期约束”和“可维护性”，不是直接改变运行时本质。

---

## Q2. TypeScript 的核心价值是什么？它解决了哪些问题？

**答：**

我一般会从“工程价值”和“开发体验”两个角度回答。

第一，它显著降低了低级错误进入运行时的概率。比如参数类型不匹配、属性拼写错误、可空值未处理、接口返回结构和使用方式不一致，这些在纯 JavaScript 里往往要等到运行时甚至线上才能暴露，而 TypeScript 可以在开发阶段直接拦住。

第二，它让大型项目中的代码契约更清晰。函数接收什么、返回什么，组件 props 是什么结构，请求响应长什么样，公共工具库该怎么用，这些都可以通过类型来表达。类型本质上就是一份可执行的文档。

第三，它极大提升了 IDE 能力，比如自动补全、跳转定义、重命名、引用查找、重构提示。这在中大型项目里不是“锦上添花”，而是决定开发效率的核心能力之一。

但它也有边界：

- 它不能替代运行时校验
- 它不能自动保证后端返回的数据真的符合类型
- 它不能替代测试

所以更准确的说法是：TypeScript 不是“防 bug 万能药”，而是“提高工程确定性和协作效率”的核心基础设施。

---

## Q3. `any`、`unknown`、`never` 的区别是什么？

**答：**

这三个类型很容易一起考，因为它们分别代表了类型系统中三种非常不同的语义。

### `any`

`any` 表示“我放弃这部分类型检查”。一旦一个值是 `any`，你几乎可以对它做任何操作，编译器都不会拦你。

```ts
let value: any = 'hello'
value.foo.bar()
value()
```

它的优点是临时兼容性强，适合迁移老项目的某些过渡阶段；缺点是会破坏类型系统，污染沿调用链传播。所以 `any` 最大的问题不是“这一行不安全”，而是它会让后续很多地方都逐渐失去类型价值。

### `unknown`

`unknown` 可以理解成“类型安全版本的 any”。它也能接收任意值，但在真正使用之前，必须先做类型缩小。

```ts
let value: unknown = 'hello'

if (typeof value === 'string') {
  console.log(value.toUpperCase())
}
```

这让它非常适合处理外部输入，比如：

- 接口响应
- 本地存储读取结果
- `catch` 到的异常
- 第三方 SDK 返回值

### `never`

`never` 表示“不可能出现的值”。常见场景有两个：

1. 一个函数永远不会正常返回，比如只会 `throw`
2. 联合类型已经被穷尽，剩余分支理论上不应该存在

```ts
function fail(msg: string): never {
  throw new Error(msg)
}
```

`never` 在面试中很重要，因为它能体现你是否理解 TypeScript 的类型完备性和穷尽检查。

一句话总结：

- `any`：关闭检查
- `unknown`：先保守接收，再安全判断
- `never`：理论上不应该存在

---

## Q4. `interface` 和 `type` 有什么区别？项目里应该怎么选？

**答：**

这题不要只答“都可以”，要答出语义和使用场景。

### 相同点

二者都可以描述：

- 对象结构
- 函数签名
- 泛型类型

例如下面两种写法都合法：

```ts
interface User {
  id: number
  name: string
}

type User2 = {
  id: number
  name: string
}
```

### 不同点

#### 1. `interface` 支持声明合并

```ts
interface User {
  name: string
}

interface User {
  age: number
}
```

最终会自动合并成一个接口。这在扩展第三方类型、全局对象类型时非常有用。

#### 2. `type` 更适合表达复杂类型

比如联合类型、交叉类型、条件类型、映射类型，通常都更自然地用 `type` 表达。

```ts
type Status = 'idle' | 'loading' | 'success'
type Result<T> = T extends string ? 'text' : 'other'
```

### 实践选择建议

我一般会这样选：

- 对象契约、组件 props、类实现接口：优先 `interface`
- 联合类型、工具类型、复杂类型组合：优先 `type`

但真正重要的是团队统一风格，不要在一个项目里完全混乱地切换。

---

## Q5. 什么是类型推导？什么时候要显式声明类型？

**答：**

类型推导是 TypeScript 根据上下文自动推断类型的能力。

```ts
const count = 1 // number
const title = 'Hello' // string
```

它的价值在于减少冗余代码。如果每个局部变量都手写一遍类型，代码会很啰嗦，而且很多时候没意义。

但不是所有地方都该依赖推导。通常这些地方建议显式标注：

- 函数参数
- 公共函数返回值
- 导出的复杂对象
- 组件 props
- API 响应结构
- 你希望更严格约束的场景

例如：

```ts
function add(a: number, b: number): number {
  return a + b
}
```

为什么返回值也建议写？因为这样公共 API 更稳定，重构时也更容易发现不符合预期的变化。

所以比较成熟的策略是：

- 局部简单变量依赖推导
- 公共边界显式声明

---

## Q6. 联合类型和交叉类型有什么区别？

**答：**

联合类型 `|` 表示“可能是多个类型中的一个”，交叉类型 `&` 表示“同时满足多个类型”。

### 联合类型

```ts
let id: string | number
```

这表示 `id` 可能是字符串，也可能是数字。  
在真正使用前，你只能访问这两个类型的公共部分，或者通过类型缩小来区分。

### 交叉类型

```ts
type WithId = { id: number }
type WithName = { name: string }

type User = WithId & WithName
```

这里的 `User` 必须同时具有 `id` 和 `name`。

### 面试追问点

联合类型常和“类型守卫”一起考，因为联合类型的使用关键是缩小。  
交叉类型常和“类型组合”一起考，因为它适合把多个能力型类型拼起来。

一句话记忆：

- `|` 是“或”
- `&` 是“且”

---

## Q7. 什么是字面量类型？它有什么实际价值？

**答：**

字面量类型就是把具体值本身当成类型，而不是宽泛的 `string` 或 `number`。

```ts
type Method = 'GET' | 'POST'
type Theme = 'light' | 'dark'
```

它的实际价值非常大，因为业务里大量状态其实不是“任意字符串”，而是“少量有限值”。

例如：

- 请求方法
- 订单状态
- 主题类型
- 用户角色
- 组件 variant

如果你只写成 `string`，理论上任何字符串都能传进去；而字面量联合类型可以把范围精确收窄，编辑器还会给出智能补全。

所以它的核心价值是：让类型系统更接近真实业务约束。

---

## Q8. 什么是类型断言？为什么说它不是类型转换？

**答：**

类型断言是告诉编译器：“在当前上下文里，我比你更清楚这个值应该是什么类型。”

```ts
const input = document.getElementById('name') as HTMLInputElement
```

这里的 `as HTMLInputElement` 不是把值真的转换成 HTMLInputElement，而只是告诉 TypeScript 按这个类型去理解。

这就是为什么说它不是运行时类型转换。比如：

- `Number('123')` 会真的在运行时得到数字 `123`
- `value as number` 只是静态层面的断言

因此，类型断言的风险在于：如果你断言错了，编译能过，但运行时仍然会出问题。

成熟的使用原则是：

- 当你确实比编译器更清楚时才使用
- 优先通过类型守卫和更合理的类型建模解决问题
- 不要把 `as` 当成“消除报错按钮”

---

## Q9. `as const` 的作用是什么？

**答：**

`as const` 会让 TypeScript 尽可能把一个值推导成只读字面量类型，而不是宽泛类型。

```ts
const config = {
  theme: 'dark',
  pageSize: 20,
} as const
```

此时：

- `theme` 的类型是 `'dark'`，不是 `string`
- `pageSize` 的类型是 `20`，不是 `number`
- 属性也会变成只读

它很适合：

- 配置对象
- 常量映射
- action type
- 状态常量
- 替代某些前端项目中的 `enum`

很多现代 TypeScript 代码里，`as const` 是构造精确类型的高频工具。

---

## Q10. 什么是类型守卫？常见方式有哪些？

**答：**

类型守卫的本质是：在运行时做判断，并让 TypeScript 在某个分支里知道类型被缩小了。

常见方式有四类：

### 1. `typeof`

适合基础类型。

```ts
if (typeof value === 'string') {
  value.toUpperCase()
}
```

### 2. `instanceof`

适合类实例。

```ts
if (value instanceof Date) {
  value.toISOString()
}
```

### 3. `in`

适合判断对象结构。

```ts
if ('name' in obj) {
  console.log(obj.name)
}
```

### 4. 自定义类型守卫

```ts
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value
}
```

这是实际项目中非常关键的一种能力，因为很多外部数据都应该先是 `unknown`，然后再通过守卫收窄。

所以类型守卫不只是“语法题”，它体现的是你有没有把“编译期类型”和“运行时真实数据”联系起来理解。

---

## Q11. `keyof`、`typeof`、索引访问类型分别有什么作用？

**答：**

这三个组合起来是 TypeScript 日常建模的核心工具。

### `keyof`

拿到一个对象类型所有键组成的联合类型。

```ts
type User = {
  id: number
  name: string
}

type UserKey = keyof User // 'id' | 'name'
```

### 类型层面的 `typeof`

拿到某个变量的类型。

```ts
const config = {
  apiBase: '/api',
  timeout: 5000,
}

type Config = typeof config
```

### 索引访问类型

根据键从类型中取出某个属性类型。

```ts
type NameType = User['name'] // string
```

这三个经常组合使用，比如：

```ts
const STATUS = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
} as const

type Status = typeof STATUS[keyof typeof STATUS]
```

这是项目里非常高频、非常实用的写法。

---

## Q12. 什么是泛型？为什么泛型很重要？

**答：**

泛型可以理解成“给类型传参数”。  
它的核心价值是：在复用逻辑时保留具体类型信息。

```ts
function identity<T>(value: T): T {
  return value
}
```

如果没有泛型，很多通用函数只能写成：

```ts
function identity(value: any): any {
  return value
}
```

这样虽然复用了逻辑，但完全丢失了类型约束。

泛型之所以重要，是因为现代前端有大量“结构类似但数据类型不同”的场景：

- 请求响应包装
- 列表组件
- hooks
- 表单模型
- 状态管理工具
- 通用工具函数

没有泛型，这些能力要么无法复用，要么只能退化成 `any`。

---

## Q13. 泛型约束 `extends` 有什么作用？

**答：**

泛型约束的作用是限制类型参数不能无限宽泛，而必须满足某个条件。

```ts
function getLength<T extends { length: number }>(value: T) {
  return value.length
}
```

这里的意思是：`T` 可以是任何类型，但它必须有 `length` 属性。

为什么这很重要？因为泛型如果没有边界，函数内部很多操作都不安全。约束本质上是在说：

- 我想保留泛型的灵活性
- 但我又需要它至少具备某些能力

这在真实项目里非常常见，比如：

- 限制某个类型必须有 `id`
- 限制某个 key 必须来自对象本身
- 限制某个类型必须是函数

---

## Q14. `T`、`K extends keyof T` 这种写法是什么意思？

**答：**

这是 TypeScript 泛型中非常经典的模式，用来表达“安全读取对象属性”。

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

含义拆开看：

- `T`：任意对象类型
- `keyof T`：这个对象所有合法键的联合
- `K extends keyof T`：`K` 必须是 `T` 的键之一
- `T[K]`：返回对应键的值类型

它的价值是：你既保留了通用性，又保证了安全性。

比如：

```ts
const user = { id: 1, name: 'Tom' }

getProp(user, 'name') // string
getProp(user, 'id') // number
```

如果传 `'age'` 就会直接报错。

这类写法体现的不是“会不会背语法”，而是有没有理解 TypeScript 如何把对象结构和泛型联系起来。

---

## Q15. 常见内置工具类型有哪些？它们解决了什么问题？

**答：**

TypeScript 内置工具类型本质上是在帮我们“基于已有类型快速生成新类型”，避免重复定义。

### `Partial<T>`

把所有属性变成可选。  
适合更新接口、Patch 场景。

### `Required<T>`

把所有属性变成必填。  
适合某些初始化后保证完整的模型。

### `Readonly<T>`

把所有属性变成只读。  
适合配置对象、不可变视图模型。

### `Pick<T, K>`

从原类型中挑选一部分属性。

### `Omit<T, K>`

从原类型中排除一部分属性。

### `Record<K, T>`

构造键值映射对象。  
非常适合状态映射、枚举映射、字典结构。

### `Exclude<T, U>` 与 `Extract<T, U>`

用于联合类型筛选和剔除。

### `NonNullable<T>`

去掉 `null | undefined`。

这些工具类型真正解决的问题是：业务模型会不断衍生变体，如果每次都重新手写一份类型，成本高且容易不一致。

---

## Q16. 什么是条件类型？什么是 `infer`？

**答：**

条件类型可以理解成“类型层面的 if...else”。

```ts
type IsString<T> = T extends string ? true : false
```

它会根据类型关系返回不同结果。

`infer` 则是在条件类型里“推断并提取”某一部分类型。

```ts
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

这里的 `infer R` 表示：如果 `T` 是函数类型，就把它的返回值类型推导出来并命名为 `R`。

`infer` 很常用于：

- 提取函数返回值
- 提取 Promise resolve 类型
- 提取数组元素类型
- 提取元组结构中的某一段

所以条件类型和 `infer` 是 TypeScript 进阶能力的核心，也是工具类型实现的底层基础。

---

## Q17. `enum`、联合字面量、`as const` 常量对象该怎么选？

**答：**

这是非常典型的“语法题背后考工程判断”的问题。

### `enum`

优点：

- 写法直观
- 有运行时对象

缺点：

- 会引入额外运行时代码
- 在前端业务代码里有时显得偏重

### 联合字面量

```ts
type Status = 'idle' | 'loading' | 'success'
```

优点：

- 非常轻量
- 类型精确
- 没有运行时代码

### `as const` 常量对象

```ts
const STATUS = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
} as const
```

它的好处是：既有运行时对象，又能导出精确类型。

### 实践建议

我通常会这么选：

- 如果只需要类型约束：联合字面量优先
- 如果还需要一个运行时常量映射对象：`as const` 常量对象优先
- 只有在明确需要枚举语义或历史项目约定时再考虑 `enum`

这也是很多现代前端项目的主流做法。

---

## Q18. 什么是声明文件 `.d.ts`？什么时候需要写？

**答：**

`.d.ts` 是类型声明文件，用来告诉 TypeScript 某个模块、全局变量或环境对象的类型长什么样。

常见场景包括：

1. 第三方库没有类型定义
2. 你要扩展全局对象，如 `window`
3. 你要声明环境变量类型
4. 你要给老的 JS 模块补类型

例如扩展环境变量：

```ts
interface ImportMetaEnv {
  readonly VITE_API_BASE: string
}
```

例如补第三方模块声明：

```ts
declare module 'legacy-lib' {
  export function init(): void
}
```

声明文件的价值在于：它把“运行时存在但编译器不知道的东西”变成类型系统可理解的对象。

---

## Q19. `strictNullChecks` 和 `strict` 为什么重要？

**答：**

`strict` 是 TypeScript 严格模式总开关，`strictNullChecks` 是其中最重要的一项之一。

### `strictNullChecks`

开启后，`null` 和 `undefined` 不再能随意赋给其他类型，开发者必须显式处理可空情况。

这能极大减少空值错误，是最有实际收益的严格配置之一。

### `strict`

它会打开一组更严格的类型检查，例如：

- 空值检查
- 隐式 any 检查
- 更严格的函数类型约束

为什么重要？因为如果不开严格模式，TypeScript 很容易退化成“只是带点提示的 JavaScript”，而无法真正发挥约束作用。

所以新项目通常建议尽量从一开始就启用 `strict`。

---

## Q20. `tsconfig.json` 中常见的重要配置有哪些？

**答：**

这题一般不要求背完整清单，而是要答出“哪些配置真正影响工程行为”。

常见重要配置包括：

- `strict`
- `target`
- `module`
- `moduleResolution`
- `lib`
- `jsx`
- `baseUrl`
- `paths`
- `allowJs`
- `checkJs`
- `skipLibCheck`
- `noImplicitAny`
- `strictNullChecks`

其中常见高频追问有三个：

1. 为什么建议开启 `strict`
2. `skipLibCheck` 为什么能提速
3. 路径别名为什么要和构建工具同步配置

这题最好不要只背字段名，而要结合它们的实际作用回答。

---

## Q21. 为什么不建议滥用 `any` 和 `as`？

**答：**

因为它们都属于“绕开类型系统”的手段。

### `any` 的问题

- 容易造成类型污染
- 后续很多调用链都失去类型保护
- 自动补全和重构提示质量下降

### `as` 的问题

- 它不会做运行时校验
- 如果断言错误，问题会延迟到运行时爆发

真正成熟的做法不是“哪里报错就 `as any`”，而是：

- 先看类型设计是否不合理
- 能否通过守卫缩小类型
- 能否引入更准确的模型
- 对外部输入做运行时校验

一句话：`any` 和 `as` 不是不能用，而是要克制地用、带理由地用。

---

## Q22. TypeScript 能保证运行时安全吗？

**答：**

不能。  
这是一个非常重要、也非常容易被误解的问题。

TypeScript 的类型系统大多存在于编译阶段，编译完成后，类型信息通常不会保留到运行时。

也就是说：

- 编译器相信你写的类型描述
- 但运行时收到的数据不一定真的长这样

比如：

```ts
interface User {
  id: number
  name: string
}

const data = await fetch('/api/user').then((r) => r.json()) as User
```

这里即使断言成 `User`，后端如果真返回错结构，运行时仍然会出问题。

所以正确理解是：

- TypeScript 保证的是“编译期一致性”
- 运行时安全仍然需要校验、异常处理和测试

---

## Q23. 项目从 JavaScript 迁移到 TypeScript 的思路是什么？

**答：**

大型项目迁移一般不建议一刀切，而应该分阶段推进。

常见思路是：

1. 先接入 TypeScript 编译链路
2. 允许 JS 与 TS 共存，比如开启 `allowJs`
3. 新代码优先写 TS
4. 从公共模块、接口层、工具函数层开始迁移
5. 逐步减少 `any`
6. 最后收紧 `strict` 和相关规则

为什么要这样做？因为类型迁移不仅是语法修改，更会影响：

- API 契约
- 组件边界
- 目录结构
- 工具链配置

如果强行全量改，风险很高，也容易拖慢业务节奏。

---

## Q24. 在 React / Vue 项目里 TypeScript 通常怎么落地？

**答：**

这题最好从“边界建模”和“框架结合”两方面回答。

### React 中

常见落地点：

- 组件 props
- 事件类型
- hooks 返回值
- `useRef` / `useState`
- 请求响应结构

### Vue 中

常见落地点：

- `defineProps`
- `defineEmits`
- `ref`、`computed`
- composable 返回值
- 路由、store、接口类型

真正重要的是给“公共边界”建模，而不是给每个局部变量都手动写类型。  
边界包括：

- 接口数据
- 组件契约
- 公共工具
- 状态管理

这是 TypeScript 在框架项目里产生长期价值的地方。

---

## Q25. 你如何评价 TypeScript 在大型项目中的意义与边界？

**答：**

我通常会从三个层面回答。

### 1. 对代码质量的意义

它把很多错误前移到开发阶段，让很多问题在写代码和提交代码时就被发现，而不是等到测试或线上。

### 2. 对团队协作的意义

大型项目里，很多代码不是你自己写的，也不会只被你一个人维护。类型让公共模块、组件、接口更像“契约”，降低沟通成本。

### 3. 对长期维护的意义

随着项目规模扩大和人员变化，TypeScript 会让重构更可控，也更敢改。

但我也会补一句更成熟的观点：

- TypeScript 很重要，但不是万能
- 类型系统不是越复杂越好
- 真正好的 TypeScript 项目，是“类型准确、可读、适度”

也就是说，TypeScript 的终极目标不是炫技，而是让代码更稳定、更容易协作、更容易维护。
