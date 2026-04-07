# CSS 面试题

## Q1. 盒模型有哪两种？有什么区别？

**答：**

CSS 盒模型有两种：**标准盒模型（content-box）** 和 **IE 盒模型（border-box）**。

**标准盒模型（content-box）：**
- `width` 和 `height` 只包含内容区域
- 实际占据空间 = width + padding + border + margin

**IE 盒模型（border-box）：**
- `width` 和 `height` 包含 content + padding + border
- 实际占据空间 = width + margin

```css
/* 标准盒模型 */
.box1 {
  box-sizing: content-box;  /* 默认值 */
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 实际宽度 = 200 + 40 + 10 = 250px */
}

/* IE 盒模型（推荐） */
.box2 {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 实际宽度 = 200px */
  /* 内容宽度 = 200 - 40 - 10 = 150px */
}
```

**最佳实践：** 全局设置 `box-sizing: border-box`，更符合直觉。

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

---

## Q2. BFC 是什么？如何触发？有什么应用？

**答：**

**BFC（Block Formatting Context，块级格式化上下文）** 是一个独立的渲染区域，内部元素的布局不会影响外部。

**触发 BFC 的条件：**
1. 根元素 `<html>`
2. `float` 不为 `none`
3. `position` 为 `absolute` 或 `fixed`
4. `display` 为 `inline-block`、`flex`、`grid`、`table-cell`、`flow-root`
5. `overflow` 不为 `visible`（常用 `hidden` 或 `auto`）

**BFC 的特性：**
1. 内部盒子垂直排列
2. 垂直方向的 margin 会发生折叠
3. BFC 区域不会与浮动元素重叠
4. 计算 BFC 高度时，浮动元素也参与计算

**应用场景：**

```css
/* 1. 清除浮动 */
.clearfix {
  overflow: hidden;  /* 触发 BFC */
}

/* 2. 防止 margin 折叠 */
.container {
  overflow: hidden;
}

/* 3. 两栏布局（左侧固定，右侧自适应） */
.sidebar {
  float: left;
  width: 200px;
}
.main {
  overflow: hidden;  /* 触发 BFC，不被浮动覆盖 */
}

/* 4. 现代方式：使用 display: flow-root */
.bfc {
  display: flow-root;  /* 专门用于创建 BFC */
}
```

---

## Q3. 如何实现水平垂直居中？

**答：**

### 方法一：Flexbox（推荐）

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 方法二：Grid

```css
.container {
  display: grid;
  place-items: center;
}
```

### 方法三：绝对定位 + Transform

