# HTML 面试题

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
