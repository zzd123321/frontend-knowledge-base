# Vue 核心知识点

Vue 是一套用于构建用户界面的渐进式 JavaScript 框架。所谓“渐进式”，指的是它既可以只接管页面中的一小部分交互，也可以配合路由、状态管理、构建工具、组件库形成完整的大型前端应用解决方案。

当前主流开发以 Vue 3 为核心，配合组合式 API、`<script setup>`、Vite、Pinia、Vue Router 构建现代项目。因此学习 Vue 时，建议以 Vue 3 为主线，同时理解 Vue 2 与 Vue 3 在响应式和 API 设计上的关键差异。

---

## 1. Vue 的核心理念

Vue 的核心思想可以概括为三点：

- 声明式渲染
- 组件化开发
- 响应式数据驱动视图

### 声明式渲染

开发者只需要描述“状态和视图的关系”，不需要频繁手动操作 DOM。

```vue
<template>
  <p>{{ count }}</p>
  <button @click="count++">+1</button>
</template>
```

这里我们不需要自己写：

- 查询 DOM
- 更新文本节点
- 手动绑定事件后再手动改 DOM

Vue 会根据数据变化自动完成视图更新。

### 组件化

页面不是一整块模板，而是由一层层组件组成。

组件化的意义在于：

- 复用 UI 与逻辑
- 控制复杂度
- 更适合多人协作
- 易于拆分、测试和维护

### 响应式

Vue 会追踪数据的依赖关系，当数据变化时，只更新依赖该数据的视图和副作用逻辑。

---

## 2. Vue 3 与 Vue 2 的核心差异

学习面试时经常会被问到这一点。

### 响应式实现差异

- Vue 2：基于 `Object.defineProperty`
- Vue 3：基于 `Proxy`

Vue 3 的优势：

- 能更自然地监听对象新增/删除属性
- 能更好地处理数组
- 对 Map、Set 等集合类型支持更好
- 性能和可维护性更优

### API 风格差异

- Vue 2 以 Options API 为主
- Vue 3 同时支持 Options API 与 Composition API

### 工程化能力

Vue 3 更适合：

- 逻辑复用
- TypeScript 集成
- 大型项目组织
- 更灵活的组合式封装

---

## 3. 单文件组件 SFC

Vue 项目最常见的组件形式是单文件组件，即 `.vue` 文件。

```vue
<template>
  <div class="card">{{ title }}</div>
</template>

<script setup lang="ts">
const title = 'Hello Vue'
</script>

<style scoped>
.card {
  color: #333;
}
</style>
```

它通常包含三部分：

- `<template>`：模板结构
- `<script>` 或 `<script setup>`：逻辑
- `<style>`：样式

优点：

- 模板、逻辑、样式内聚
- 组件边界清晰
- 更适合工程化和组件化协作

---

## 4. 模板语法

Vue 模板本质上是“声明式 HTML 扩展”。

### 文本插值

```vue
<p>{{ message }}</p>
```

双大括号会把表达式结果渲染为文本。

### 属性绑定 `v-bind`

```vue
<img v-bind:src="imageUrl" />
<img :src="imageUrl" />
```

缩写形式 `:` 很常用。

### 事件绑定 `v-on`

```vue
<button v-on:click="handleClick">点击</button>
<button @click="handleClick">点击</button>
```

缩写形式 `@` 很常用。

### 表达式能力

模板中可以写简单表达式：

```vue
<p>{{ count + 1 }}</p>
<p>{{ isVip ? 'VIP' : '普通用户' }}</p>
```

但不建议在模板里写过于复杂的逻辑。复杂逻辑应交给：

- `computed`
- 方法
- 组合式函数

---

## 5. 常用指令

Vue 指令是模板层增强语法的核心。

### `v-if`、`v-else-if`、`v-else`

用于条件渲染。

```vue
<template>
  <p v-if="status === 'loading'">加载中...</p>
  <p v-else-if="status === 'error'">加载失败</p>
  <p v-else>加载成功</p>
</template>
```

特点：

- 真正控制节点是否创建和销毁
- 切换成本高，但初始不渲染更节省

### `v-show`

```vue
<p v-show="visible">内容</p>
```

特点：

- 本质是切换 `display`
- 元素始终存在于 DOM 中
- 适合高频切换场景

### `v-for`

