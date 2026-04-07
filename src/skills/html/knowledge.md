# HTML 核心知识点

## 1. 语义化标签

语义化是指使用具有明确含义的 HTML 标签来描述内容结构，而不是单纯用 `<div>` 和 `<span>` 堆砌。

### 常用语义化标签

| 标签 | 含义 |
|------|------|
| `<header>` | 页面或区块的头部 |
| `<nav>` | 导航链接区域 |
| `<main>` | 页面主体内容（每页唯一） |
| `<article>` | 独立的内容单元（文章、帖子） |
| `<section>` | 内容分区，通常有标题 |
| `<aside>` | 侧边栏或附属内容 |
| `<footer>` | 页面或区块的底部 |
| `<figure>` / `<figcaption>` | 图片及其说明 |
| `<time>` | 日期或时间 |
| `<mark>` | 高亮文本 |

### 语义化的好处
- 提升 SEO，搜索引擎更容易理解页面结构
- 提升可访问性，屏幕阅读器依赖语义标签导航
- 代码可读性更强，便于团队协作维护

---

## 2. 文档结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="页面描述，影响 SEO" />
    <title>页面标题</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </body>
</html>
```

### DOCTYPE 的作用
`<!DOCTYPE html>` 告知浏览器使用 **标准模式（Standards Mode）** 解析文档，避免进入怪异模式（Quirks Mode）导致样式和布局异常。

---

## 3. 表单与输入

### 常用表单元素

```html
<form action="/submit" method="POST">
  <!-- 文本输入 -->
  <input type="text" name="username" placeholder="用户名" required />

  <!-- 密码 -->
  <input type="password" name="password" />

  <!-- 邮箱（自带格式验证） -->
  <input type="email" name="email" />

  <!-- 数字 -->
  <input type="number" min="0" max="100" step="1" />

  <!-- 日期 -->
  <input type="date" name="birthday" />

  <!-- 文件上传 -->
  <input type="file" accept="image/*" multiple />

  <!-- 下拉选择 -->
  <select name="city">
    <option value="bj">北京</option>
    <option value="sh">上海</option>
  </select>

  <!-- 多行文本 -->
  <textarea name="bio" rows="4"></textarea>

  <!-- 单选 -->
  <input type="radio" name="gender" value="male" id="male" />
  <label for="male">男</label>

  <!-- 复选 -->
  <input type="checkbox" name="agree" id="agree" />
  <label for="agree">同意协议</label>

  <button type="submit">提交</button>
</form>
```

### label 的重要性
`<label>` 通过 `for` 属性与 `input` 的 `id` 关联，点击 label 可聚焦对应输入框，同时提升可访问性。

### HTML5 表单验证属性
- `required` — 必填
- `minlength` / `maxlength` — 字符长度限制
- `min` / `max` — 数值范围
- `pattern` — 正则表达式验证
- `autocomplete` — 自动填充提示

---

## 4. 媒体元素

### 图片

```html
<!-- 基础用法 -->
<img src="photo.jpg" alt="描述文字" width="400" height="300" />

<!-- 响应式图片 -->
<picture>
  <source media="(max-width: 600px)" srcset="small.jpg" />
  <source media="(max-width: 1200px)" srcset="medium.jpg" />
  <img src="large.jpg" alt="响应式图片" />
</picture>

<!-- srcset 提供多分辨率 -->
<img
  src="image.jpg"
  srcset="image@2x.jpg 2x, image@3x.jpg 3x"
  alt="高清图片"
/>
```

### 视频

```html
<video controls width="640" poster="thumbnail.jpg">
  <source src="video.mp4" type="video/mp4" />
  <source src="video.webm" type="video/webm" />
  您的浏览器不支持视频播放
</video>
```

### 音频

```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg" />
  <source src="audio.ogg" type="audio/ogg" />
</audio>
```

---

## 5. meta 标签与 SEO

```html
<!-- 字符编码 -->
<meta charset="UTF-8" />

<!-- 视口设置（移动端必备） -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- 页面描述（显示在搜索结果摘要） -->
<meta name="description" content="不超过 160 字符的页面描述" />

<!-- 关键词（现代搜索引擎权重较低） -->
<meta name="keywords" content="HTML, 前端, 教程" />

<!-- Open Graph（社交分享预览） -->
<meta property="og:title" content="页面标题" />
<meta property="og:description" content="页面描述" />
<meta property="og:image" content="https://example.com/cover.jpg" />

<!-- 禁止搜索引擎索引 -->
<meta name="robots" content="noindex, nofollow" />
```

---

## 6. HTML5 新特性

### 新增语义标签
`<header>` `<footer>` `<nav>` `<main>` `<article>` `<section>` `<aside>` `<figure>` `<time>` 等。

### 新增表单类型
`email` `url` `number` `range` `date` `time` `color` `search` 等。

### 本地存储
- `localStorage` — 持久化存储，无过期时间
- `sessionStorage` — 会话级存储，标签页关闭即清除
- `IndexedDB` — 大容量结构化数据存储

### Canvas 与 SVG
```html
<!-- Canvas：像素级绘图 -->
<canvas id="myCanvas" width="400" height="300"></canvas>

