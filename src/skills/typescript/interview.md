# TypeScript 面试题


## Q1. TypeScript 和 JavaScript 的关系是什么？

**答：**

TypeScript 是 JavaScript 的超集，所有合法的 JavaScript 基本都可以作为 TypeScript 使用。TypeScript 在 JavaScript 上增加了静态类型系统、泛型、接口、类型推导等能力，但最终仍然需要编译成 JavaScript 执行。

核心点：

- 运行时执行的是 JavaScript
- TypeScript 主要解决编译阶段的问题
- 类型信息默认不会保留到运行时

---

## Q2. TypeScript 有什么核心价值？

**答：**

主要价值有：

1. 提前发现错误  
   参数错误、属性缺失、空值问题能在开发阶段暴露。

2. 提高可维护性  
   类型让代码契约更清晰。

3. 提升协作效率  
   类型本身就是文档。

4. 提升开发体验  
   自动补全、跳转、重构更可靠。

但它不能替代运行时校验和测试。

---

## Q3. `any`、`unknown`、`never` 的区别是什么？

**答：**

### `any`

放弃类型检查，最宽松。

### `unknown`

可以接收任何值，但使用前必须缩小类型，更安全。

### `never`

表示不可能出现的值，常用于抛异常函数和穷尽检查。

一句话总结：

- `any` 是关闭检查
- `unknown` 是保守接收
- `never` 是不可能存在

---

## Q4. `interface` 和 `type` 有什么区别？

**答：**

相同点：

- 都可以描述对象结构
- 都能配合泛型使用

区别：

- `interface` 支持声明合并
- `type` 更适合联合类型、交叉类型、条件类型
- `interface` 更偏向对象契约
- `type` 更偏向类型表达式

实践上：

- 对象结构、组件 props、类契约常用 `interface`
- 联合、工具类型、映射类型常用 `type`

---

## Q5. 什么是类型推导？什么时候需要显式写类型？

**答：**

类型推导是 TypeScript 根据上下文自动判断类型。

```ts
const count = 1
const name = 'Tom'
```

适合显式写类型的场景：

- 函数参数
- 公共函数返回值
- 导出的复杂对象
- 需要更强约束的场景

---

## Q6. 联合类型和交叉类型有什么区别？

**答：**

联合类型 `|` 表示“可能是其中之一”：

```ts
let id: string | number
```

交叉类型 `&` 表示“同时具备多个类型”：

```ts
type User = { id: number } & { name: string }
```

一句话：

- `|` 是或
- `&` 是且

---

## Q7. 什么是字面量类型？在项目中有什么用？

**答：**

字面量类型是把具体值本身作为类型。

```ts
type Theme = 'light' | 'dark'
```

常见用途：

- 状态值
- 请求方法
- 组件变体
- 权限角色

优点是可选值范围明确，补全和约束都更好。

---

## Q8. 什么是类型断言？它和类型转换一样吗？

**答：**

类型断言是告诉编译器“我认为它是这个类型”。

```ts
const input = document.getElementById('username') as HTMLInputElement
```

它不是运行时类型转换。  
`as` 只影响编译器，不会改变值本身，也不会做运行时校验。

---

## Q9. `as const` 的作用是什么？

**答：**

`as const` 的作用是让 TypeScript 尽可能把值推导成只读字面量类型。

```ts
const config = {
  theme: 'dark',
} as const
```

此时 `theme` 类型是 `'dark'`，不是 `string`。  
它也会让属性变成只读。

常用于常量配置、映射表、状态常量。

---

## Q10. 什么是类型守卫？常见方式有哪些？

**答：**

类型守卫是运行时代码分支里的判断逻辑，它能帮助 TypeScript 缩小类型范围。

常见方式：

- `typeof`
- `instanceof`
- `in`
- 自定义类型守卫

```ts
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value
}
```

---

## Q11. `keyof` 和 `typeof` 在 TypeScript 中分别有什么作用？

**答：**

### `keyof`

获取对象类型的键联合。

```ts
type User = { id: number; name: string }
type UserKey = keyof User
```

### `typeof`

在类型层面获取变量类型。

```ts
const config = { apiBase: '/api' }
type Config = typeof config
```

两者经常组合使用构造更精确的类型。

---

## Q12. 什么是泛型？为什么需要泛型？