```vue
<li v-for="item in list" :key="item.id">
  {{ item.name }}
</li>
```

注意点：

- 必须尽量提供稳定 `key`
- 不建议把数组索引作为动态列表 key

### `v-model`

用于双向绑定表单值。

```vue
<input v-model="keyword" />
```

本质上是：

- 绑定 `value`
- 监听输入事件并更新数据

在 Vue 3 组件中，`v-model` 默认对应：

- prop：`modelValue`
- event：`update:modelValue`

### `v-bind`

用于动态绑定属性、class、style、prop。

```vue
<div :class="{ active: isActive }"></div>
<div :style="{ color: textColor }"></div>
```

### `v-on`

用于绑定事件。

```vue
<button @click="submit">提交</button>
```

支持事件修饰符：

- `.stop`
- `.prevent`
- `.capture`
- `.once`
- `.self`

```vue
<a @click.prevent="goDetail">详情</a>
```

### 其他常见指令

- `v-text`
- `v-html`
- `v-slot`
- `v-pre`
- `v-once`
- `v-memo`

其中 `v-html` 需要注意 XSS 风险，不应直接渲染不可信内容。

---

## 6. 响应式系统

Vue 3 响应式是核心中的核心。

### `ref`

用于定义基础类型或对象响应式值。

```ts
import { ref } from 'vue'

const count = ref(0)
count.value++
```

特点：

- 返回一个带 `.value` 的响应式对象
- 模板中会自动解包

```vue
<template>
  <p>{{ count }}</p>
</template>
```

### `reactive`

用于定义对象响应式数据。

```ts
import { reactive } from 'vue'

const user = reactive({
  name: 'Tom',
  age: 20,
})
```

特点：

- 适合对象、数组、嵌套结构
- 直接访问属性，无需 `.value`

### `ref` 和 `reactive` 的区别

`ref`：

- 更通用
- 基础类型和对象都可以用
- 替换整个值更方便

`reactive`：

- 更适合对象结构
- 不能直接用于原始值
- 解构时容易丢失响应式

实践建议：

- 基础类型优先 `ref`
- 对象状态可用 `reactive`
- 团队中很多项目会统一“优先 `ref`”

### `toRef` 和 `toRefs`

用于从响应式对象中提取属性，同时保持响应式连接。

```ts
import { reactive, toRefs } from 'vue'

const state = reactive({
  count: 0,
  title: 'Vue',
})

const { count, title } = toRefs(state)
```

如果直接结构赋值：

```ts
const { count } = state
```

会丢失响应式。

### `computed`

计算属性基于响应式依赖缓存结果。

