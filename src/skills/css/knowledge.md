# CSS 核心知识点

## 1. CSS 选择器

### 基础选择器

| 选择器 | 示例 | 说明 |
|--------|------|------|
| 通配符 | `*` | 选择所有元素 |
| 标签 | `div` | 选择所有 div 元素 |
| 类 | `.class` | 选择所有 class="class" 的元素 |
| ID | `#id` | 选择 id="id" 的元素 |
| 属性 | `[type="text"]` | 选择 type 属性为 text 的元素 |

### 组合选择器

```css
/* 后代选择器 */
div p { color: red; }

/* 子选择器 */
div > p { color: blue; }

/* 相邻兄弟选择器 */
h1 + p { margin-top: 0; }

/* 通用兄弟选择器 */
h1 ~ p { color: gray; }

/* 多类选择器 */
.class1.class2 { font-weight: bold; }
```

### 伪类选择器

```css
/* 链接状态 */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }

/* 结构伪类 */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(2n) { background: #f0f0f0; }  /* 偶数 */
li:nth-child(odd) { background: white; }   /* 奇数 */
li:nth-child(3n+1) { color: red; }         /* 1, 4, 7... */

/* 表单伪类 */
input:focus { border-color: blue; }
input:disabled { opacity: 0.5; }
input:checked + label { color: green; }
input:valid { border-color: green; }
input:invalid { border-color: red; }

/* 其他伪类 */
:not(.active) { opacity: 0.5; }
:empty { display: none; }
:root { --main-color: #333; }
```

### 伪元素选择器

```css
/* 首字母/首行 */
p::first-letter { font-size: 2em; }
p::first-line { font-weight: bold; }

/* 前后插入内容 */
.icon::before {
  content: "→ ";
  color: blue;
}

.external-link::after {
  content: " ↗";
}

/* 选中文本样式 */
::selection {
  background: yellow;
  color: black;
}

/* 占位符样式 */
input::placeholder {
  color: #999;
  font-style: italic;
}
```

### 选择器优先级

**权重计算：**
- 内联样式：1000
- ID 选择器：100
- 类/伪类/属性：10
- 标签/伪元素：1

```css
/* 优先级：1 */
p { color: red; }

/* 优先级：10 */
.text { color: blue; }

/* 优先级：100 */
#title { color: green; }

/* 优先级：111 */
#title p.text { color: purple; }

/* 最高优先级 */
p { color: orange !important; }
```

---

## 2. 盒模型

### 标准盒模型 vs IE 盒模型

```css
/* 标准盒模型（content-box） */
.box {
  box-sizing: content-box;  /* 默认值 */
  width: 200px;             /* 仅内容宽度 */
  padding: 20px;
  border: 5px solid;
  /* 实际占据宽度 = 200 + 20*2 + 5*2 = 250px */
}

/* IE 盒模型（border-box，推荐） */
.box {
  box-sizing: border-box;
  width: 200px;             /* 包含 padding 和 border */
  padding: 20px;
  border: 5px solid;
  /* 实际占据宽度 = 200px */
  /* 内容宽度 = 200 - 20*2 - 5*2 = 150px */
}

/* 全局设置 */
*, *::before, *::after {
  box-sizing: border-box;
}
```

### margin 折叠

```css
/* 垂直方向 margin 会折叠，取较大值 */
.box1 { margin-bottom: 30px; }
.box2 { margin-top: 20px; }
/* 实际间距：30px（不是 50px） */

/* 避免 margin 折叠的方法 */
.parent {
  overflow: hidden;        /* 触发 BFC */
  /* 或 display: flex; */
  /* 或 padding-top: 1px; */
}
```

---

## 3. 布局

### Flexbox 弹性布局

```css
.container {
  display: flex;
  
  /* 主轴方向 */
  flex-direction: row;           /* row | row-reverse | column | column-reverse */
  
  /* 换行 */
  flex-wrap: wrap;               /* nowrap | wrap | wrap-reverse */
  
  /* 主轴对齐 */
  justify-content: space-between; /* flex-start | flex-end | center | space-between | space-around | space-evenly */
  
  /* 交叉轴对齐 */
  align-items: center;           /* flex-start | flex-end | center | baseline | stretch */
  
  /* 多行对齐 */
  align-content: flex-start;     /* flex-start | flex-end | center | space-between | space-around | stretch */
  
  /* 间距（现代浏览器） */
  gap: 20px;
}

.item {
  /* 放大比例 */
  flex-grow: 1;
  
  /* 缩小比例 */
  flex-shrink: 1;
  
  /* 基础大小 */
  flex-basis: 200px;
  
  /* 简写 */
  flex: 1 1 200px;  /* grow shrink basis */
  
  /* 单独对齐 */
  align-self: flex-end;
  
  /* 排序 */
  order: 2;
}
```

### Grid 网格布局

