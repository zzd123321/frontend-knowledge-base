# HTML 面试题

## 目录

- [Q1. DOCTYPE 的作用是什么？](#q1-doctype-的作用是什么)
- [Q2. 什么是语义化 HTML？有什么好处？](#q2-什么是语义化-html有什么好处)
- [Q3. src 和 href 的区别？](#q3-src-和-href-的区别)
- [Q4. script 标签的 defer 和 async 有什么区别？](#q4-script-标签的-defer-和-async-有什么区别)
- [Q5. 行内元素和块级元素的区别？](#q5-行内元素和块级元素的区别)
- [Q6. cookie、localStorage、sessionStorage 的区别？](#q6-cookielocalstoragesessionstorage-的区别)
- [Q7. 什么是重绘（Repaint）和回流（Reflow）？如何优化？](#q7-什么是重绘repaint和回流reflow如何优化)
- [Q8. iframe 有哪些优缺点？](#q8-iframe-有哪些优缺点)
- [Q9. 如何理解 HTML 的 data-* 自定义属性？](#q9-如何理解-html-的-data--自定义属性)
- [Q10. head 标签中可以放哪些内容？](#q10-head-标签中可以放哪些内容)
- [Q11. 什么是 HTML 实体（HTML Entities）？](#q11-什么是-html-实体html-entities)
- [Q12. 如何优化页面的首屏加载性能（HTML 层面）？](#q12-如何优化页面的首屏加载性能html-层面)
- [Q13. alt 属性的作用是什么？什么时候可以为空？](#q13-alt-属性的作用是什么什么时候可以为空)
- [Q14. 表单的 GET 和 POST 提交方式有什么区别？](#q14-表单的-get-和-post-提交方式有什么区别)
- [Q15. 什么是渐进增强和优雅降级？](#q15-什么是渐进增强和优雅降级)
- [Q16. 如何实现页面的 SEO 优化？](#q16-如何实现页面的-seo-优化)
- [Q17. 什么是 Web Components？包含哪些技术？](#q17-什么是-web-components包含哪些技术)
- [Q18. preload、prefetch、dns-prefetch 的区别？](#q18-preloadprefetchdns-prefetch-的区别)
- [Q19. 如何防止 XSS 攻击？](#q19-如何防止-xss-攻击)
- [Q20. 什么是 CORS？如何解决跨域问题？](#q20-什么是-cors如何解决跨域问题)
- [Q21. 如何实现图片懒加载？](#q21-如何实现图片懒加载)
- [Q22. 什么是 BFC（块级格式化上下文）？](#q22-什么是-bfc块级格式化上下文)
- [Q23. 如何优化首屏加载速度？](#q23-如何优化首屏加载速度)
- [Q24. HTML5 的 drag and drop API 如何使用？](#q24-html5-的-drag-and-drop-api-如何使用)
- [Q25. 如何实现页面打印样式优化？](#q25-如何实现页面打印样式优化)

---

## Q1. DOCTYPE 的作用是什么？

**答：**

`<!DOCTYPE html>` 是文档类型声明，位于 HTML 文档的第一行，作用是告知浏览器使用哪种 HTML 规范来解析文档。

- **标准模式（Standards Mode）**：浏览器按照 W3C 规范渲染页面
- **怪异模式（Quirks Mode）**：浏览器模拟旧版 IE 的行为，盒模型等表现不一致

HTML5 的 DOCTYPE 写法最简洁：`<!DOCTYPE html>`，不区分大小写。

---

## Q2. 什么是语义化 HTML？有什么好处？

**答：**

语义化是指选用能准确描述内容含义的 HTML 标签，而不是一律用 `<div>` 和 `<span>`。

**好处：**
1. **SEO**：搜索引擎爬虫能更准确理解页面结构和内容权重
2. **可访问性**：屏幕阅读器依赖语义标签为视障用户提供导航
3. **可维护性**：代码结构清晰，团队协作更高效
4. **浏览器默认样式**：语义标签自带合理的默认样式

**示例对比：**
```html
<!-- 非语义化 -->
<div class="header"><div class="nav">...</div></div>

<!-- 语义化 -->
<header><nav>...</nav></header>
```

---

## Q3. src 和 href 的区别？

**答：**

| 属性 | 用途 | 行为 |
|------|------|------|
| `src` | 嵌入外部资源（img、script、iframe） | 浏览器**暂停解析**，下载并嵌入资源 |
| `href` | 建立当前文档与外部资源的关联（a、link） | **不暂停解析**，并行加载 |

```html
<script src="app.js"></script>   <!-- 阻塞解析 -->
<link href="style.css" rel="stylesheet" />  <!-- 不阻塞 HTML 解析 -->
```

---

## Q4. script 标签的 defer 和 async 有什么区别？

**答：**

```
HTML 解析:  ████████████████████████████████
普通 script:         ██下载██执行██ → 继续解析
defer:               ██下载██       → 解析完成后执行（按顺序）
async:               ██下载██执行██ → 下载完立即执行（顺序不保证）
```

| | 是否阻塞解析 | 执行时机 | 执行顺序 |
|---|---|---|---|
| 普通 | 是 | 立即 | 顺序 |
| `defer` | 否 | DOMContentLoaded 前 | 顺序 |
| `async` | 否 | 下载完立即 | 不保证 |

**使用建议：**
- `defer`：适合依赖 DOM 或有执行顺序要求的脚本
- `async`：适合独立脚本，如统计、广告

---

## Q5. 行内元素和块级元素的区别？

**答：**

**块级元素：**
- 独占一行，宽度默认 100%
- 可设置 width、height、margin、padding
- 常见：`div` `p` `h1-h6` `ul` `ol` `li` `table` `form`

**行内元素：**
- 与其他行内元素共占一行
- width、height 设置无效；垂直 margin 无效
- 常见：`span` `a` `strong` `em` `img` `input` `label`

**特殊情况：**
- `img`、`input` 是行内替换元素（replaced element），可设置宽高
- `display: inline-block` 兼具两者特性

---

## Q6. cookie、localStorage、sessionStorage 的区别？

**答：**

| | cookie | localStorage | sessionStorage |
|---|---|---|---|
| 存储大小 | ~4KB | ~5MB | ~5MB |
| 过期时间 | 可设置 | 永久 | 标签页关闭即清除 |
| 随请求发送 | 是（自动携带） | 否 | 否 |
| 作用域 | 可跨子域 | 同源 | 同源且同标签页 |
| 操作方式 | `document.cookie` | `localStorage.setItem` | `sessionStorage.setItem` |

**使用场景：**
- `cookie`：身份认证 token（需设置 HttpOnly 防 XSS）
- `localStorage`：用户偏好设置、主题
- `sessionStorage`：表单草稿、单次会话数据

---

## Q7. 什么是重绘（Repaint）和回流（Reflow）？如何优化？

**答：**

**回流（Reflow / Layout）：** 元素的几何属性（位置、尺寸）发生变化，浏览器需要重新计算布局。代价高。

**重绘（Repaint）：** 元素外观变化（颜色、背景），但不影响布局。代价低于回流。

**触发回流的操作：**
- 修改 width、height、margin、padding、border
- 添加/删除 DOM 节点
- 读取 `offsetWidth`、`scrollTop` 等布局属性（强制同步布局）

**优化方法：**
1. 批量修改样式，用 `className` 替代逐条修改
2. 使用 `documentFragment` 批量操作 DOM
3. 对频繁变化的元素使用 `position: absolute/fixed` 脱离文档流
4. 使用 `transform` 和 `opacity` 触发 GPU 合成层，避免回流
5. 避免在循环中读取布局属性

---

## Q8. iframe 有哪些优缺点？

**答：**

**优点：**
- 隔离第三方内容（广告、地图、支付页面）
- 可加载独立的 HTML 文档
- 天然的沙箱环境（配合 `sandbox` 属性）

**缺点：**
- 阻塞父页面的 `onload` 事件
- 不利于 SEO（搜索引擎难以索引 iframe 内容）
- 增加 HTTP 请求
- 跨域通信复杂（需用 `postMessage`）

**跨域通信：**
```js
// 父页面向 iframe 发消息
iframe.contentWindow.postMessage('hello', 'https://child.com')

// iframe 接收消息
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://parent.com') return
  console.log(e.data)
})
```

---

## Q9. 如何理解 HTML 的 data-* 自定义属性？

**答：**

`data-*` 属性允许在 HTML 元素上存储自定义数据，供 JavaScript 读取，避免滥用 `class` 或非标准属性。

```html
<button data-user-id="42" data-action="delete">删除</button>
```

```js
const btn = document.querySelector('button')
console.log(btn.dataset.userId)   // "42"
console.log(btn.dataset.action)   // "delete"
```

**注意：** `data-user-id` 在 JS 中通过 `dataset.userId`（驼峰命名）访问。

---

## Q10. head 标签中可以放哪些内容？

**答：**

`<head>` 中的内容不会直接显示在页面上，主要用于配置文档元信息：

- `<title>` — 页面标题（浏览器标签页显示）
- `<meta>` — 字符集、视口、描述、关键词、Open Graph 等
- `<link>` — 引入 CSS、图标（favicon）、预加载资源
- `<style>` — 内联 CSS
- `<script>` — JavaScript（通常放 body 末尾，或加 defer）
- `<base>` — 设置页面所有相对 URL 的基准路径

---

## Q11. 什么是 HTML 实体（HTML Entities）？

**答：**

HTML 实体用于在 HTML 中显示特殊字符，避免与标签语法冲突。

| 字符 | 实体名称 | 实体编号 |
|------|----------|----------|
| `<` | `&lt;` | `&#60;` |
| `>` | `&gt;` | `&#62;` |
| `&` | `&amp;` | `&#38;` |
| `"` | `&quot;` | `&#34;` |
| 空格 | `&nbsp;` | `&#160;` |
| `©` | `&copy;` | `&#169;` |

---

## Q12. 如何优化页面的首屏加载性能（HTML 层面）？

**答：**

1. **减少 HTML 体积**：删除注释、空白，使用 gzip/brotli 压缩
2. **CSS 放 `<head>`**：避免 FOUC（无样式内容闪烁）
3. **JS 使用 `defer`**：不阻塞 HTML 解析
4. **图片懒加载**：`<img loading="lazy" />`
5. **预加载关键资源**：`<link rel="preload" href="font.woff2" as="font" />`
6. **预连接**：`<link rel="preconnect" href="https://fonts.googleapis.com" />`
7. **减少 DOM 节点数量**：过深的 DOM 树增加渲染时间

---

## Q13. alt 属性的作用是什么？什么时候可以为空？

**答：**

`alt` 属性为图片提供替代文本，在以下场景发挥作用：
- 图片加载失败时显示替代文字
- 屏幕阅读器朗读给视障用户
- 搜索引擎理解图片内容

**何时可以为空（`alt=""`）：**
当图片是纯装饰性的，不传递任何信息时，应设置 `alt=""`（而不是省略），这样屏幕阅读器会跳过该图片。

```html
<!-- 内容图片：必须有描述性 alt -->
<img src="team.jpg" alt="公司团队合影" />

<!-- 装饰图片：alt 为空 -->
<img src="divider.png" alt="" />
```

---

## Q14. 表单的 GET 和 POST 提交方式有什么区别？

**答：**

| | GET | POST |
|---|---|---|
| 数据位置 | URL 查询字符串 | 请求体 |
| 数据长度 | 受 URL 长度限制（约 2KB） | 无限制 |
| 安全性 | 数据暴露在 URL 中 | 相对安全 |
| 缓存 | 可被缓存、收藏 | 不缓存 |
| 幂等性 | 是（多次请求结果相同） | 否 |
| 适用场景 | 搜索、过滤、分页 | 登录、提交表单、上传文件 |

---

## Q15. 什么是渐进增强和优雅降级？

**答：**

**渐进增强（Progressive Enhancement）：**
从最基础的功能开始构建，确保所有用户都能使用核心功能，再为支持新特性的浏览器添加增强体验。

**优雅降级（Graceful Degradation）：**
先为现代浏览器构建完整功能，再为旧浏览器提供可用的降级方案。

```html
<!-- 渐进增强示例：先用 input，再增强为 date picker -->
<input type="date" name="birthday" />
<!-- 不支持 date 类型的浏览器会降级为普通文本输入 -->
```

**现代前端推荐渐进增强**，配合特性检测（`@supports`、`Modernizr`）实现。

---

## Q16. 如何实现页面的 SEO 优化？

**答：**

**HTML 层面的 SEO 优化：**

1. **语义化标签**：使用 `<header>` `<nav>` `<main>` `<article>` 等
2. **标题层级**：合理使用 `<h1>` 到 `<h6>`，每页只有一个 `<h1>`
3. **meta 标签**：
   ```html
   <title>页面标题（50-60字符）</title>
   <meta name="description" content="页面描述（150-160字符）" />
   <meta name="keywords" content="关键词1, 关键词2" />
   ```
4. **图片优化**：所有图片必须有描述性 `alt` 属性
5. **链接优化**：使用语义化的锚文本，避免"点击这里"
6. **结构化数据**：使用 JSON-LD 格式的 Schema.org 标记
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "文章标题",
     "author": "作者名"
   }
   </script>
   ```
7. **URL 结构**：使用语义化 URL，避免动态参数过多
8. **页面加载速度**：使用 `defer`/`async`，压缩资源，懒加载图片
9. **移动端适配**：`<meta name="viewport">` 确保响应式设计
10. **sitemap.xml** 和 **robots.txt**

---

## Q17. 什么是 Web Components？包含哪些技术？

**答：**

Web Components 是一套浏览器原生 API，用于创建可复用的自定义元素。

**核心技术：**

1. **Custom Elements（自定义元素）**
   ```js
   class MyButton extends HTMLElement {
     connectedCallback() {
       this.innerHTML = '<button>点击</button>'
     }
   }
   customElements.define('my-button', MyButton)
   ```
   ```html
   <my-button></my-button>
   ```

2. **Shadow DOM（影子 DOM）**
   - 提供样式和 DOM 隔离
   ```js
   class MyCard extends HTMLElement {
     constructor() {
       super()
       const shadow = this.attachShadow({ mode: 'open' })
       shadow.innerHTML = `
         <style>h3 { color: blue; }</style>
         <h3>卡片标题</h3>
       `
     }
   }
   ```

3. **HTML Templates（模板）**
   - 使用 `<template>` 和 `<slot>` 定义可复用结构

**优势：**
- 原生支持，无需框架
- 真正的封装和隔离
- 可在任何框架中使用

---

## Q18. preload、prefetch、dns-prefetch 的区别？

**答：**

| 资源提示 | 时机 | 优先级 | 适用场景 |
|---|---|---|---|
| `dns-prefetch` | 提前解析 DNS | 低 | 第三方域名（CDN、API） |
| `preconnect` | DNS + TCP + TLS | 中 | 即将使用的跨域资源 |
| `preload` | 立即加载 | 高 | 当前页面必需资源（字体、关键 CSS） |
| `prefetch` | 空闲时加载 | 最低 | 下一页可能用到的资源 |

```html
<!-- 提前解析 CDN 域名 -->
<link rel="dns-prefetch" href="https://cdn.example.com" />

<!-- 预连接到 API 服务器 -->
<link rel="preconnect" href="https://api.example.com" />

<!-- 预加载关键字体 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />

<!-- 预获取下一页资源 -->
<link rel="prefetch" href="next-page.js" />
```

**注意：** 过度使用 `preload` 会浪费带宽，只用于真正关键的资源。

---

## Q19. 如何防止 XSS 攻击？

**答：**

**XSS（跨站脚本攻击）** 是指攻击者在页面中注入恶意脚本。

**防御措施：**

1. **输入验证和过滤**
   - 后端验证所有用户输入
   - 过滤 `<script>` `<iframe>` 等危险标签

2. **输出转义**
   ```js
   // 将用户输入转义后再插入 DOM
   function escapeHtml(str) {
     return str
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#39;')
   }
   ```

3. **使用 textContent 而非 innerHTML**
   ```js
   // 危险
   element.innerHTML = userInput
   
   // 安全
   element.textContent = userInput
   ```

4. **设置 CSP（内容安全策略）**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self'" />
   ```

5. **Cookie 设置 HttpOnly**
   ```
   Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict
   ```

6. **使用现代框架**（React、Vue 默认转义输出）

---

## Q20. 什么是 CORS？如何解决跨域问题？

**答：**

**CORS（跨域资源共享）** 是浏览器的安全机制，限制网页向不同源的服务器发起请求。

**同源定义：** 协议、域名、端口完全相同

**解决方案：**

1. **后端设置 CORS 响应头**（推荐）
   ```
   Access-Control-Allow-Origin: https://example.com
   Access-Control-Allow-Methods: GET, POST, PUT
   Access-Control-Allow-Headers: Content-Type
   Access-Control-Allow-Credentials: true
   ```

2. **JSONP**（仅支持 GET，已过时）
   ```html
   <script src="https://api.example.com/data?callback=handleData"></script>
   ```

3. **代理服务器**
   - 开发环境：配置 Vite/Webpack 代理
   - 生产环境：Nginx 反向代理

4. **postMessage**（iframe 跨域通信）
   ```js
   // 发送方
   iframe.contentWindow.postMessage('data', 'https://target.com')
   
   // 接收方
   window.addEventListener('message', (e) => {
     if (e.origin !== 'https://sender.com') return
     console.log(e.data)
   })
   ```

---

## Q21. 如何实现图片懒加载？

**答：**

**方案一：Intersection Observer API（推荐）**

```html
<img data-src="image.jpg" alt="懒加载图片" class="lazy" />
```

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove('lazy')
      observer.unobserve(img)
    }
  })
})

document.querySelectorAll('img.lazy').forEach(img => {
  observer.observe(img)
})
```

**方案二：原生 loading 属性**

```html
<img src="image.jpg" loading="lazy" alt="原生懒加载" />
```

**方案三：监听 scroll 事件（性能较差，不推荐）**

```js
window.addEventListener('scroll', () => {
  document.querySelectorAll('img.lazy').forEach(img => {
    if (img.getBoundingClientRect().top < window.innerHeight) {
      img.src = img.dataset.src
    }
  })
})
```

---

## Q22. 什么是 BFC（块级格式化上下文）？

**答：**

BFC 是 CSS 渲染的一个独立区域，内部元素的布局不会影响外部。

**触发 BFC 的条件：**
- 根元素 `<html>`
- `float` 不为 `none`
- `position` 为 `absolute` 或 `fixed`
- `display` 为 `inline-block`、`flex`、`grid`、`table-cell`
- `overflow` 不为 `visible`

**BFC 的特性：**
1. 内部盒子垂直排列
2. 垂直方向的 margin 会发生折叠
3. BFC 区域不会与浮动元素重叠
4. 计算 BFC 高度时，浮动元素也参与计算（清除浮动）

**应用场景：**

```html
<!-- 清除浮动 -->
<div style="overflow: hidden;">
  <div style="float: left;">浮动元素</div>
</div>

<!-- 防止 margin 折叠 -->
<div style="overflow: hidden;">
  <p style="margin: 20px;">段落</p>
</div>

<!-- 两栏布局 -->
<div style="float: left; width: 200px;">侧边栏</div>
<div style="overflow: hidden;">主内容（不会被浮动覆盖）</div>
```

---

## Q23. 如何优化首屏加载速度？

**答：**

**HTML 层面：**
1. **减少 DOM 深度**，避免过度嵌套
2. **关键 CSS 内联**，非关键 CSS 异步加载
3. **script 标签使用 defer/async**
4. **预加载关键资源**：`<link rel="preload">`
5. **DNS 预解析**：`<link rel="dns-prefetch">`

**资源优化：**
1. **图片优化**：WebP 格式、懒加载、响应式图片
2. **代码分割**：按路由拆分 JS bundle
3. **Tree Shaking**：移除未使用的代码
4. **压缩资源**：Gzip/Brotli 压缩
5. **CDN 加速**

**渲染优化：**
1. **骨架屏**：显示占位内容
2. **SSR/SSG**：服务端渲染或静态生成
3. **避免阻塞渲染**：移除 render-blocking 资源
4. **减少重绘回流**

**监控指标：**
- **FCP（首次内容绘制）**：< 1.8s
- **LCP（最大内容绘制）**：< 2.5s
- **TTI（可交互时间）**：< 3.8s

---

## Q24. HTML5 的 drag and drop API 如何使用？

**答：**

```html
<!-- 可拖拽元素 -->
<div draggable="true" id="drag-item">拖我</div>

<!-- 放置区域 -->
<div id="drop-zone" style="width: 200px; height: 200px; border: 2px dashed #ccc;">
  放置区域
</div>

<script>
const dragItem = document.getElementById('drag-item')
const dropZone = document.getElementById('drop-zone')

// 拖拽开始
dragItem.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', e.target.id)
  e.dataTransfer.effectAllowed = 'move'
})

// 拖拽进入放置区
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault() // 必须阻止默认行为才能触发 drop
  e.dataTransfer.dropEffect = 'move'
})

// 放置
dropZone.addEventListener('drop', (e) => {
  e.preventDefault()
  const id = e.dataTransfer.getData('text/plain')
  const element = document.getElementById(id)
  dropZone.appendChild(element)
})
</script>
```

**关键事件：**
- `dragstart` — 开始拖拽
- `drag` — 拖拽中
- `dragenter` — 进入放置区
- `dragover` — 在放置区上方（必须 `preventDefault`）
- `drop` — 放置
- `dragend` — 拖拽结束

---

## Q25. 如何实现页面打印样式优化？

**答：**

```html
<!-- 打印专用样式表 -->
<link rel="stylesheet" href="print.css" media="print" />
```

```css
/* print.css */
@media print {
  /* 隐藏不需要打印的元素 */
  header, nav, footer, .no-print {
    display: none !important;
  }
  
  /* 强制分页 */
  .page-break {
    page-break-after: always;
  }
  
  /* 避免元素被截断 */
  img, table, pre {
    page-break-inside: avoid;
  }
  
  /* 显示链接地址 */
  a[href]:after {
    content: " (" attr(href) ")";
  }
  
  /* 黑白打印优化 */
  * {
    color: #000 !important;
    background: #fff !important;
  }
}
```

**JavaScript 触发打印：**
```js
window.print()
```