**答：**

泛型就是把类型参数化，让代码在复用时仍保留精确类型信息。

```ts
function identity<T>(value: T): T {
  return value
}
```

没有泛型时，很多场景只能退回 `any`，会丢失类型安全。

---

## Q13. 泛型约束 `extends` 有什么作用？

**答：**

泛型约束用来限制类型参数必须满足某些条件。

```ts
function getLength<T extends { length: number }>(value: T) {
  return value.length
}
```

它保证了函数内部可以安全访问 `length`。

---

## Q14. `T`、`K extends keyof T` 这种写法是什么意思？

**答：**

含义是：

- `T` 是某个对象类型
- `K` 必须是 `T` 的键之一

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

这种写法常用于安全地读取对象属性。

---

## Q15. 常见内置工具类型有哪些？

**答：**

最常见的有：

- `Partial<T>`
- `Required<T>`
- `Readonly<T>`
- `Pick<T, K>`
- `Omit<T, K>`
- `Record<K, T>`
- `Exclude<T, U>`
- `Extract<T, U>`
- `NonNullable<T>`

这些工具类型在表单更新、接口建模、状态映射中都很常见。

---

## Q16. 什么是条件类型？什么是 `infer`？

**答：**

条件类型会根据类型关系返回不同结果：

```ts
type IsString<T> = T extends string ? true : false
```

`infer` 用于在条件类型里提取部分类型：

```ts
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

常见于提取函数返回值、Promise 结果、数组元素类型。

---

## Q17. `enum`、联合字面量、`as const` 常量对象该怎么选？

**答：**

实践上通常这样选：

- 纯类型约束：优先联合字面量
- 既要运行时对象又要类型：优先 `as const` 常量对象
- 明确需要枚举对象语义时：再考虑 `enum`

前端业务项目里，联合字面量和 `as const` 更常见，也更轻量。

---

## Q18. 什么是声明文件 `.d.ts`？什么时候需要写？

**答：**

`.d.ts` 是类型声明文件，常用于：

- 给没有类型的第三方库补声明
- 声明全局变量
- 扩展 `window`
- 声明环境变量
- 给旧 JS 模块补类型

---

## Q19. `strictNullChecks` 有什么作用？

**答：**

开启后，`null` 和 `undefined` 不能随意赋给其他类型，开发者必须显式处理可空情况。

它能显著减少空值错误，是严格模式里非常重要的一项。

---

## Q20. `tsconfig.json` 里常见的重要配置有哪些？

**答：**

常见重要配置：

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

新项目一般建议开启 `strict`。

---

## Q21. 为什么不建议滥用 `any` 和 `as`？

**答：**

因为它们会绕过类型系统。

- `any` 会让类型污染扩散
- `as` 容易把问题推迟到运行时

更好的做法是：

- 用 `unknown`
- 用类型守卫
- 重构类型设计
- 对外部输入做运行时校验

---

## Q22. TypeScript 能保证运行时安全吗？

**答：**

不能。  
TypeScript 主要在编译阶段工作，类型通常不会保留到运行时。

因此外部输入、接口数据、用户输入仍然需要运行时校验。

---

## Q23. 项目从 JavaScript 迁移到 TypeScript 的思路是什么？

**答：**

通常分阶段进行：

1. 先接入 TS 编译链路
2. 允许 JS 和 TS 共存
3. 新代码优先写 TS
4. 从公共模块和接口层开始迁移
5. 逐步减少 `any`
6. 最后收紧严格配置

这样风险更可控。

---

## Q24. 在 React/Vue 项目里 TypeScript 通常怎么用？

**答：**

### React

- 组件 props
- 事件类型
- hooks
- `useRef` / `useState`

### Vue

- `defineProps`
- `defineEmits`
- `ref`
- `computed`
- 组合式函数

本质上都是用类型去描述组件契约、状态结构和接口数据。

---

## Q25. 你如何评价 TypeScript 在大型项目中的意义？

**答：**

我会认为它在大型项目中的意义主要体现在：

- 提升代码质量
- 降低协作成本
- 降低重构风险
- 提升长期维护性

但成熟的观点应该是：

- TypeScript 很重要，但不是万能
- 类型系统要准确、可读、适度
- 不应为了“炫技”写过度复杂的类型体操