```ts
const firstName = ref('Tom')
const lastName = ref('Lee')

const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

特点：

- 依赖不变时会缓存
- 适合派生状态
- 不应做副作用

### `watch`

用于观察数据变化并执行副作用。

```ts
watch(keyword, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
```

常见用途：

- 请求接口
- 同步本地存储
- 监听路由参数变化
- 执行异步副作用

### `watchEffect`

会自动收集回调中使用到的响应式依赖。

```ts
watchEffect(() => {
  console.log(count.value)
})
```

区别：

- `watch`：依赖源明确，可拿到新旧值，可控性更强
- `watchEffect`：写法更省，但依赖收集是隐式的

### 常见响应式误区

#### 1. 解构丢失响应式

```ts
const state = reactive({ count: 0 })
const { count } = state
```

这里的 `count` 不再是响应式。

#### 2. 直接替换 `reactive` 对象

```ts
let state = reactive({ count: 0 })
state = reactive({ count: 1 })
```

这样会破坏原有响应式引用关系。

#### 3. 把副作用写进 `computed`

`computed` 应该只负责返回派生值。

---

## 7. 生命周期

Vue 组件从创建到销毁会经过一系列生命周期阶段。

组合式 API 中常见生命周期钩子有：

- `onBeforeMount`
- `onMounted`
- `onBeforeUpdate`
- `onUpdated`
- `onBeforeUnmount`
- `onUnmounted`
- `onErrorCaptured`
- `onActivated`
- `onDeactivated`

### `onMounted`

组件挂载完成后执行，适合：

- 操作 DOM
- 发起首屏请求
- 初始化第三方库

```ts
onMounted(() => {
  console.log('mounted')
})
```

### `onUnmounted`

组件卸载时清理副作用。

```ts
onUnmounted(() => {
  clearInterval(timer)
})
```

实践中要特别注意清理：

- 定时器
- 事件监听
- WebSocket
- 自定义订阅

### 与 Options API 对应关系

- `mounted` 对应 `onMounted`
- `beforeUnmount` 对应 `onBeforeUnmount`
- `unmounted` 对应 `onUnmounted`

---

## 8. 组件通信

组件通信是 Vue 高频核心问题。

### 父传子：Props

```vue
<Child :title="pageTitle" />
```

子组件：

```vue
<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
```

特点：

- 单向数据流
- 父组件数据变化会传递给子组件
- 子组件不应直接修改 prop

### 子传父：事件

```vue
<Child @submit="handleSubmit" />
```

子组件：

```vue
<script setup lang="ts">
const emit = defineEmits<{
  submit: [id: number]
}>()

function onClick() {
  emit('submit', 1)
}
</script>
```

### `v-model`

常用于输入组件、弹窗组件。

父组件：

```vue
<UserDialog v-model="visible" />
```

子组件：

```vue
<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
```

### 祖孙通信：provide / inject

适合跨层级依赖注入。

```ts
provide('theme', 'dark')

const theme = inject<string>('theme')
```

适用场景：

- 表单上下文
- 主题配置
- 组件库内部上下文共享

### 事件总线

Vue 3 不推荐把事件总线作为主流方案，但小范围轻量通信仍可使用自定义事件库。

### 状态管理

多组件共享状态、跨页面状态、异步业务状态，通常用 Pinia 管理。

---

## 9. 组件基础与设计

### Props

Props 是组件对外契约。

应该注意：

- 类型明确
- 有默认值
- 尽量描述清楚含义
- 避免过多布尔开关 prop 造成 API 混乱

### Emits

显式声明 emits 有助于：

- 明确事件协议
- 提升可维护性
- 在 TS 下获得事件参数提示

### Slots

插槽是组件内容分发机制。

#### 默认插槽

```vue
<BaseCard>
  <p>内容</p>
</BaseCard>
```

#### 具名插槽

```vue
<BaseCard>
  <template #header>标题</template>
  <template #default>内容</template>
</BaseCard>
```

#### 作用域插槽

父组件可以拿到子组件暴露的数据。

```vue
<List :items="list">
  <template #default="{ item, index }">
    <div>{{ index }} - {{ item.name }}</div>
  </template>
</List>
```

作用域插槽本质上可以理解为“子组件向父组件回传渲染上下文”。

### `defineExpose`

在 `<script setup>` 下，可以主动暴露组件实例方法。

```ts
defineExpose({
  open,
  close,
})
```

父组件通过模板 ref 调用。

---

## 10. Composition API 与 Options API

### Options API

按配置项组织：

- `data`
- `computed`
- `methods`
- `watch`
- 生命周期

优点：

- 上手简单
- 小组件可读性较好

缺点：

- 大组件逻辑容易分散
- 逻辑复用依赖 mixin 等机制，不够优雅

### Composition API

按“逻辑关注点”组织代码。

```vue
<script setup lang="ts">
const count = ref(0)

function increment() {
  count.value++
}
</script>
```

优点：

- 更适合复杂逻辑拆分
- 更适合封装组合式函数
- TypeScript 友好
- 逻辑复用更自然

### 两者关系

- Vue 3 同时支持两者
- 新项目通常更推荐 Composition API
- 理解 Options API 仍然有价值，因为历史项目很多

---

## 11. `<script setup>`

`<script setup>` 是 Vue 3 SFC 的编译时语法糖。

### 优势

- 代码更少
- 模板可直接使用顶层变量
- TS 支持更自然
- 更适合组合式 API

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>
```

模板中可直接使用 `count` 和 `increment`。

### 常见宏

- `defineProps`
- `defineEmits`
- `defineExpose`
- `defineOptions`
- `defineModel`
- `withDefaults`

---

## 12. 条件渲染、列表渲染与 `key`

### `v-if` 和 `v-show` 的区别

`v-if`：

- 真正创建/销毁 DOM
- 切换成本高
- 初始条件为假时不渲染

`v-show`：

- 只是切换 `display`
- 初始就会渲染
- 适合频繁切换

### `key` 的作用

`key` 是 Vue Diff 过程中的重要标识。

作用：

- 标识节点身份
- 帮助 Vue 更准确地复用和移动 DOM
- 避免状态错乱

错误示例：

```vue
<li v-for="(item, index) in list" :key="index">
  {{ item.name }}
</li>
```

如果列表存在插入、删除、排序，使用索引可能导致：

- 输入框错位
- 组件内部状态复用错误
- 动画异常

最佳实践：

- 尽量使用业务唯一 id 作为 key

---

## 13. 组件缓存与动态组件

### 动态组件

```vue
<component :is="currentView" />
```

适合：

- tab 切换
- 动态表单
- 可配置视图

### `keep-alive`

用于缓存动态组件实例，避免切换时销毁重建。

```vue
<keep-alive>
  <component :is="currentView" />
</keep-alive>
```

适用场景：

- 页面 tab
- 表单中途切换保留状态
- 高成本组件切换

配套生命周期：

- `onActivated`
- `onDeactivated`

---

## 14. 自定义指令

当需求偏向底层 DOM 行为复用时，可用自定义指令。

```ts
const vFocus = {
  mounted(el: HTMLInputElement) {
    el.focus()
  },
}
```

使用：

```vue
<input v-focus />
```

适用场景：

- 自动聚焦
- 拖拽
- 权限控制
- 元素尺寸监听

原则：

- UI 结构与状态逻辑优先组件/组合式函数
- 仅当确实是 DOM 行为复用时再考虑指令

---

## 15. 路由 Vue Router

Vue Router 是 Vue 官方路由方案。

### 核心概念

- 路由配置
- 动态路由
- 嵌套路由
- 路由守卫
- 懒加载
- 编程式导航

### 基础配置

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/user/:id', component: UserDetail },
  ],
})
```

### 路由跳转

```ts
router.push('/about')
router.push({ name: 'user', params: { id: 1 } })
```

### 获取当前路由

```ts
const route = useRoute()
const router = useRouter()
```

### 路由守卫

```ts
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLogin()) {
    next('/login')
    return
  }
  next()
})
```

常见场景：

- 登录鉴权
- 权限控制
- 页面埋点
- 标题设置

---

## 16. 状态管理 Pinia

Vue 3 主流状态管理方案是 Pinia。

### 为什么不用全局变量

因为复杂应用中状态会遇到：

- 多组件共享
- 组件层级深
- 异步请求状态协调
- 页面切换状态保持

### 基础示例

```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    profile: null as null | { id: number; name: string },
  }),
  getters: {
    isLogin: (state) => Boolean(state.token),
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
  },
})
```

### Pinia 特点

- API 简洁
- TypeScript 支持更好
- 没有 Vuex 那种 mutation 样板代码
- 更符合 Vue 3 组合式风格

---

## 17. 组合式函数 Composables

组合式函数是 Vue 3 逻辑复用的重要方式。

例如封装鼠标位置：

```ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.clientX
    y.value = event.clientY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
