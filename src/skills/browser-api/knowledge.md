# 浏览器 API 核心知识点

浏览器 API 指浏览器运行环境提供给 JavaScript 的原生能力。前端框架再强，最终也都要落回这些基础能力上：

- 读写 DOM
- 处理事件
- 发起请求
- 存储数据
- 操作历史记录
- 调度动画
- 采集性能
- 使用 Worker、Canvas、Observer 等能力

理解浏览器 API 的意义，不是为了背接口，而是为了真正理解“浏览器环境到底给了前端什么”和“框架能力底层到底依赖什么”。

---

## 1. DOM 是什么

DOM 是 Document Object Model，文档对象模型。

浏览器会把 HTML 解析成一棵树，JavaScript 可以通过 DOM API：

- 查找节点
- 创建节点
- 修改节点
- 删除节点
- 监听事件

简单示例：

```js
const app = document.getElementById('app')
const div = document.createElement('div')
div.textContent = 'hello'
app?.appendChild(div)
```

这部分能力是前端交互最基础的根。

---

## 2. 节点、元素、文档对象

DOM 里并不只有元素。

常见节点类型：

- `Document`
- `Element`
- `Text`
- `Comment`
- `DocumentFragment`

前端最常接触的是 `Element`，但理解“文本节点也是真实节点”很重要，因为这会影响：

- 遍历结果
- 子节点数量
- 插入和删除逻辑

---

## 3. `childNodes` 和 `children` 的区别

这是很常见的基础点。

- `childNodes`：包含所有子节点
- `children`：只包含元素节点

例如 HTML 中的换行和空格，也可能形成文本节点。

因此：

- 你以为“第一个子元素”时，别直接用 `firstChild`
- 更常用的是 `firstElementChild`

---

## 4. DOM 查询方式

常见查询 API：

```js
document.getElementById('root')
document.getElementsByClassName('item')
document.getElementsByTagName('li')
document.querySelector('.card')
document.querySelectorAll('.card')
```

现代项目里更常用：

- `querySelector`
- `querySelectorAll`

原因是：

- 选择器表达力更强
- 写法统一

---

## 5. 实时集合与静态集合

有些 DOM 查询结果是实时更新的，有些不是。

例如：

- `getElementsByClassName` 返回的集合通常是动态的
- `querySelectorAll` 返回的 `NodeList` 通常是静态的

这在复杂 DOM 操作里很关键，因为：

- 边遍历边修改 DOM 时，动态集合可能导致结果变化

---

## 6. 创建、插入、删除节点

常见操作：

```js
const li = document.createElement('li')
list.appendChild(li)
list.removeChild(li)
parent.insertBefore(li, firstChild)
```

现代 DOM 还常见：

```js
el.append(child)
el.prepend(child)
el.before(node)
el.after(node)
el.remove()
```

这些 API 让 DOM 操作更直观。

---

## 7. `DocumentFragment`

`DocumentFragment` 是一个轻量的文档片段容器。

适合场景：

- 批量插入 DOM
- 先在内存中组织结构，再一次性挂载

它的价值在于：

- 让一批 DOM 操作更容易组织
- 减少中间态插入带来的额外影响

---

## 8. 操作文本与 HTML

### `textContent`

```js
el.textContent = 'hello'
```

特点：

- 纯文本
- 不解析 HTML
- 更安全

### `innerHTML`

```js
el.innerHTML = '<strong>hello</strong>'
```

特点：

- 会解析 HTML
- 灵活但有 XSS 风险

经验原则：

- 能用 `textContent` 就尽量不用 `innerHTML`

---

## 9. 属性、Property 与 `dataset`

常见操作：

```js
el.getAttribute('title')
el.setAttribute('title', 'tip')
el.removeAttribute('disabled')
```

前端里还经常接触：

- HTML Attribute
- DOM Property

二者有联系但不完全等价。

例如：

- `input.value` 是 property
- `value` 也可能有初始 attribute

### `dataset`

操作自定义数据属性很常用：

```js
el.dataset.id = '123'
console.log(el.dataset.id)
```

---

## 10. class 与 style 操作

### `classList`

```js
el.classList.add('active')
el.classList.remove('active')
el.classList.toggle('active')
```

### 行内样式

```js
el.style.color = 'red'
```

### 获取计算后样式

```js
const style = getComputedStyle(el)
```

注意：

- `style` 只能读写行内样式
- `getComputedStyle` 才是最终计算结果

---

## 11. 尺寸与位置信息

常见 API：

```js
el.clientWidth
el.offsetWidth
el.scrollWidth
el.getBoundingClientRect()
window.innerWidth
```

这些 API 常用于：

- 弹层定位
- 懒加载
- 吸顶
- 无限滚动
- 可视区判断