```css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 方法四：绝对定位 + Margin Auto

```css
.child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 200px;   /* 需要固定宽高 */
  height: 100px;
}
```

### 方法五：Table-Cell（旧方法）

```css
.container {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

**最佳实践：** 优先使用 Flexbox 或 Grid，语义清晰且兼容性好。

---

## Q4. Flexbox 和 Grid 的区别？分别适用什么场景？

**答：**

| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维布局（行或列） | 二维布局（行和列） |
| 对齐方式 | 沿主轴和交叉轴 | 行列同时控制 |
| 内容驱动 | 是（子元素大小影响布局） | 否（容器定义网格） |
| 适用场景 | 导航栏、工具栏、卡片排列 | 页面整体布局、复杂网格 |

**Flexbox 适用场景：**
- 一维排列（水平或垂直）
- 不确定子元素数量
- 需要灵活的空间分配

```css
/* 导航栏 */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Grid 适用场景：**
- 二维布局（同时控制行列）
- 固定的网格结构
- 复杂的页面布局

```css
/* 页面布局 */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
```

**结论：** 两者可以结合使用，Grid 负责整体布局，Flexbox 负责局部组件。

---

## Q5. CSS 选择器优先级如何计算？

**答：**

**优先级权重（从高到低）：**
1. `!important` — 最高优先级（慎用）
2. 内联样式 — 1000
3. ID 选择器 — 100
4. 类/伪类/属性选择器 — 10
5. 标签/伪元素选择器 — 1
6. 通配符 `*` — 0

**计算规则：**
- 统计各类选择器的数量，按权重相加
- 权重相同时，后定义的覆盖先定义的

```css
/* 优先级：1 */
p { color: red; }

/* 优先级：10 */
.text { color: blue; }

/* 优先级：100 */
#title { color: green; }

/* 优先级：111 (100 + 10 + 1) */
#title .text p { color: purple; }

/* 优先级：21 (10 + 10 + 1) */
.container .text p { color: orange; }

/* 最高优先级 */
p { color: yellow !important; }
```

**注意事项：**
- `!important` 会破坏优先级规则，尽量避免使用
- 内联样式优先级高于外部样式
- 继承的样式优先级最低

---

## Q6. 什么是层叠上下文（Stacking Context）？

**答：**

**层叠上下文** 是 HTML 元素的三维概念，决定元素在 z 轴上的显示顺序。

**触发层叠上下文的条件：**
1. 根元素 `<html>`
2. `position` 为 `absolute` 或 `relative`，且 `z-index` 不为 `auto`
3. `position` 为 `fixed` 或 `sticky`
4. `opacity` 小于 1
5. `transform` 不为 `none`
6. `filter` 不为 `none`
7. `will-change` 指定了任意属性
8. `isolation: isolate`

**层叠顺序（从低到高）：**
1. 层叠上下文的背景和边框
2. `z-index` 为负值的子元素
3. 块级盒子
4. 浮动盒子
5. 行内盒子
6. `z-index: 0` 或 `auto` 的定位元素
7. `z-index` 为正值的子元素

```css
.parent {
  position: relative;
  z-index: 1;  /* 创建层叠上下文 */
}

.child {
  position: absolute;
  z-index: 9999;  /* 只在父级层叠上下文内有效 */
}
```

**注意：** 子元素的 `z-index` 只在父级层叠上下文内比较，无法跨越父级。

---

## Q7. 如何实现三栏布局（左右固定，中间自适应）？

**答：**

### 方法一：Flexbox（推荐）

```css
.container {
  display: flex;
}

.left, .right {
  width: 200px;
}

.center {
  flex: 1;
}
```

### 方法二：Grid

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```

### 方法三：浮动 + BFC

```css
.left {
  float: left;
  width: 200px;
}

.right {
  float: right;
  width: 200px;
}

.center {
  overflow: hidden;  /* 触发 BFC */
}
```

### 方法四：绝对定位

```css
.container {
  position: relative;
}

.left {
  position: absolute;
  left: 0;
  width: 200px;
}

.right {
  position: absolute;
  right: 0;
  width: 200px;
}

.center {
  margin: 0 200px;
}
```

### 方法五：圣杯布局

```html
<div class="container">
  <div class="center">中间（DOM 顺序优先）</div>
  <div class="left">左侧</div>
  <div class="right">右侧</div>
</div>
```

```css
.container {
  padding: 0 200px;
}

.center {
  float: left;
  width: 100%;
}

.left {
  float: left;
  width: 200px;
  margin-left: -100%;
  position: relative;
  left: -200px;
}

.right {
  float: left;
  width: 200px;
  margin-left: -200px;
  position: relative;
  right: -200px;
}
```

---

## Q8. 如何清除浮动？

**答：**

### 方法一：触发 BFC（推荐）

```css
.clearfix {
  overflow: hidden;
  /* 或 overflow: auto; */
  /* 或 display: flow-root; */
}
```

### 方法二：伪元素清除

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### 方法三：额外标签

```html
<div class="parent">
  <div class="float">浮动元素</div>
  <div style="clear: both;"></div>
</div>
```

**最佳实践：** 使用 `display: flow-root` 或 Flexbox/Grid 替代浮动布局。

---

## Q9. position 有哪些值？有什么区别？

**答：**

| 值 | 定位方式 | 脱离文档流 | 定位参照 |
|---|---|---|---|
| `static` | 默认定位 | 否 | 无 |
| `relative` | 相对定位 | 否 | 自身原位置 |
| `absolute` | 绝对定位 | 是 | 最近的非 static 祖先 |
| `fixed` | 固定定位 | 是 | 视口 |
| `sticky` | 粘性定位 | 否 | 视口 + 滚动容器 |

```css
/* 相对定位：相对于自身原位置偏移 */
.relative {
  position: relative;
  top: 10px;
  left: 20px;
}

/* 绝对定位：相对于最近的非 static 祖先 */
.absolute {
  position: absolute;
  top: 0;
  right: 0;
}

/* 固定定位：相对于视口 */
.fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

/* 粘性定位：滚动到阈值时固定 */
.sticky {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

**sticky 注意事项：**
- 必须指定 `top`、`bottom`、`left` 或 `right` 之一
- 父元素不能设置 `overflow: hidden`
- 父元素高度必须大于 sticky 元素

---

## Q10. 如何实现响应式设计？

**答：**

### 1. 视口设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### 2. 媒体查询

```css
/* 移动优先 */
.container {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}
```

### 3. 弹性单位

```css
.box {
  width: 50%;
  padding: 2rem;
  font-size: clamp(1rem, 2.5vw, 2rem);
}
```

### 4. 弹性布局

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

### 5. 响应式图片

```html
<picture>
  <source media="(max-width: 600px)" srcset="small.jpg" />
  <source media="(max-width: 1200px)" srcset="medium.jpg" />
  <img src="large.jpg" alt="响应式图片" />
</picture>
```

### 6. 容器查询（现代方案）

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

---

## Q11. 如何实现 1px 边框（移动端）？

**答：**

移动端高清屏（DPR > 1）会导致 1px 边框显示过粗。

### 方法一：Transform Scale（推荐）

```css
.border {
  position: relative;
}

.border::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: #000;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

/* 适配不同 DPR */
@media (-webkit-min-device-pixel-ratio: 2) {
  .border::after {
    transform: scaleY(0.5);
  }
}

@media (-webkit-min-device-pixel-ratio: 3) {
  .border::after {
    transform: scaleY(0.33);
  }
}
```

### 方法二：Viewport + rem

```html
<meta name="viewport" content="width=device-width, initial-scale=0.5" />
```

```css
.border {
  border: 1px solid #000;
}
```

### 方法三：Box-Shadow

```css
.border {
  box-shadow: 0 1px 0 0 #000;
}
```

### 方法四：SVG

```css
.border {
  border: 1px solid transparent;
  border-image: url("data:image/svg+xml,...") 2 repeat;
}
```

---

## Q12. 如何实现文本溢出省略？

**答：**

### 单行省略

```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 多行省略

```css
.ellipsis-multi {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 兼容方案（纯 CSS）

```css
.ellipsis-compat {
  position: relative;
  max-height: 4.5em;  /* 行高 * 行数 */
  overflow: hidden;
  line-height: 1.5em;
}

.ellipsis-compat::after {
  content: "...";
  position: absolute;
  right: 0;
  bottom: 0;
  padding-left: 20px;
  background: linear-gradient(to right, transparent, #fff 50%);
}
```

---

## Q13. CSS 动画和 JS 动画的区别？

**答：**

| 特性 | CSS 动画 | JS 动画 |
|------|----------|---------|
| 性能 | 更好（GPU 加速） | 较差（主线程） |
| 复杂度 | 简单动画 | 复杂交互 |
| 控制能力 | 有限 | 完全控制 |
| 兼容性 | 需要前缀 | 兼容性好 |
| 调试 | 较难 | 容易 |

**CSS 动画适用场景：**
- 简单的过渡效果
- 悬停、点击等状态变化
- 性能要求高的场景

```css
.fade {
  transition: opacity 0.3s ease;
}

.fade:hover {
  opacity: 0.5;
}
```

**JS 动画适用场景：**
- 复杂的时间轴控制
- 需要动态计算的动画
- 需要暂停、倒放等精确控制

```js
element.animate([
  { transform: 'translateX(0)' },
  { transform: 'translateX(100px)' }
], {
  duration: 1000,
  easing: 'ease-in-out'
})
```

**最佳实践：** 优先使用 CSS 动画，复杂场景使用 Web Animations API 或 GSAP。

---

## Q14. 如何优化 CSS 性能？

**答：**

### 1. 选择器优化

```css
/* 避免：通配符和深层嵌套 */
* { margin: 0; }
.container .list .item .link { color: blue; }

/* 推荐：简洁的选择器 */
.link { color: blue; }
```

### 2. 减少重绘和回流

```css
/* 触发回流的属性（避免频繁修改） */
width, height, margin, padding, border, position, top, left

/* 仅触发重绘的属性 */
color, background, box-shadow, border-radius

/* 仅触发合成的属性（性能最好） */
transform, opacity
```

### 3. 使用 will-change

```css
.animated {
  will-change: transform, opacity;
}

/* 动画结束后移除 */
.animated.done {
  will-change: auto;
}
```

### 4. 启用硬件加速

```css
.accelerated {
  transform: translateZ(0);
  /* 或 */
  transform: translate3d(0, 0, 0);
}
```

### 5. 使用 contain

```css
.card {
  contain: layout style paint;
}
```

### 6. 使用 content-visibility

```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

### 7. 减少 CSS 文件大小

- 移除未使用的 CSS（PurgeCSS）
- 压缩 CSS（cssnano）
- 使用 CSS Modules 或 CSS-in-JS

### 8. 关键 CSS 内联

```html
<style>
  /* 首屏关键样式 */
  .header { ... }
</style>
<link rel="stylesheet" href="main.css" />
```

---

## Q15. 如何实现暗黑模式？

**答：**

### 方法一：CSS 变量 + 媒体查询

```css
:root {
  --bg-color: #fff;
  --text-color: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #fff;
  }
}

body {
  background: var(--bg-color);
  color: var(--text-color);
}
```

### 方法二：类名切换

```css
:root {
  --bg-color: #fff;
  --text-color: #333;
}

.dark-theme {
  --bg-color: #1a1a1a;
  --text-color: #fff;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
}
```

```js
// 切换主题
document.body.classList.toggle('dark-theme')

// 保存用户偏好
localStorage.setItem('theme', 'dark')
```

### 方法三：data 属性

```css
[data-theme="light"] {
  --bg-color: #fff;
  --text-color: #333;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #fff;
}
```

```js
document.documentElement.setAttribute('data-theme', 'dark')
```

---

## Q16. 什么是 CSS Modules？有什么优势？

**答：**

**CSS Modules** 是一种 CSS 文件的模块化方案，通过编译生成唯一的类名，避免全局污染。

```css
/* Button.module.css */
.button {
  background: blue;
  color: white;
}

.primary {
  background: green;
}
```

```jsx
import styles from './Button.module.css'

<button className={styles.button}>按钮</button>
<button className={`${styles.button} ${styles.primary}`}>主按钮</button>
```

**编译后：**
```html
<button class="Button_button__2x3y">按钮</button>
```

**优势：**
1. **避免命名冲突** — 自动生成唯一类名
2. **显式依赖** — 明确知道组件使用了哪些样式
3. **按需加载** — 配合代码分割，减少 CSS 体积
4. **易于维护** — 样式与组件绑定，删除组件时样式也被删除

**注意：** 全局样式需要使用 `:global` 包裹。

```css
:global(.ant-btn) {
  border-radius: 4px;
}
```

---

## Q17. CSS 中如何解决浮动元素父元素高度塌陷问题？

**答：**

浮动元素会导致父元素高度塌陷，因为浮动元素脱离文档流，父元素无法感知其高度。

### 解决方案

**方法一：clearfix 技巧（推荐）**

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

**方法二：触发 BFC**

```css
.container {
  overflow: hidden;  /* 或 auto */
  /* 或 */
  display: flow-root;  /* 现代浏览器 */
}
```

**方法三：使用 Flexbox/Grid 替代浮动**

```css
.container {
  display: flex;
  /* 或 */
  display: grid;
}
```

---

## Q18. CSS 中的伪类和伪元素有什么区别？

**答：**

| 特性 | 伪类 | 伪元素 |
|------|------|--------|
| 符号 | 单冒号 `:` | 双冒号 `::`（单冒号兼容旧版） |
| 作用 | 选择元素的特定状态或位置 | 创建不存在于 DOM 中的元素 |
| 数量 | 不产生新元素 | 产生新的虚拟元素 |
| 示例 | `:hover`, `:nth-child()` | `::before`, `::after`, `::first-line` |

```css
/* 伪类：选择状态 */
a:hover { color: red; }
li:first-child { font-weight: bold; }

/* 伪元素：创建虚拟元素 */
.icon::before {
  content: "→";
  margin-right: 8px;
}

/* 清除浮动 */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

---

## Q19. 什么是 CSS 的继承？哪些属性可以继承？

**答：**

**继承**是指子元素自动继承父元素的某些 CSS 属性值。

### 可继承的属性

- 字体相关：`font-family`, `font-size`, `font-weight`, `font-style`, `line-height`, `color`
- 文本相关：`text-align`, `text-indent`, `text-transform`, `letter-spacing`, `word-spacing`
- 列表：`list-style`, `list-style-type`
- 其他：`visibility`, `cursor`

### 不可继承的属性

- 盒模型：`width`, `height`, `margin`, `padding`, `border`
- 定位：`position`, `top`, `left`, `right`, `bottom`
- 背景：`background`, `background-color`, `background-image`
- 显示：`display`, `overflow`, `float`

### 控制继承

```css
.child {
  /* 强制继承 */
  border: inherit;
  
  /* 初始值 */
  color: initial;
  
  /* 恢复默认值 */
  all: unset;
  
  /* 恢复层叠值 */
  color: revert;
}
```

---

## Q20. display: none、visibility: hidden 和 opacity: 0 的区别？

**答：**

| 特性 | display: none | visibility: hidden | opacity: 0 |
|------|---------------|-------------------|------------|
| 布局影响 | 脱离文档流，不占据空间 | 占据空间，仅不可见 | 占据空间，仅透明 |
| 动画支持 | 不支持 | 支持 | 支持 |
| 触发事件 | 否 | 否 | 是（点击等） |
| 继承性 | 否 | 可继承 | 可继承 |
| SEO | 内容不可见 | 内容可见 | 内容可见 |

```css
/* display: none - 完全隐藏 */
.hidden { display: none; }

/* visibility: hidden - 占位但不可见 */
.invisible { visibility: hidden; }

/* opacity: 0 - 透明但仍可交互 */
.transparent { opacity: 0; pointer-events: none; }
```

---

## Q21. 什么是 CSS Hack？请举例说明

**答：**

**CSS Hack** 是利用浏览器解析差异来针对不同浏览器或版本写样式的方法。

### 条件注释（IE）

```html
<!--[if IE]>
  <link rel="stylesheet" href="ie.css" />
<![endif]-->
```

### 属性级 Hack

```css
/* IE6 */
.selector { _color: red; }

/* IE6/7 */
.selector { *color: red; }

/* IE8 */
.selector { color: red\\0/; }
```

**注意：** 现代开发推荐使用特性检测（`@supports`）或 autoprefixer，避免使用 CSS Hack。

---

## Q22. 如何理解 CSS 的层叠（Cascading）？

**答：**

**层叠**是 CSS 的核心机制，决定当多个样式规则作用于同一元素时，哪个规则生效。

### 层叠顺序（权重从高到低）

1. **重要程度** - 用户代理样式表 → 用户样式表 → 作者样式表 → `!important`
2. **来源顺序** - 内联样式 → 内部样式表 → 外部样式表
3. **选择器特异性** - 内联样式（1000）> ID（100）> 类/伪类/属性（10）> 标签/伪元素（1）
4. **源码顺序** - 后定义的规则覆盖先定义的规则

---

## Q23. CSS 中的 calc() 函数和 min/max/clamp() 如何使用？

**答：**

### calc() - 动态计算

```css
.sidebar {
  width: calc(100% - 250px);
}
```

### min() / max()

```css
.container {
  width: min(90%, 1200px);      /* 取较小值 */
  height: max(50vh, 300px);     /* 取较大值 */
}
```

### clamp() - 限制范围

```css
.hero-title {
  font-size: clamp(1.5rem, 5vw, 3rem);  /* 最小值、首选值、最大值 */
}
```

---

## Q24. 如何实现文字描边效果？

**答：**

### 方法一：text-stroke（推荐）

```css
.stroke {
  -webkit-text-stroke: 2px #000;
  -webkit-text-fill-color: transparent;
}
```

### 方法二：text-shadow 模拟

```css
.stroke {
  color: #fff;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
```

---

## Q25. CSS 中的 filter 属性有哪些用途？

**答：**

```css
.image {
  filter: blur(5px);           /* 模糊 */
  filter: brightness(1.5);     /* 亮度 */
  filter: contrast(200%);      /* 对比度 */
  filter: grayscale(100%);     /* 灰度 */
  filter: hue-rotate(90deg);   /* 色相旋转 */
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));  /* 阴影 */
}
```

---

## Q26. 什么是 CSS 中的 has() 选择器？

**答：**

`:has()` 是 CSS 的父选择器，可以根据子元素状态选择父元素（"父选择器"）。

```css
/* 选择包含 a 标签的 li */
li:has(a) {
  list-style-type: disc;
}

/* 选择包含图片的卡片 */
.card:has(img) {
  display: flex;
  gap: 1rem;
}

/* 选择表单中必填项的标签 */
label:has(+ input[required])::after {
  content: " *";
  color: red;
}
```

---

## Q27. CSS 容器查询（Container Queries）是什么？

**答：**

容器查询根据**容器尺寸**而非视口尺寸应用样式，是响应式设计的演进。

```css
/* 定义容器 */
.card-container {
  container-type: inline-size;
}

/* 容器查询 */
@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

---

## Q28. 如何优化 CSS 选择器性能？

**答：**

### 性能优化策略

```css
/* ❌ 避免 */
* { margin: 0; }                    /* 通配符 */
div p span a { color: red; }        /* 深层嵌套 */

/* ✅ 推荐 */
.nav-link { color: red; }           /* 类选择器 */
.btn { padding: 8px 16px; }          /* 简洁类名 */
```

1. 减少选择器复杂度 - 避免深层嵌套
2. 避免过度通用 - 优先使用类选择器
3. 合理使用 BEM 命名
4. 使用 Scoped CSS / CSS Modules

---

## Q29. CSS Grid 中的 subgrid 是什么？

**答：**

`subgrid` 允许子网格继承父网格的轨道定义，实现嵌套元素的精确对齐。

```css
.parent-grid {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}

.child-grid {
  display: grid;
  grid-template-columns: subgrid;  /* 继承父网格的列定义 */
  grid-column: span 3;
}
```

---

## Q30. CSS 中的 @supports 是什么？

**答：**

`@supports` 是 CSS 的特性查询，检测浏览器是否支持某个 CSS 特性。

```css
/* 检测是否支持 sticky 定位 */
@supports (position: sticky) {
  .nav { position: sticky; top: 0; }
}

/* 不支持时的回退 */
@supports not (position: sticky) {
  .nav { position: fixed; }
}

/* 检测多个条件 */
@supports (display: grid) and (gap: 20px) {
  .layout { display: grid; gap: 20px; }
}
```

---

## Q31. 如何实现文字渐变效果？

**答：**

```css
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

---

## Q32. 如何实现滚动条样式的自定义？

**答：**

```css
/* Webkit 浏览器 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox */
.scrollable {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
```

---

## Q33. CSS 中的 content-visibility 如何提升性能？

**答：**

`content-visibility` 可以延迟渲染屏幕外的内容，大幅提升初始加载性能。

```css
.section {
  content-visibility: auto;           /* 浏览器自动管理可见性 */
  contain-intrinsic-size: 0 500px;  /* 设置预估高度 */
}
```

| 属性 | 作用 |
|------|------|
| `display: none` | 不渲染，不占位 |
| `visibility: hidden` | 渲染但不可见，占位 |
| `content-visibility: auto` | 自动延迟渲染屏幕外内容 |

---

## Q34. 如何实现图片在容器中的自适应展示？

**答：**

### object-fit

```css
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;      /* 裁剪填充 */
  object-fit: contain;    /* 完整显示 */
  object-fit: fill;       /* 拉伸填充 */
}
```

### aspect-ratio

```css
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

---

## Q35. CSS 中常见的布局技巧有哪些？

**答：**

### 等高列

```css
.columns {
  display: flex;
}

.column {
  flex: 1;
}
```

### 粘性页脚

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
```

### 全屏背景

```css
.full-screen {
  min-height: 100vh;
  /* 或使用 dvh 考虑移动端地址栏 */
  min-height: 100dvh;
}
```