```

优点：

- 逻辑复用自然
- 更适合拆分复杂业务逻辑
- 比 mixin 更清晰、来源更明确

设计原则：

- 一个 composable 解决一类问题
- 命名通常以 `use` 开头
- 输入、输出尽量稳定清晰

---

## 18. 异步更新与 `nextTick`

Vue 的 DOM 更新不是每次同步立即完成，而是会进行批量更新和调度。

当数据更新后，如果你想在 DOM 更新完成后再访问最新 DOM，可用 `nextTick`。

```ts
count.value++

await nextTick()
console.log(el.value?.textContent)
```

适用场景：

- 更新数据后立即测量 DOM
- 切换状态后滚动到指定位置
- 等待列表渲染完成后操作元素

---

## 19. Diff、调度与性能优化

Vue 性能优化要建立在原理理解之上。

### 更新原理概念

- 模板会编译成渲染函数
- 响应式数据变化后触发组件更新
- Vue 通过虚拟 DOM 对比新旧节点
- 只对必要部分执行 DOM 更新

### 常见优化手段

#### 1. 正确使用 `key`

避免列表复用错误和额外更新。

#### 2. 避免模板里复杂计算

复杂派生逻辑交给 `computed`。

#### 3. 合理拆组件

把更新频繁和更新不频繁的区域拆开，缩小渲染影响范围。

#### 4. 懒加载路由和组件

减少首屏包体积。

#### 5. 使用 `shallowRef`、`shallowReactive`

当你不希望深层递归响应式时可减少开销。

#### 6. 使用 `v-once`

对纯静态内容只渲染一次。

#### 7. 使用 `v-memo`

在特定场景下减少子树重复更新。

#### 8. 大列表采用虚拟列表

不要一次渲染几千上万条 DOM。

---

## 20. 样式隔离与作用域样式

### `scoped`

```vue
<style scoped>
.title {
  color: red;
}
</style>
```

`scoped` 的本质不是 Shadow DOM，而是通过编译后给元素加特定属性实现样式作用域限制。

优点：

- 减少样式污染
- 组件边界清晰

注意：

- 父组件仍可通过特定方式影响子组件根节点
- 深度选择器需要特殊写法，如 `:deep()`

---

## 21. Teleport、Suspense、异步组件

### Teleport

把组件内容渲染到组件树外部的 DOM 节点中。

```vue
<teleport to="body">
  <div class="modal">弹窗</div>