它们的差别主要在于：

- 是否包含边框
- 是否包含滚动区域
- 是否相对视口

---

## 12. 强制同步布局要谨慎

读取布局信息的 API，比如：

- `offsetWidth`
- `clientHeight`
- `getBoundingClientRect()`

如果和样式写操作交错使用，可能触发强制同步布局。

这会导致：

- 布局抖动
- 性能变差

因此高频场景里要尽量：

- 批量读
- 批量写

---

## 13. 事件系统基础

事件系统是浏览器交互的核心。

常见绑定方式：

```js
button.addEventListener('click', handleClick)
button.removeEventListener('click', handleClick)
```

浏览器里几乎所有交互都基于事件传播：

- 点击
- 输入
- 提交
- 滚动
- 键盘
- 拖拽

---

## 14. 事件对象

事件对象里常见属性和方法：

- `target`
- `currentTarget`
- `type`
- `preventDefault()`
- `stopPropagation()`

理解两个最关键的属性：

- `target`：真正触发事件的元素
- `currentTarget`：当前正在执行监听器的元素

这对事件委托尤其重要。

---

## 15. 事件流：捕获、目标、冒泡

浏览器事件传播分为三个阶段：

1. 捕获阶段
2. 目标阶段
3. 冒泡阶段

例如：

```js
parent.addEventListener('click', onParent, true)
child.addEventListener('click', onChild)
```

大多数日常开发默认用的是冒泡阶段监听。

理解事件流很重要，因为它直接影响：

- 事件执行顺序
- 事件委托
- 阻止传播

---

## 16. `preventDefault` 与 `stopPropagation`

它们作用完全不同。

### `preventDefault`

阻止默认行为。

例如：

- 阻止表单默认提交
- 阻止链接默认跳转

### `stopPropagation`

阻止事件继续传播。

注意：

- 阻止默认行为不等于阻止冒泡
- 阻止冒泡也不等于阻止当前元素其他监听器执行

---

## 17. 事件委托

事件委托是把事件绑在父元素上，通过冒泡统一处理子元素交互。

示例：

```js
list.addEventListener('click', (event) => {
  const target = event.target
  if (target.matches('li')) {
    console.log(target.dataset.id)
  }
})
```

优点：

- 减少监听器数量
- 适合动态列表
- 管理更集中

这是浏览器事件系统里非常实用的模式。

---

## 18. 常见事件类型

### 鼠标相关

- `click`
- `dblclick`
- `mousedown`
- `mouseup`
- `mouseenter`
- `mouseleave`
- `mousemove`

### 键盘相关

- `keydown`
- `keyup`

### 表单相关

- `input`
- `change`
- `submit`
- `focus`
- `blur`

### 窗口和文档相关

- `scroll`
- `resize`
- `DOMContentLoaded`
- `load`

---

## 19. `DOMContentLoaded` 与 `load`

这两个事件经常混淆。

### `DOMContentLoaded`

- DOM 树解析完成
- 不要求图片、样式等全部资源加载完

### `load`

- 页面资源基本加载完成后触发

如果只是希望 DOM 可操作，通常更关心：

- `DOMContentLoaded`

---

## 20. BOM 是什么

BOM 是 Browser Object Model，浏览器对象模型。

它更关注浏览器窗口级能力，而不是文档树本身。

常见对象：

- `window`
- `location`
- `history`
- `navigator`
- `screen`

它们让前端可以和“浏览器这个运行环境”本身交互。

---

## 21. `window`

`window` 是浏览器中的全局对象。

很多 API 都挂在它上面，例如：

- 定时器
- 对话框
- 尺寸信息
- 全局事件

例如：

```js
window.addEventListener('resize', onResize)
console.log(window.innerWidth)
```

---

## 22. `location`

`location` 用于表示和操作当前地址。

常见用法：

```js
console.log(location.href)
location.assign('/login')
location.reload()
```

可用来获取：

- 完整 URL
- host
- pathname
- search
- hash

它是前端路由、参数解析和页面跳转基础之一。

---

## 23. `history`

History API 让前端可以控制浏览历史栈。

常见用法：

```js
history.back()
history.forward()
history.pushState({ id: 1 }, '', '/detail/1')
history.replaceState({}, '', '/login')
```

单页应用路由的底层能力之一就是它。

要注意：

- `pushState` 不会自动触发页面刷新

---

## 24. `navigator`

`navigator` 表示当前浏览器和设备环境信息。

常见字段：

- `userAgent`
- `language`
- `onLine`
- `clipboard`
- `geolocation`

但要注意：

- 不要过度依赖 UA 字符串做复杂逻辑判断

更推荐：

- 用能力检测代替环境猜测

---

