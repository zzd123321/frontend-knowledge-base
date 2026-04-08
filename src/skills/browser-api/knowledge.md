# 浏览器 API 核心知识点

浏览器 API 指浏览器环境提供给 JavaScript 的原生能力集合，主要包括 DOM、BOM、事件系统、存储、网络、多媒体、性能、图形绘制等。前端工程里很多“框架能力”最终都要落回浏览器 API，因此这部分是前端底层基础。

---

## 1. DOM 基础

DOM 是文档对象模型，浏览器会把 HTML 解析成树形结构，JavaScript 可通过 DOM API 读取和操作节点。

常见操作：

```js
const app = document.getElementById('app')
const items = document.querySelectorAll('.item')
const div = document.createElement('div')
div.textContent = 'hello'
app?.appendChild(div)
```

核心能力：

- 查找节点
- 创建节点
- 插入、删除、替换节点
- 修改属性、类名、样式、文本

---

## 2. 节点与元素

常见节点类型：

- `Document`
- `Element`
- `Text`
- `Comment`

常见属性：

- `parentNode`
- `childNodes`
- `children`
- `firstChild`
- `firstElementChild`
- `nextSibling`
- `nextElementSibling`

区别要点：

- `childNodes` 包含文本节点和注释节点
- `children` 只包含元素节点

---

## 3. 节点查找与遍历

```js
document.getElementById('root')
document.getElementsByClassName('item')
document.getElementsByTagName('li')
document.querySelector('.card')
document.querySelectorAll('.card')
```

实践建议：

- 现代项目优先 `querySelector` / `querySelectorAll`
- 频繁查询同一节点时应缓存引用

---

## 4. 操作属性、内容与样式

### 内容

```js
el.textContent = 'hello'
el.innerHTML = '<strong>hello</strong>'
```

区别：

- `textContent` 更安全，不解析 HTML
- `innerHTML` 会解析 HTML，存在 XSS 风险

### 属性

```js
el.getAttribute('data-id')
el.setAttribute('title', 'tip')
el.removeAttribute('disabled')
```

### 类名

```js
el.classList.add('active')
el.classList.remove('active')
el.classList.toggle('active')
```

### 样式

```js
el.style.color = 'red'
const style = getComputedStyle(el)
```

---

## 5. 事件系统

事件是浏览器交互的核心。

### 事件绑定

```js
button.addEventListener('click', handleClick)
button.removeEventListener('click', handleClick)
```

### 事件对象

常见属性：

- `target`
- `currentTarget`
- `type`
- `preventDefault()`
- `stopPropagation()`

### 事件流

浏览器事件流分为：

- 捕获阶段
- 目标阶段
- 冒泡阶段

```js
parent.addEventListener('click', onParent, true)
child.addEventListener('click', onChild)
```

### 事件委托

把事件绑定到父元素，通过冒泡统一处理子元素事件。

```js
list.addEventListener('click', (event) => {
  const target = event.target
  if (target.matches('li')) {
    console.log(target.dataset.id)
  }
})
```

优点：

- 减少事件监听数量
- 适合动态列表

---

## 6. 常见事件类型

- 鼠标事件：`click`、`dblclick`、`mouseenter`、`mouseleave`
- 键盘事件：`keydown`、`keyup`
- 表单事件：`input`、`change`、`submit`
- 焦点事件：`focus`、`blur`
- 窗口事件：`resize`、`scroll`
- 生命周期事件：`DOMContentLoaded`、`load`

区别：

- `DOMContentLoaded`：DOM 树解析完成
- `load`：页面资源也加载完成

---

## 7. BOM

BOM 是浏览器对象模型，代表浏览器窗口相关能力。

常见对象：

- `window`
- `location`
- `history`
- `navigator`
- `screen`

### `location`

```js
console.log(location.href)
location.assign('/login')
location.reload()
```

### `history`

```js
history.back()
history.forward()
history.pushState({ id: 1 }, '', '/detail/1')
```

### `navigator`

```js
console.log(navigator.userAgent)
console.log(navigator.language)
console.log(navigator.onLine)
```

---

## 8. 定时器与任务调度

```js
const timer = setTimeout(() => {}, 1000)
clearTimeout(timer)

const interval = setInterval(() => {}, 1000)
clearInterval(interval)
```

注意：

- `setInterval` 可能累积任务，不一定精确
- 动画和高频 UI 更新更适合 `requestAnimationFrame`

---

## 9. `requestAnimationFrame`

```js
function loop() {
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
```

特点：

- 和浏览器刷新节奏对齐
- 更适合动画和视觉更新
- 页面隐藏时通常会自动降频

---

## 10. 存储 API

### `localStorage`

- 长期存储
- 同源共享
- 手动删除前一直存在

```js
localStorage.setItem('token', 'abc')
localStorage.getItem('token')
localStorage.removeItem('token')
```

### `sessionStorage`

- 会话级存储
- 标签页关闭后失效

### `cookie`

- 体积较小
- 会随同域请求发送到服务端
- 可设置过期时间、路径、域等

实践建议：

- 不要把敏感信息随意放到可被脚本读取的存储中
- 大量结构化数据优先考虑 IndexedDB

---

## 11. IndexedDB

IndexedDB 是浏览器中的结构化本地数据库，适合大量数据、离线缓存、复杂查询。

适合场景：

- 离线数据
- 大量列表缓存
- 草稿存储
- 文件元数据

---

## 12. `postMessage`

用于跨窗口、iframe、worker 间通信。

```js
iframe.contentWindow.postMessage({ type: 'hello' }, 'https://example.com')

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://example.com') return
  console.log(event.data)
})
```

注意必须校验 `origin`。

---

## 13. Fetch API 与 AbortController

```js
const controller = new AbortController()

fetch('/api/users', {
  signal: controller.signal,
})

controller.abort()
```

作用：

- 发起网络请求
- 可取消请求

---

## 14. WebSocket

WebSocket 提供全双工通信能力。

```js
const socket = new WebSocket('wss://example.com/ws')

socket.onopen = () => socket.send('hello')
socket.onmessage = (event) => console.log(event.data)
```

适合实时通信场景。

---

## 15. 文件与二进制相关 API

常见对象：

- `File`
- `Blob`
- `FileReader`
- `FormData`
- `URL.createObjectURL`

```js
const formData = new FormData()
formData.append('file', file)
```

---

## 16. 拖拽 API

常见事件：

- `dragstart`
- `dragover`
- `drop`

要让 `drop` 生效，通常需要在 `dragover` 中 `preventDefault()`。

---

## 17. 视口与元素尺寸 API

```js
window.innerWidth
el.clientWidth
el.offsetWidth
el.scrollTop
el.getBoundingClientRect()
```

这些 API 常用于：

- 滚动判断
- 吸顶
- 懒加载
- 弹层定位

---

## 18. IntersectionObserver 与 ResizeObserver

### IntersectionObserver

适合图片懒加载、曝光埋点、无限滚动。

### ResizeObserver

适合监听元素尺寸变化，如图表重绘、自适应组件。

---

## 19. Canvas 与 Web Worker

Canvas 适合 2D 绘制、图像处理、可视化。  
Worker 适合把耗时计算放到独立线程，避免阻塞主线程。

注意：

- Worker 不能直接操作 DOM

---

## 20. 浏览器 API 使用最佳实践

- 高频事件做防抖或节流
- 动画优先 `requestAnimationFrame`
- 注意清理事件、定时器、observer
- 不盲目用 `innerHTML`
- 跨窗口通信注意来源校验