```css
.container {
  display: grid;
  
  /* 定义列 */
  grid-template-columns: 200px 1fr 2fr;
  /* 或使用 repeat */
  grid-template-columns: repeat(3, 1fr);
  /* 或自动填充 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  
  /* 定义行 */
  grid-template-rows: 100px auto 100px;
  
  /* 间距 */
  gap: 20px;
  /* 或分别设置 */
  row-gap: 20px;
  column-gap: 10px;
  
  /* 对齐 */
  justify-items: center;    /* 水平对齐单元格内容 */
  align-items: center;      /* 垂直对齐单元格内容 */
  justify-content: center;  /* 水平对齐整个网格 */
  align-content: center;    /* 垂直对齐整个网格 */
}

.item {
  /* 跨列 */
  grid-column: 1 / 3;       /* 从第1列到第3列 */
  /* 或 */
  grid-column: span 2;      /* 跨2列 */
  
  /* 跨行 */
  grid-row: 1 / 3;
  
  /* 简写 */
  grid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */
}

/* 命名网格区域 */
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### 定位

```css
/* 静态定位（默认） */
.static {
  position: static;
}

/* 相对定位：相对于自身原位置 */
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

---

## 4. 响应式设计

### 媒体查询

```css
/* 移动优先 */
.container {
  width: 100%;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}

/* 大屏 */
@media (min-width: 1440px) {
  .container {
    width: 1200px;
  }
}

/* 横屏 */
@media (orientation: landscape) {
  .sidebar {
    display: block;
  }
}

/* 打印 */
@media print {
  .no-print {
    display: none;
  }
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #fff;
  }
}

/* 减少动画（无障碍） */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### 响应式单位

```css
/* 相对单位 */
.box {
  /* 相对于父元素字体大小 */
  width: 20em;
  
  /* 相对于根元素字体大小 */
  padding: 2rem;
  
  /* 相对于视口宽度 */
  font-size: 5vw;
  
  /* 相对于视口高度 */
  height: 50vh;
  
  /* 视口最小值 */
  width: 50vmin;
  
  /* 视口最大值 */
  height: 50vmax;
  
  /* 百分比 */
  width: 50%;
}

/* 现代单位 */
.container {
  /* 容器查询单位 */
  width: 50cqw;
  
  /* 动态视口单位（考虑移动端地址栏） */
  height: 100dvh;
}
```

### 容器查询

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

---

## 5. 颜色与渐变

### 颜色表示

```css
.element {
  /* 关键字 */
  color: red;
  
  /* 十六进制 */
  color: #ff0000;
  color: #f00;  /* 简写 */
  
  /* RGB */
  color: rgb(255, 0, 0);
  color: rgba(255, 0, 0, 0.5);  /* 带透明度 */
  
  /* HSL（色相、饱和度、亮度） */
  color: hsl(0, 100%, 50%);
  color: hsla(0, 100%, 50%, 0.5);
  
  /* 现代语法 */
  color: rgb(255 0 0 / 0.5);
  color: hsl(0deg 100% 50% / 0.5);
}
```

### 渐变

```css
/* 线性渐变 */
.linear {
  background: linear-gradient(to right, red, blue);
  background: linear-gradient(45deg, red, yellow, green);
  background: linear-gradient(to bottom, red 0%, yellow 50%, green 100%);
}

/* 径向渐变 */
.radial {
  background: radial-gradient(circle, red, blue);
  background: radial-gradient(ellipse at center, red, blue);
}

/* 锥形渐变 */
.conic {
  background: conic-gradient(red, yellow, green, blue, red);
}