## 25. 定时器

常见定时器 API：

```js
const timer = setTimeout(() => {}, 1000)
clearTimeout(timer)

const interval = setInterval(() => {}, 1000)
clearInterval(interval)
```

注意点：

- `setTimeout` 和 `setInterval` 都不是精确定时器
- 主线程忙时会延后执行
- 组件卸载时要及时清理

---

## 26. `requestAnimationFrame`

`requestAnimationFrame` 适合动画和高频视觉更新。

```js
function loop() {
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
```

特点：

- 和浏览器刷新节奏对齐
- 更适合 UI 更新
- 页面隐藏时通常自动降频

如果是动画场景，优先级通常高于 `setTimeout`。

---

## 27. `requestIdleCallback`

它适合执行不那么紧急的任务。

例如：

- 低优先级预处理
- 非关键统计
- 后台空闲计算

但要注意：

- 浏览器支持情况不如核心 API 稳
- 不适合关键交互逻辑

---

## 28. Web Storage

### `localStorage`

特点：

- 同源共享
- 持久化保存
- 关闭浏览器后仍可存在

```js
localStorage.setItem('token', 'abc')
localStorage.getItem('token')
```

### `sessionStorage`

特点：

- 会话级
- 标签页关闭后失效

它们都很简单，但只适合小型字符串数据。

---

## 29. `cookie`

Cookie 的重要特点是：

- 可以由浏览器按规则自动随请求发送给服务端

常见属性：

- `Expires`
- `Max-Age`
- `Domain`
- `Path`
- `Secure`
- `HttpOnly`
- `SameSite`

前端必须建立的认知：

- Cookie 不只是前端存储，它和服务端会话、安全策略密切相关

---

## 30. 存储安全意识

存储相关要注意：

- 不要把敏感信息随意暴露在可读存储中
- `localStorage`、`sessionStorage` 可被 JS 读取
- Cookie 若不加 `HttpOnly` 也可能被脚本读取

因此：

- “存哪”不是只有便利性问题，还有安全问题

---

## 31. IndexedDB

IndexedDB 是浏览器中的结构化本地数据库。

适合场景：

- 离线缓存
- 大量列表数据
- 草稿保存
- 文件元数据管理

它比 `localStorage` 更适合：

- 大体积数据
- 结构化数据
- 更复杂查询

代价是：

- API 更复杂

---

## 32. `storage` 事件

当同源页面间共享 `localStorage` 变化时，可以监听：

- `storage`

这常用于：

- 多标签页同步登录状态
- 多标签页同步主题或设置

但要注意：

- 当前页面自己修改 storage，通常不会收到自己触发的 `storage` 事件

---

## 33. Fetch API

现代前端发请求最常见的原生能力是 `fetch`。

示例：

```js
const response = await fetch('/api/users')
const data = await response.json()
```

几个重要点：

- `fetch` 默认只在网络错误时 `reject`
- `404`、`500` 仍然需要手动判断 `response.ok`
- 支持 Promise 风格
- 和浏览器流、缓存、CORS 等机制更贴近

---

## 34. `AbortController`

它用于取消请求或其他可取消异步操作。

```js
const controller = new AbortController()

fetch('/api/users', {
  signal: controller.signal,
})

controller.abort()
```

适合场景：

- 页面切换取消旧请求
- 搜索联想取消过期请求
- 避免重复请求回写旧结果

---

## 35. WebSocket

WebSocket 提供长连接和全双工通信能力。

```js
const socket = new WebSocket('wss://example.com/ws')

socket.onopen = () => socket.send('hello')
socket.onmessage = (event) => console.log(event.data)
```

适合场景：

- 聊天
- 实时协作
- 行情推送
- 实时通知

它和普通 HTTP 请求的核心差异在于：

- 连接建立后可双向持续通信

---

## 36. `postMessage`

`postMessage` 用于跨窗口、iframe、worker 之间通信。

示例：

```js
iframe.contentWindow.postMessage({ type: 'hello' }, 'https://example.com')

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://example.com') return
  console.log(event.data)
})
```

关键安全点：

- 必须校验 `origin`

它很适合：

- iframe 通信
- 微前端通信
- 跨窗口协作

---

## 37. 文件与二进制相关 API

常见对象：

- `File`
- `Blob`
- `FileReader`
- `FormData`
- `URL.createObjectURL`

### `File`

通常来自：

- 文件选择器
- 拖拽上传

### `Blob`

表示二进制大对象，常用于：

- 下载
- 图片处理
- 文件片段

---

## 38. `FileReader` 与 `FormData`

### `FileReader`

用于读取文件内容。

### `FormData`

适合构造文件上传请求。

```js
const formData = new FormData()
formData.append('file', file)
formData.append('name', 'avatar')
```