</teleport>
```

适合：

- 弹窗
- 抽屉
- 全局提示

### 异步组件

```ts
const UserDialog = defineAsyncComponent(() => import('./UserDialog.vue'))
```

适合：

- 大组件按需加载
- 减少首屏体积

### Suspense

用于处理异步依赖等待中的占位渲染。

---

## 22. SSR、CSR、SSG 基本理解

Vue 项目不一定只有纯前端 CSR。

### CSR

客户端渲染，前端拿到 JS 后在浏览器生成页面。

优点：

- 交互流畅
- 前后端分离友好

缺点：

- 首屏与 SEO 不够理想

### SSR

服务端先生成 HTML，再发送给浏览器。

优点：

- 首屏更快
- SEO 更好

缺点：

- 服务端渲染成本更高
- 开发复杂度更高

### SSG

构建阶段预生成静态 HTML。

适合：

- 文档站
- 博客
- 营销官网

在 Vue 生态中常与 Nuxt 或 Vite SSG 等方案结合。

---

## 23. Vue 中常见坑点

### 1. 直接修改 prop

这是反模式，会破坏单向数据流。

正确做法：

- 父组件传值
- 子组件通过事件请求更新
- 或在子组件里基于 prop 创建本地状态

### 2. 列表使用 index 作为 key

会导致节点复用错误。

### 3. watch 使用过度

很多本该用 `computed` 的场景，被错误写成 `watch`。

判断原则：

- 纯派生值用 `computed`
- 需要副作用才用 `watch`

### 4. 忘记清理副作用

例如：

- 定时器
- 事件监听
- 请求取消
- 订阅解绑

### 5. 组合式函数职责过重

一个 composable 管太多事情，会导致维护困难。

---

## 24. Vue 项目开发最佳实践

- 新项目优先 Vue 3 + Composition API + `<script setup>`
- 公共状态用 Pinia，不要滥用事件总线
- 列表渲染使用稳定 key
- 派生状态用 `computed`
- 副作用用 `watch` / `watchEffect`
- 在 `onUnmounted` 中清理资源
- 合理拆分 composables
- 对公共组件的 props 和 emits 做明确类型约束
- 复杂组件 API 设计要避免布尔参数爆炸
- 保持模板简洁，复杂逻辑下沉到脚本层

---

## 25. 一个综合示例

```vue
<template>
  <section>
    <input v-model="keyword" placeholder="搜索用户名" />

    <p v-if="loading">加载中...</p>
    <p v-else-if="error">{{ error }}</p>

    <ul v-else>
      <li v-for="user in filteredUsers" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface User {
  id: number
  name: string
}

const keyword = ref('')
const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')

const filteredUsers = computed(() =>
  users.value.filter((user) => user.name.includes(keyword.value))
)

async function fetchUsers() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/users')
    users.value = await response.json()
  } catch (err) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
}

watch(keyword, (value) => {
  console.log('keyword changed:', value)
})

onMounted(() => {
  fetchUsers()
})
</script>
```

这个示例同时覆盖了：

- 模板指令
- `v-model`
- `v-if` / `v-for`
- `key`
- `ref`
- `computed`
- `watch`
- 生命周期
- TypeScript 类型约束

这也是 Vue 业务开发中最常见的一组能力组合。
