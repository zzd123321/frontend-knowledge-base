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