它可以配合 `fetch` 或 XHR 使用。

---

## 39. `URL.createObjectURL`

它可以为本地文件或 Blob 创建临时 URL。

适合：

- 图片预览
- 视频预览
- 下载链接生成

例如：

```js
const url = URL.createObjectURL(file)
img.src = url
```

用完后最好：

- `URL.revokeObjectURL(url)`

避免长期占用内存。

---

## 40. 拖拽 API

拖拽相关常见事件：

- `dragstart`
- `dragenter`
- `dragover`
- `dragleave`
- `drop`

一个关键细节是：

- 要让 `drop` 生效，通常需要在 `dragover` 中 `preventDefault()`

拖拽很适合：

- 文件上传
- 列表排序
- 画布编辑器

---

## 41. Clipboard API

剪贴板 API 让前端可以读写剪贴板。

例如：

```js
await navigator.clipboard.writeText('hello')
const text = await navigator.clipboard.readText()
```

它常见于：

- 一键复制
- 富文本编辑器
- 分享链接

但要注意：

- 常需要用户手势或权限约束

---

## 42. IntersectionObserver

它用于观察元素是否进入视口。

适合场景：

- 图片懒加载
- 曝光埋点
- 无限滚动
- 吸顶状态切换

它比频繁监听 `scroll` 更优雅，因为：

- 浏览器帮你做了可见性判断调度

---

## 43. ResizeObserver

它用于监听元素尺寸变化。

适合：

- 图表自适应重绘
- 容器尺寸驱动布局
- 自适应组件

这和监听窗口 `resize` 不同，因为：

- 元素尺寸变化不一定来自窗口变化

---

## 44. MutationObserver

它用于观察 DOM 结构变化。

适合：

- 监控第三方插入内容
- 实现某些轻量 DOM 响应逻辑
- 调试复杂节点变更

但要注意：

- 观察范围过大可能带来性能负担

---

## 45. Canvas

Canvas 适合：

- 2D 绘图
- 图像处理
- 粒子动画
- 图表和可视化

它的特点是：

- 更偏像素级绘制
- 不像 DOM 那样每个元素天然可单独交互

复杂可视化场景里它非常重要。

---

## 46. Web Worker

Worker 让你可以把耗时任务放到独立线程处理。

适合：

- 大计算
- 大文本解析
- 编码解码
- 文件处理

注意：

- Worker 不能直接操作 DOM
- 和主线程通过消息通信

它的核心价值是：

- 避免主线程被重计算阻塞

---

## 47. 性能相关 API

浏览器也提供了性能测量能力。

例如：

- `performance.now()`
- `performance.mark()`
- `performance.measure()`
- Navigation Timing
- Resource Timing

这些 API 让前端可以：

- 测量函数耗时
- 统计页面性能
- 上报真实用户数据

---

## 48. History API 与单页应用

单页应用路由底层很依赖：

- `pushState`
- `replaceState`
- `popstate`

核心思想是：

- 改变地址
- 不刷新页面
- 自己决定该渲染哪个视图

理解这部分后，会更容易看懂前端路由库底层做了什么。

---

## 49. 浏览器能力检测

前端判断功能可用性时，更推荐能力检测，而不是环境猜测。

例如：

```js
if ('IntersectionObserver' in window) {
  // use it
}
```

比起纯粹依赖 UA 判断：

- 更稳
- 更面向真实能力

---

## 50. 浏览器 API 使用最佳实践

- 高频事件做防抖或节流
- 动画优先 `requestAnimationFrame`
- 注意清理事件、定时器、observer、worker
- 不盲目使用 `innerHTML`
- 跨窗口通信要校验来源
- 大数据和离线缓存优先考虑 IndexedDB
- 耗时计算尽量别堵主线程

---

## 51. 常见误区

- 以为浏览器 API 只是 DOM 操作
- 把 `innerHTML` 当万能方案
- 忘记清理监听器和定时器
- 只会用 `scroll` 轮询，不会用 Observer
- 把 `localStorage` 当万能数据库
- 误以为 jsdom、浏览器、Node 环境能力完全一致

这些误区会让前端代码在复杂场景里变脆弱。

---

## 52. 浏览器 API 最值得掌握的主线

如果只抓一条主线，就抓这条：

1. 浏览器如何把页面表示成 DOM
2. 事件系统如何把用户行为传给脚本
3. 浏览器如何提供存储、网络、历史、调度等运行时能力
4. 如何用 Observer、Worker、Canvas 等 API 处理复杂场景
5. 如何在真实项目里安全、稳定、高效地使用这些能力

把这条主线打通之后，浏览器 API 就不再是一堆零散接口，而会变成你理解前端运行时的底层地图。