/* 重复渐变 */
.repeating {
  background: repeating-linear-gradient(
    45deg,
    red 0px,
    red 10px,
    blue 10px,
    blue 20px
  );
}
```

---

## 6. 文本与字体

```css
.text {
  /* 字体族 */
  font-family: "Helvetica Neue", Arial, sans-serif;
  
  /* 字体大小 */
  font-size: 16px;
  
  /* 字重 */
  font-weight: 700;  /* 100-900 或 normal/bold */
  
  /* 字体样式 */
  font-style: italic;
  
  /* 行高 */
  line-height: 1.5;
  
  /* 字间距 */
  letter-spacing: 0.05em;
  
  /* 词间距 */
  word-spacing: 0.1em;
  
  /* 文本对齐 */
  text-align: center;  /* left | right | center | justify */
  
  /* 文本装饰 */
  text-decoration: underline;
  text-decoration: line-through;
  
  /* 文本转换 */
  text-transform: uppercase;  /* lowercase | capitalize */
  
  /* 文本缩进 */
  text-indent: 2em;
  
  /* 文本阴影 */
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  
  /* 溢出处理 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* 多行省略 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Web 字体 */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2'),
       url('font.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;  /* 字体加载策略 */
}
```

---

## 7. 变换与动画

### Transform 变换

```css
.transform {
  /* 平移 */
  transform: translate(50px, 100px);
  transform: translateX(50px);
  transform: translateY(100px);
  
  /* 缩放 */
  transform: scale(1.5);
  transform: scale(2, 0.5);  /* x, y */
  
  /* 旋转 */
  transform: rotate(45deg);
  
  /* 倾斜 */
  transform: skew(10deg, 20deg);
  
  /* 组合变换 */
  transform: translate(50px, 100px) rotate(45deg) scale(1.2);
  
  /* 3D 变换 */
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: translateZ(100px);
  transform: perspective(500px) rotateY(45deg);
}

/* 变换原点 */
.box {
  transform-origin: center center;  /* 默认 */
  transform-origin: top left;
  transform-origin: 50% 50%;
}
```

### Transition 过渡

```css
.button {
  background: blue;
  transition: background 0.3s ease;
}

.button:hover {
  background: red;
}

/* 完整语法 */
.box {
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  transition-delay: 0.1s;
  
  /* 简写 */
  transition: all 0.3s ease-in-out 0.1s;
  
  /* 多个属性 */
  transition: 
    background 0.3s ease,
    transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 缓动函数 */
.timing {
  transition-timing-function: ease;        /* 默认 */
  transition-timing-function: linear;
  transition-timing-function: ease-in;
  transition-timing-function: ease-out;
  transition-timing-function: ease-in-out;
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
}
```

### Animation 动画

```css
/* 定义关键帧 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 或使用百分比 */
@keyframes bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

/* 应用动画 */
.animated {
  animation-name: slideIn;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: 0.5s;
  animation-iteration-count: infinite;  /* 或具体次数 */
  animation-direction: alternate;       /* normal | reverse | alternate | alternate-reverse */
  animation-fill-mode: forwards;        /* none | forwards | backwards | both */
  animation-play-state: running;        /* running | paused */
  
  /* 简写 */
  animation: slideIn 1s ease-out 0.5s infinite alternate forwards;
}

/* 多个动画 */
.multi {
  animation: 
    slideIn 1s ease-out,
    fadeIn 0.5s ease-in;
}
```

---

## 8. CSS 变量

```css
:root {
  /* 定义全局变量 */
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --font-size-base: 16px;
  --spacing-unit: 8px;
}

.component {
  /* 使用变量 */
  color: var(--primary-color);
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
  
  /* 带默认值 */
  background: var(--bg-color, #fff);
}

/* 局部变量 */
.dark-theme {
  --primary-color: #2980b9;
  --bg-color: #1a1a1a;
}

/* JavaScript 操作 */
/* document.documentElement.style.setProperty('--primary-color', '#e74c3c'); */
```

---

## 9. 现代 CSS 特性

### Clamp 函数

```css
.responsive-text {
  /* 最小值、首选值、最大值 */
  font-size: clamp(1rem, 2.5vw, 2rem);
  width: clamp(300px, 50%, 800px);
}
```

### Min/Max 函数

```css
.box {
  width: min(90%, 1200px);  /* 取较小值 */
  height: max(300px, 50vh); /* 取较大值 */
}
```

### Aspect Ratio

```css
.video {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.square {
  aspect-ratio: 1;
}
```

### Logical Properties

```css
/* 传统方式 */
.box {
  margin-left: 20px;
  padding-right: 10px;
}

/* 逻辑属性（支持 RTL） */
.box {
  margin-inline-start: 20px;
  padding-inline-end: 10px;
  padding-block: 10px 20px;  /* 上下 */
  padding-inline: 10px 20px; /* 左右 */
}
```

### Scroll Snap

```css
.container {
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
}

.item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

### Backdrop Filter

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
```

---

## 10. 性能优化

### Will-Change

```css
.animated {
  /* 提前告知浏览器将要变化的属性 */
  will-change: transform, opacity;
}

/* 动画结束后移除 */
.animated.done {
  will-change: auto;
}
```

### Contain

```css
.card {
  /* 限制布局/样式/绘制的影响范围 */
  contain: layout style paint;
  /* 或 */
  contain: strict;
}
```

### Content-Visibility

```css
.section {
  /* 延迟渲染屏幕外内容 */
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

### 硬件加速

```css
.accelerated {
  /* 触发 GPU 加速 */
  transform: translateZ(0);
  /* 或 */
  will-change: transform;
}
```

---

## 11. 常见布局模式

### 圣杯布局

```css
.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.header, .footer {
  flex-shrink: 0;
}

.main {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
}

.content {
  flex: 1;
}
```

### 水平垂直居中

```css
/* Flexbox */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid */
.center-grid {
  display: grid;
  place-items: center;
}

/* 绝对定位 + Transform */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 绝对定位 + Margin */
.center-margin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}
```

### 等高列

```css
/* Flexbox */
.columns {
  display: flex;
}

.column {
  flex: 1;
}

/* Grid */
.columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

---

## 12. 调试技巧

```css
/* 显示所有元素边框 */
* {
  outline: 1px solid red;
}

/* 显示特定元素 */
.debug {
  background: rgba(255, 0, 0, 0.1);
  border: 2px dashed red;
}

/* 检查层叠上下文 */
.layer {
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 255, 0.1);
}
```
