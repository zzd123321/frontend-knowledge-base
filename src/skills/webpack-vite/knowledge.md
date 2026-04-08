# Webpack 与 Vite 核心知识点

Webpack 与 Vite 都是前端工程化中的重要工具，但定位和实现思路并不完全相同。理解它们，不只是为了会配置，而是为了理解现代前端开发中的模块化、构建、编译、打包、热更新和性能优化。

---

## 1. 为什么需要构建工具

真实项目会涉及：

- 模块依赖管理
- 语法转译
- 样式和图片处理
- 环境变量注入
- 压缩与拆包
- 本地开发服务器
- 热更新

---

## 2. Webpack 的核心定位

Webpack 本质上是模块打包器。

核心能力：

- 从入口出发分析依赖图
- 用 loader 处理模块内容
- 用 plugin 扩展构建流程
- 输出打包产物

---

## 3. Vite 的核心定位

Vite 是现代前端构建工具，特点包括：

- 开发环境利用原生 ESM
- 依赖预构建
- 冷启动快
- HMR 快
- 生产环境通常基于 Rollup

---

## 4. Webpack 与 Vite 的主要区别

### 开发阶段

- Webpack：通常先打包后启动
- Vite：开发时按需编译、浏览器直接请求模块

### 生产阶段

- Webpack：自己完成打包
- Vite：通常交给 Rollup

---

## 5. 模块化基础

常见模块化：

- CommonJS
- ES Modules

构建工具要处理：

- 依赖关系
- 资源引用
- 转译兼容
- 动态导入

---

## 6. Webpack 核心概念

### Entry

入口文件。

### Output

输出目录和命名规则。

### Loader

处理模块内容转换。

常见：

- `babel-loader`
- `ts-loader`
- `css-loader`

### Plugin

扩展整个构建流程。

---

## 7. Loader 与 Plugin 的区别

Loader：

- 处理文件内容转换

Plugin：

- 扩展构建流程

---

## 8. Webpack 构建流程概览

1. 读取配置
2. 从 entry 出发分析依赖
3. 调用 loader 转换模块
4. 生成依赖图
5. plugin 介入处理
6. 输出产物

---

## 9. 开发服务器与 HMR

HMR 的作用是修改代码后尽量只替换受影响模块，而不是整页刷新。

---

## 10. 代码分割

常见方式：

- 动态导入 `import()`
- 路由级拆分
- 公共依赖拆分

---

## 11. Tree Shaking

Tree Shaking 用于移除未使用代码。

通常依赖：

- ES Modules
- 静态可分析性

---

## 12. Source Map

Source Map 用于把构建后代码映射回源代码，方便调试和错误定位。

---

## 13. Babel 与 TypeScript 编译

### Babel

负责语法转译、兼容处理。

### TypeScript

负责类型检查和语法编译。

实际项目里常见搭配是 TypeScript 做类型检查，Babel / esbuild / swc 做转译。

---

## 14. Vite 的依赖预构建

Vite 开发时会预构建第三方依赖，通常借助 esbuild。

目的：

- 统一模块格式
- 减少请求碎片
- 提升启动速度

---

## 15. Vite 的开发原理

Vite 开发环境下：

- 浏览器直接请求源码模块
- Vite 按需转换返回
- 文件变更后只推送受影响模块更新

---

## 16. 环境变量

Vite 常见：

- `.env`
- `.env.development`
- `.env.production`

通过 `import.meta.env` 使用。

Webpack 常通过 `DefinePlugin` 注入。

---

## 17. 静态资源处理

常见资源：

- 图片
- 字体
- SVG
- CSS

构建工具会处理：

- 路径重写
- hash 命名
- 小资源内联

---

## 18. CSS 工程化

常配合：

- Sass / Less
- PostCSS
- Tailwind
- CSS Modules

---

## 19. 性能优化相关配置

常见优化点：

- 压缩
- Tree Shaking
- 代码分割
- 长缓存文件名
- 资源内联阈值

---

## 20. Webpack 常见优化手段

- 缓存 loader 结果
- 缩小 loader 处理范围
- `splitChunks`
- 合理 Source Map
- 避免重复依赖打包

---

## 21. Vite 常见优化手段

- 合理拆包
- 动态导入
- 优化依赖预构建
- 控制大依赖引入方式

---

## 22. 何时选 Webpack，何时选 Vite

### 选 Vite

- 新项目
- 现代 Vue / React 项目
- 注重开发体验

### 选 Webpack

- 历史项目
- 构建链路定制很深
- 已深度依赖 Webpack 生态

---

## 23. 构建问题排查思路

- 配置是否生效
- loader / plugin 顺序
- alias 是否正确
- 环境变量是否正确注入
- 打包路径是否正确
- 大包来源是什么

---

## 24. 工程化最佳实践

- 新项目优先现代工具链
- 控制依赖体积
- 做代码分割
- 配置缓存策略
- 加入构建体积分析