<!-- SVG：矢量图形 -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>
```

### 其他重要 API
- **Geolocation API** — 获取地理位置
- **Web Workers** — 后台线程，不阻塞 UI
- **WebSocket** — 全双工通信
- **Drag and Drop API** — 原生拖拽
- **History API** — `pushState` / `replaceState` 操控浏览器历史

---

## 7. 无障碍（Accessibility / ARIA）

### 基本原则
- 所有图片必须有 `alt` 属性
- 表单控件必须有关联的 `<label>`
- 颜色对比度满足 WCAG AA 标准（4.5:1）
- 页面可以完全通过键盘操作

### ARIA 属性

```html
<!-- 角色 -->
<div role="button" tabindex="0">点击我</div>

<!-- 状态 -->
<button aria-expanded="false" aria-controls="menu">菜单</button>
<ul id="menu" aria-hidden="true">...</ul>

<!-- 标签 -->
<input type="search" aria-label="搜索内容" />

<!-- 实时区域 -->
<div aria-live="polite" aria-atomic="true">动态更新内容</div>
```

### 跳过导航链接
```html
<a href="#main-content" class="skip-link">跳过导航</a>
<nav>...</nav>
<main id="main-content">...</main>
```

---

## 8. script 标签加载策略

```html
<!-- 普通：阻塞 HTML 解析，下载并执行完才继续 -->
<script src="app.js"></script>

<!-- defer：不阻塞解析，HTML 解析完成后按顺序执行 -->
<script defer src="app.js"></script>

<!-- async：不阻塞解析，下载完立即执行（顺序不保证） -->
<script async src="analytics.js"></script>
```

**推荐做法：** 将 `<script>` 放在 `</body>` 前，或使用 `defer`。

---

## 9. 行内元素 vs 块级元素

| 特性 | 块级元素 | 行内元素 |
|------|----------|----------|
| 占据空间 | 独占一行 | 与内容等宽 |
| 宽高设置 | 可设置 | 无效（inline-block 除外） |
| 常见标签 | `div` `p` `h1-h6` `ul` `li` | `span` `a` `strong` `em` `img` |
| 可包含 | 块级和行内 | 只能包含行内（`a` 除外） |

> `<img>` 虽是行内元素，但可设置宽高（replaced element）。

---

## 10. HTML 实体字符

HTML 实体用于显示保留字符或特殊符号，避免被浏览器解析为代码。

### 常用实体

| 显示 | 实体名称 | 实体编号 | 说明 |
|------|----------|----------|------|
| `<` | `&lt;` | `&#60;` | 小于号 |
| `>` | `&gt;` | `&#62;` | 大于号 |
| `&` | `&amp;` | `&#38;` | 和号 |
| `"` | `&quot;` | `&#34;` | 双引号 |
| `'` | `&apos;` | `&#39;` | 单引号 |
| ` ` | `&nbsp;` | `&#160;` | 不间断空格 |
| `©` | `&copy;` | `&#169;` | 版权符号 |
| `®` | `&reg;` | `&#174;` | 注册商标 |
| `™` | `&trade;` | `&#8482;` | 商标符号 |
| `—` | `&mdash;` | `&#8212;` | 长破折号 |

```html
<p>HTML 标签用 &lt;div&gt; 表示</p>
<p>版权所有 &copy; 2026</p>
```

---

## 11. link 标签的 rel 属性

`<link>` 标签通过 `rel` 属性定义当前文档与外部资源的关系。

### 常用 rel 值

```html
<!-- 样式表 -->
<link rel="stylesheet" href="style.css" />

<!-- 网站图标 -->
<link rel="icon" href="favicon.ico" type="image/x-icon" />
<link rel="apple-touch-icon" href="icon.png" />

<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- 预连接（DNS + TCP + TLS） -->
<link rel="preconnect" href="https://cdn.example.com" />

<!-- 预加载关键资源 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />

<!-- 预获取下一页资源 -->
<link rel="prefetch" href="next-page.html" />

<!-- 预渲染下一页 -->
<link rel="prerender" href="next-page.html" />

<!-- 规范链接（避免重复内容） -->
<link rel="canonical" href="https://example.com/page" />

<!-- 备用语言版本 -->
<link rel="alternate" hreflang="en" href="https://example.com/en" />

<!-- RSS 订阅 -->
<link rel="alternate" type="application/rss+xml" href="feed.xml" />
```

### 资源提示优先级

1. **dns-prefetch** — 仅解析 DNS（最轻量）
2. **preconnect** — DNS + TCP + TLS 握手
3. **preload** — 高优先级加载当前页面必需资源
4. **prefetch** — 低优先级加载未来可能用到的资源
5. **prerender** — 完整渲染下一页（最激进，慎用）

---

## 12. 表格的完整结构

```html
<table>
  <!-- 表格标题 -->
  <caption>2026 年销售数据</caption>
  
  <!-- 表头 -->
  <thead>
    <tr>
      <th scope="col">月份</th>
      <th scope="col">销售额</th>
      <th scope="col">增长率</th>
    </tr>
  </thead>
  
  <!-- 表体 -->
  <tbody>
    <tr>
      <td>1月</td>
      <td>100万</td>
      <td>+5%</td>
    </tr>
    <tr>
      <td>2月</td>
      <td>120万</td>
      <td>+20%</td>
    </tr>
  </tbody>
  
  <!-- 表尾 -->
  <tfoot>
    <tr>
      <th scope="row">总计</th>
      <td>220万</td>
      <td>+12.5%</td>
    </tr>
  </tfoot>
</table>
```

### 表格可访问性

- `<caption>` 提供表格标题
- `<th scope="col|row">` 明确表头作用域
- `colspan` / `rowspan` 合并单元格时需配合 `headers` 属性

---

## 13. iframe 的 sandbox 属性

`sandbox` 属性为 iframe 提供安全沙箱，限制其能力。

```html
<!-- 完全沙箱化（最严格） -->
<iframe src="untrusted.html" sandbox></iframe>

<!-- 允许脚本执行 -->
<iframe src="widget.html" sandbox="allow-scripts"></iframe>

<!-- 允许表单提交 -->
<iframe src="form.html" sandbox="allow-forms allow-scripts"></iframe>

<!-- 允许同源访问 -->
<iframe src="same-origin.html" sandbox="allow-same-origin allow-scripts"></iframe>
```

### 常用 sandbox 值

| 值 | 允许的行为 |
|---|---|
| `allow-scripts` | 执行 JavaScript |
| `allow-forms` | 提交表单 |
| `allow-same-origin` | 访问同源资源（慎用，可能绕过沙箱） |
| `allow-popups` | 打开弹窗 |
| `allow-top-navigation` | 修改顶层窗口 URL |
| `allow-modals` | 使用 `alert`、`confirm` |

---

## 14. HTML 模板元素 `<template>`

`<template>` 定义可复用的 HTML 片段，内容不会被渲染，需通过 JavaScript 克隆后插入 DOM。

```html
<template id="card-template">
  <div class="card">
    <h3 class="card-title"></h3>
    <p class="card-content"></p>
  </div>
</template>

<script>
  const template = document.getElementById('card-template')
  const clone = template.content.cloneNode(true)
  
  clone.querySelector('.card-title').textContent = '标题'
  clone.querySelector('.card-content').textContent = '内容'
  
  document.body.appendChild(clone)
</script>
```

### 优势

- 内容不会被渲染，不影响页面性能
- 可包含任意 HTML，包括 `<script>` 和 `<style>`
- 配合 Web Components 使用（`<slot>` 插槽）

---

## 15. 表单高级特性

### fieldset 与 legend

```html
<form>
  <fieldset>
    <legend>个人信息</legend>
    <input type="text" name="name" placeholder="姓名" />
    <input type="email" name="email" placeholder="邮箱" />
  </fieldset>
  
  <fieldset disabled>
    <legend>已禁用区域</legend>
    <input type="text" name="readonly" />
  </fieldset>
</form>
```

### datalist 自动补全

```html
<input list="browsers" name="browser" />
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
  <option value="Edge">
</datalist>
```

### output 元素

```html
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
  <input type="number" id="a" value="0" /> +
  <input type="number" id="b" value="0" /> =
  <output name="result" for="a b">0</output>
</form>
```

---

## 16. 内容安全策略（CSP）

通过 `<meta>` 标签或 HTTP 响应头设置 CSP，防止 XSS 攻击。

```html
<!-- 仅允许同源脚本和样式 -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self'" />

<!-- 允许特定 CDN -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' https://cdn.example.com" />
```

### 常用指令

- `default-src` — 默认策略
- `script-src` — JavaScript 来源
- `style-src` — CSS 来源
- `img-src` — 图片来源
- `connect-src` — AJAX/WebSocket 来源
- `font-src` — 字体来源

---

## 17. 页面生命周期事件

```js
// DOM 解析完成（不等待样式、图片）
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready')
})

// 页面完全加载（包括图片、样式）
window.addEventListener('load', () => {
  console.log('Page fully loaded')
})

// 页面即将卸载
window.addEventListener('beforeunload', (e) => {
  e.preventDefault()
  e.returnValue = '' // 显示确认对话框
})

// 页面已卸载
window.addEventListener('unload', () => {
  // 发送统计数据（使用 navigator.sendBeacon）
})
```
