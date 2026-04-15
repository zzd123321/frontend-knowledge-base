# 网络与 HTTP 核心知识点

前端开发里的“网络”不只是会调接口。页面为什么慢、为什么跨域、为什么登录态丢失、为什么缓存不生效、为什么线上偶发超时，这些问题最后都会落到网络链路上。

如果把这一章学扎实，你会更容易理解：

- 浏览器发请求前后到底做了什么
- HTTP 为什么这样设计
- 缓存、跨域、Cookie、HTTPS 各自解决什么问题
- 出现报错时该先看哪里

---

## 1. 网络分层基础

实际开发里最常接触的是 TCP/IP 分层思想，而不是死背 OSI 七层。

- 应用层：HTTP、HTTPS、WebSocket、DNS
- 传输层：TCP、UDP
- 网络层：IP
- 链路层：数据链路、MAC、以太网

可以这样理解：

- 应用层决定“传什么、怎么组织数据”
- 传输层决定“怎么把数据从一端送到另一端”
- 网络层决定“数据往哪台机器走”
- 链路层负责“当前这一跳怎么传”

前端最关心的通常是应用层和传输层，但排障时往往会一路追到 DNS、TCP、TLS。

---

## 2. 从输入 URL 到页面显示

这是前端网络知识最重要的一条主线。

大致流程如下：

1. 浏览器解析 URL
2. 检查缓存、Service Worker、重定向规则
3. DNS 解析域名得到 IP
4. 建立 TCP 连接
5. 如果是 HTTPS，再进行 TLS 握手
6. 发送 HTTP 请求
7. 服务器处理并返回响应
8. 浏览器解析 HTML、CSS、JS
9. 继续请求子资源
10. 完成布局、绘制、合成，页面逐步呈现

其中几个经常被忽略的点：

- 页面展示不是“最后一次性出现”，而是渐进渲染
- 首屏速度不仅取决于接口快不快，还取决于资源依赖链是否过长
- 真实场景里还可能夹杂 CDN、缓存命中、重定向、预加载、懒加载

---

## 3. URL 结构与资源定位

一个完整 URL 示例：

```txt
https://example.com:443/path/list?id=1&sort=desc#detail
```

主要组成部分：

- 协议：`https`
- 主机：`example.com`
- 端口：`443`
- 路径：`/path/list`
- 查询参数：`id=1&sort=desc`
- 哈希：`#detail`

注意几个细节：

- 哈希不会被发送到服务器，主要给前端路由或页面锚点使用
- 查询参数会进入 URL，适合表达筛选、分页、搜索条件
- 路径通常表达资源位置，查询参数通常表达资源视图或条件

常见面试点：

- URI 是统一资源标识
- URL 是 URI 的子集，强调“定位”
- URN 强调“命名”，实际前端开发中较少直接接触

---

## 4. DNS 解析

DNS 的作用是把域名解析成 IP 地址。

因为浏览器真正建立连接依赖的是 IP，而不是人类更容易记忆的域名。

常见解析路径：

1. 浏览器缓存
2. 操作系统缓存
3. 路由器或本地 DNS
4. 递归 DNS 服务器
5. 根域名服务器
6. 顶级域服务器
7. 权威 DNS 服务器

前端需要知道的重点不是每一跳细节，而是：

- DNS 解析本身需要时间
- 域名过多会增加解析开销
- 不同域名的静态资源会增加额外连接成本
- CDN 常通过 DNS 调度，把请求导向距离更近或更空闲的节点

常见优化：

- `dns-prefetch`：提前做 DNS 解析
- `preconnect`：提前做 DNS + TCP + TLS
- 合理控制第三方域名数量

---

## 5. TCP 与 UDP

### TCP

TCP 是面向连接、可靠传输、保证顺序的协议。

它做了很多事：

- 建立连接
- 确认收发能力
- 丢包重传
- 流量控制
- 拥塞控制
- 按序组装数据

所以 TCP 更适合：

- HTTP / HTTPS
- 文件传输
- 数据库连接
- 邮件、SSH 等可靠性优先场景

### UDP

UDP 是无连接的，更轻量，不保证可靠和顺序。

它的特点：

- 开销小
- 延迟低
- 无需先建立连接
- 适合容忍少量丢包的场景

常见应用：

- 实时音视频
- 在线游戏
- DNS 查询
- QUIC / HTTP/3 的底层传输

一句话理解：

- TCP 更像“确保送达的快递”
- UDP 更像“尽快送出的广播”

---

## 6. TCP 三次握手与四次挥手

### 三次握手

建立连接前，双方需要确认彼此的发送和接收能力。

简化理解：

1. 客户端说：我要连接你
2. 服务端说：我收到了，我也准备好了
3. 客户端说：我也收到了你的确认

为什么不是两次：

- 两次不足以确认双方都具备双向通信能力
- 三次是建立可靠连接前的双向确认

### 四次挥手

关闭连接时，双方的“发送结束”要分别确认，所以通常是四次。

要点：

- 一端说“我发完了”
- 另一端确认“我知道你发完了”
- 另一端可能还在发剩余数据
- 最后它再说“我也发完了”

这也是为什么“建立连接”和“关闭连接”的过程不对称。

---

## 7. 长连接、短连接与 Keep-Alive

HTTP/1.0 默认更接近短连接，请求完成后连接很快关闭。

HTTP/1.1 默认支持持久连接，也就是常说的 Keep-Alive。

好处：

- 减少反复握手成本
- 降低延迟
- 更适合一个页面上连续请求多个资源

注意：

- Keep-Alive 不是“永不关闭”
- 服务端和客户端都可能设置空闲超时
- 长连接过多也会占用服务器资源

前端看到的效果通常是：

- 同一站点多个请求可能复用已有连接
- DevTools 里请求耗时结构可能因此不同

---

## 8. HTTP 基础与报文结构

HTTP 是应用层协议，核心是“请求 - 响应”模型。

特点：

- 简单
- 可扩展
- 无状态
- 对资源友好

一个请求通常包含：

- 请求行：方法、路径、协议版本
- 请求头：元信息
- 请求体：提交的数据

示例：

```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer token

{"name":"Tom"}
```

一个响应通常包含：

- 状态行
- 响应头
- 响应体

示例：

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache

{"id":1,"name":"Tom"}
```

---

## 9. HTTP 方法与语义

常见方法：

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`
- `HEAD`

常见语义：

- `GET`：读取资源
- `POST`：提交数据或触发动作
- `PUT`：整体更新或替换
- `PATCH`：部分更新
- `DELETE`：删除资源
- `OPTIONS`：询问服务器支持哪些方法或跨域策略
- `HEAD`：只取响应头，不取响应体

### 安全性与幂等性

这两个概念很重要。

安全方法强调“不会修改服务器资源状态”，典型是：

- `GET`
- `HEAD`
- `OPTIONS`

幂等方法强调“多次调用结果一致”，典型是：

- `GET`
- `PUT`
- `DELETE`

注意：

- 幂等不代表不会报错
- `POST` 通常不幂等，但业务上也可以通过幂等键做到“效果幂等”

---

## 10. GET、POST、PUT、PATCH 的区别

### `GET`

- 主要用于获取资源
- 参数通常放在 URL
- 更容易被缓存、收藏、分享

### `POST`

- 主要用于提交数据或触发处理
- 数据通常放在请求体中
- 常用于创建、登录、提交表单

### `PUT`

- 语义上更偏向整体替换
- 多次相同更新请求通常应表现为幂等

### `PATCH`

- 语义上更偏向局部修改
- 只提交改动字段更常见

常见误区：

- `POST` 不天然比 `GET` 更安全，核心还是看是否使用 HTTPS、参数设计和服务端校验
- URL 长度限制更多是实现约束，不是 HTTP 协议本身死规定

---

## 11. 常见状态码

### 1xx

- `101 Switching Protocols`：协议切换，WebSocket 升级会见到

### 2xx 成功

- `200 OK`：请求成功
- `201 Created`：资源创建成功
- `202 Accepted`：请求已接受，但还没处理完成
- `204 No Content`：成功但没有响应体

### 3xx 重定向

- `301 Moved Permanently`：永久重定向
- `302 Found`：临时重定向
- `303 See Other`：让客户端改用 `GET`
- `304 Not Modified`：协商缓存命中
- `307 Temporary Redirect`：临时重定向且保留方法
- `308 Permanent Redirect`：永久重定向且保留方法

### 4xx 客户端错误

- `400 Bad Request`：参数或格式有误
- `401 Unauthorized`：未认证或认证失效
- `403 Forbidden`：已认证但无权限
- `404 Not Found`：资源不存在
- `405 Method Not Allowed`：方法不被允许
- `408 Request Timeout`：请求超时
- `409 Conflict`：资源状态冲突
- `413 Payload Too Large`：请求体太大
- `415 Unsupported Media Type`：媒体类型不支持
- `429 Too Many Requests`：请求过多，被限流

### 5xx 服务端错误

- `500 Internal Server Error`
- `501 Not Implemented`
- `502 Bad Gateway`
- `503 Service Unavailable`
- `504 Gateway Timeout`

前端最常用的辨析：

- `401`：你没登录或登录态失效
- `403`：你登录了，但没权限
- `404`：路径不对或资源不存在
- `502` / `504`：常常和网关、代理、上游服务异常有关

---

## 12. 常见请求头与响应头

### 常见请求头

- `Accept`：希望接收什么类型
- `Content-Type`：请求体是什么格式
- `Authorization`：认证信息
- `Cookie`：浏览器自动携带的 Cookie
- `Origin`：当前请求来源
- `Referer`：从哪个页面跳过来
- `User-Agent`：客户端环境信息
- `If-None-Match`：协商缓存用
- `If-Modified-Since`：协商缓存用

### 常见响应头

- `Content-Type`
- `Content-Length`
- `Cache-Control`
- `ETag`
- `Last-Modified`
- `Set-Cookie`
- `Location`
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`

实际排障时经常看这几类信息：

- 类型对不对：`Content-Type`
- 缓存策略对不对：`Cache-Control`
- 是否跨域：`Access-Control-*`
- 是否下发登录态：`Set-Cookie`
- 是否重定向：`Location`

---

## 13. 请求体常见格式

前端最常接触的请求体并不是只有 JSON。

### `application/json`

最常见于前后端分离接口。

```json
{"name":"Tom","age":18}
```

特点：

- 结构清晰
- 后端解析方便
- 跨域时常触发预检

### `application/x-www-form-urlencoded`

表单场景常见，格式像查询字符串。

```txt
name=Tom&age=18
```

### `multipart/form-data`

文件上传常见。

特点：

- 支持文件
- 浏览器会自动带 boundary
- 手动设置 `Content-Type` 时要小心，不要破坏 boundary

---

## 14. HTTP 为什么是无状态的

HTTP 无状态的意思是：

- 协议层面不会自动记住前后请求的业务上下文
- 服务器默认不会天然知道两次请求是不是同一用户

无状态的好处：

- 协议简单
- 服务端更容易扩容
- 代理、中间层更容易工作

但业务通常需要“记住你是谁”，所以要通过额外机制补状态。

常见方案：

- Cookie
- Session
- Token
- JWT

更准确地说：

- HTTP 协议无状态
- 应用层自己构建会话状态

---

## 15. Cookie、Session、Token、JWT

### Cookie

Cookie 是浏览器保存的一小段数据，会在满足规则时自动附带到请求里。

重点：

- 它是存储与携带机制
- 它本身不等于登录方案

### Session

Session 一般存在服务端。

典型流程：

1. 用户登录成功
2. 服务端创建会话
3. 返回一个 Session ID 给浏览器
4. 浏览器后续通过 Cookie 携带这个 ID
5. 服务端据此找到对应用户会话

### Token

Token 是服务端签发给客户端的凭证，客户端通常主动放在请求头中携带。

比如：

```http
Authorization: Bearer xxxxx
```

### JWT

JWT 是一种 Token 格式，不是所有 Token 都是 JWT。

它通常由三部分组成：

- Header
- Payload
- Signature

注意：

- JWT 的 Payload 默认只是可解码，不是天然保密
- 不要把敏感信息直接放进 JWT

---

## 16. Cookie 常见属性

- `Expires`：绝对过期时间
- `Max-Age`：相对过期时间
- `HttpOnly`：禁止 JS 读取，降低 XSS 窃取风险
- `Secure`：仅在 HTTPS 下发送
- `SameSite`：限制跨站请求携带 Cookie
- `Domain`：可作用的域
- `Path`：可作用的路径

### `SameSite`

常见取值：

- `Strict`：最严格，跨站几乎不带
- `Lax`：相对平衡，很多默认策略接近它
- `None`：允许跨站，但必须配合 `Secure`

这和 CSRF 防护强相关。

---

## 17. HTTPS 与 TLS

HTTPS = HTTP + TLS。

它主要解决三个问题：

- 机密性：防止窃听
- 完整性：防止篡改
- 身份认证：确认你连的真是目标网站

### TLS 握手可以粗略理解为

1. 客户端发起安全连接请求
2. 服务端返回证书和协商参数
3. 客户端验证证书可信性
4. 双方协商出会话密钥
5. 后续用对称加密传输数据

前端需要理解的重点：

- HTTPS 不只是“加密一下”
- 没有证书校验，就无法真正防中间人攻击
- 页面如果是 HTTPS，却加载 HTTP 资源，会产生混合内容问题

---

## 18. HTTPS 相关补充

### 证书

证书由可信 CA 签发，用来证明“这个域名确实属于这个服务器”。

### HSTS

`Strict-Transport-Security` 用于告诉浏览器：

- 以后这个站点只能走 HTTPS
- 避免被降级到 HTTP

### 混合内容

如果 HTTPS 页面里引用了 HTTP 的脚本、图片、接口，浏览器会警告甚至阻止。

原因很直接：

- 主页面虽然安全
- 但子资源不安全，整体仍可能被攻击

---

## 19. 浏览器缓存总览

缓存是前端性能优化里最划算的一环。

从网络角度看，缓存大致可分为：

- 强缓存
- 协商缓存

从浏览器存储位置角度，还可能看到：

- Memory Cache
- Disk Cache
- Service Worker Cache

### 强缓存

命中时浏览器直接用本地资源，不向服务器发请求。

相关头：

- `Cache-Control`
- `Expires`

### 协商缓存

浏览器先问服务器资源有没有变化，如果没变，返回 `304`，继续使用本地缓存。

相关头：

- `ETag` / `If-None-Match`
- `Last-Modified` / `If-Modified-Since`

---

## 20. `Cache-Control` 常见指令

- `max-age=3600`：资源在 3600 秒内可直接使用
- `s-maxage`：给共享缓存使用
- `public`：响应可被中间缓存保存
- `private`：只允许浏览器缓存，不允许共享缓存
- `no-cache`：可以缓存，但每次使用前必须验证
- `no-store`：完全不缓存
- `must-revalidate`：过期后必须去服务器验证

最容易混淆的是：

- `no-cache` 不是“不缓存”
- `no-store` 才是“不要存”

前端常见实践：

- 带 hash 的静态资源用长缓存
- HTML 入口页通常不做长期强缓存
- 业务接口根据实时性决定是否允许缓存

---

## 21. 协商缓存：`ETag` 与 `Last-Modified`

### `Last-Modified`

基于时间戳。

优点：

- 简单
- 成本低

缺点：

- 秒级精度可能不够
- 内容没变但时间变了，也可能误判

### `ETag`

基于资源内容特征生成标识。

优点：

- 更精确

缺点：

- 生成和比较成本可能更高

常见组合策略：

- 静态资源文件名带 hash，优先强缓存
- 接口或 HTML 用协商缓存做兜底

---

## 22. 强缓存与协商缓存的执行顺序

浏览器拿到一个资源时，大致这样判断：

1. 先看是否命中强缓存
2. 如果强缓存有效，直接使用本地资源
3. 如果强缓存失效，再走协商缓存
4. 如果服务端返回 `304`，继续使用本地缓存
5. 如果返回新资源，再更新缓存内容

所以：

- 强缓存优先级更高
- `304` 说明发出了请求，只是资源没变
- “From memory cache” 和 “304” 不是一回事

---

## 23. 跨域与同源策略

同源要求三者完全一致：

- 协议
- 域名
- 端口

只要有一个不同，就可能是跨域。

例如：

- `https://a.com` 请求 `https://api.a.com`
- `http://a.com` 请求 `https://a.com`
- `https://a.com:3000` 请求 `https://a.com:8080`

这些都不算同源。

关键理解：

- 跨域是浏览器的安全限制
- 不是 HTTP 协议限制
- 也不是“服务器不能返回数据”

很多时候请求其实已经到服务器了，只是浏览器不让前端脚本读取响应。

---

## 24. CORS

CORS 是现代浏览器跨域访问的标准机制。

核心思想：

- 浏览器默认不允许随意跨域读数据
- 但如果服务器用响应头明确授权，浏览器就允许读取

常见响应头：

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`
- `Access-Control-Expose-Headers`
- `Access-Control-Max-Age`

### 凭证请求

如果前端要带 Cookie：

- `fetch` 里要设置 `credentials`
- 服务端不能把 `Access-Control-Allow-Origin` 设为 `*`
- 还要返回 `Access-Control-Allow-Credentials: true`

这几个条件少一个都不行。

---

## 25. 简单请求与预检请求

### 简单请求

通常满足以下条件才算简单请求：

- 方法是 `GET`、`HEAD`、`POST`
- 没有自定义请求头
- `Content-Type` 是浏览器允许的简单类型之一

简单类型通常包括：

- `text/plain`
- `application/x-www-form-urlencoded`
- `multipart/form-data`

### 预检请求

如果请求不满足简单请求条件，浏览器通常会先发一个 `OPTIONS` 请求，询问服务器：

- 这个源能不能访问
- 这个方法能不能用
- 这些请求头能不能带

常见触发条件：

- 使用 `PUT`、`PATCH`、`DELETE`
- 设置了自定义请求头
- `Content-Type: application/json`

重要结论：

- 预检失败时，正式请求不会继续发
- 所以看到“CORS 报错”时，不一定是业务接口本身坏了，可能只是预检没过

---

## 26. JSONP、代理、`postMessage`

跨域并不只有 CORS 一个话题。

### JSONP

原理：

- 利用 `<script>` 标签可跨域加载资源
- 只支持 `GET`

现在基本只在历史系统中偶尔见到。

### 开发代理

本地开发最常见的解决方式其实是代理。

例如 Vite / Webpack Dev Server 把：

- 前端请求 `/api`
- 代理到真实后端服务

这不是浏览器跨域能力变强了，而是把“跨域请求”变成了“同源请求 + 服务端转发”。

### `postMessage`

适合不同窗口、iframe、微前端应用之间通信，不是拿来替代 HTTP 跨域读接口的。

---

## 27. HTTP/1.1、HTTP/2、HTTP/3

### HTTP/1.1

特点：

- 文本协议
- 支持长连接
- 同一连接中存在队头阻塞问题
- 头部重复发送较多

以前为了缓解问题，前端常做：

- 资源合并
- 域名分片
- 雪碧图

### HTTP/2

核心改进：

- 二进制分帧
- 多路复用
- 头部压缩
- 服务端推送

前端理解重点：

- 多个请求可复用同一连接并行传输
- 过去很多为 HTTP/1.1 设计的优化手段，在 HTTP/2 下未必继续收益明显

### HTTP/3

HTTP/3 基于 QUIC，而 QUIC 基于 UDP。

优势方向：

- 更快建立连接
- 更好应对弱网和丢包
- 改善传输层队头阻塞

结论不是“版本越高越神奇”，而是：

- 协议在持续追求更低延迟和更高利用率

---

## 28. WebSocket、SSE、轮询

### 轮询

客户端定时发请求问服务器有没有新数据。

问题：

- 空请求多
- 延迟高
- 开销大

### 长轮询

客户端发出请求后，服务器不立刻返回，而是等有结果再返回。

比普通轮询更高效，但本质仍是 HTTP 请求反复往返。

### WebSocket

特点：

- 长连接
- 全双工
- 服务器可主动推送

适合：

- 聊天
- 协同编辑
- 行情推送
- 实时通知

### SSE

Server-Sent Events 是服务器到客户端的单向推送。

适合：

- 日志流
- 进度流
- 通知流

如果只需要“服务端推客户端”，SSE 有时比 WebSocket 更简单。

---

## 29. 浏览器请求 API：`fetch` 相关细节

现代前端大多基于 `fetch` 或对它的封装。

几个常见细节：

- `fetch` 默认只有网络层失败才会 `reject`
- `404`、`500` 这类 HTTP 错误通常仍会进入成功分支，需要手动判断 `response.ok`
- 请求可通过 `AbortController` 取消
- 跨域带 Cookie 需要设置 `credentials`

示例：

```js
const controller = new AbortController()

const response = await fetch('/api/user', {
  method: 'GET',
  credentials: 'include',
  signal: controller.signal,
})

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`)
}
```

---

## 30. 前端请求性能优化

优化请求不只是“压缩一下”。

### 链路层面

- 使用 CDN
- 开启 Gzip / Brotli
- 合理使用 HTTP/2 或 HTTP/3
- 使用就近节点和缓存

### 缓存层面

- 静态资源文件名带 hash
- 接口做合理缓存
- 避免重复请求同一数据

### 业务层面

- 请求去重
- 合并请求
- 取消失效请求
- 控制并发数量
- 避免瀑布流依赖
- 按需加载与预取结合

### 资源提示

- `dns-prefetch`
- `preconnect`
- `preload`
- `prefetch`

它们不是一回事：

- `dns-prefetch` 最轻，只做 DNS
- `preconnect` 更重，连 TCP/TLS 也提前做
- `preload` 是当前页面很快就要用
- `prefetch` 是未来页面可能会用

---

## 31. 常见网络安全问题

前端和网络强相关的安全问题主要有：

### XSS

攻击者把恶意脚本注入页面并执行。

后果：

- 窃取用户信息
- 篡改页面
- 冒用用户操作

防护：

- 输入输出转义
- 富文本白名单过滤
- CSP
- 避免危险的 DOM 注入方式

### CSRF

攻击者利用用户已登录身份，在用户不知情时发起请求。

防护：

- `SameSite` Cookie
- CSRF Token
- `Origin` / `Referer` 校验
- 关键操作二次确认

### 中间人攻击

通信被拦截或篡改。

防护核心：

- HTTPS
- 证书校验
- HSTS

---

## 32. DevTools 中常见网络现象

### `200`

正常返回新资源。

### `304`

发了请求，但服务端确认资源没变，继续用本地缓存。

### `from memory cache`

直接命中内存缓存，通常连请求都不会真正发出。

### `from disk cache`

直接从磁盘缓存读取。

### `blocked`

可能是连接数限制、优先级调度、CORS、混合内容或浏览器策略导致。

### `stalled`

请求在真正发送前等待了一段时间，可能是在等连接复用、代理、队列调度。

会读这些字段，排障效率会高很多。

---

## 33. 网络问题排查思路

遇到“接口挂了”时，不要只盯着控制台报错。

建议按下面顺序排查：

1. URL 是否正确
2. 方法是否正确
3. 请求参数是否正确
4. 请求头是否符合预期
5. 是否跨域或预检失败
6. 状态码是什么
7. 响应体是什么
8. 是否命中缓存
9. DNS、证书、代理是否有问题
10. 问题在浏览器、前端代码、网关还是后端服务

排查时重点看：

- Network 面板中的 Timing
- Request Headers / Response Headers
- Preview / Response
- Console 中的 CORS、Mixed Content、Certificate 报错

---

## 34. 前端需要形成的几个正确认知

- 跨域不是“请求发不出去”，而是浏览器可能不让你读结果
- `304` 不是错误，而是缓存协商成功
- `no-cache` 不是“不缓存”
- `POST` 不等于安全
- `HTTPS` 不只是加密，还包含身份认证和防篡改
- `Token` 不等于 `JWT`
- `Cookie` 不等于 `Session`
- HTTP 无状态，不代表业务不能有状态

---

## 35. 学这一章时最值得掌握的主线

如果你只抓一条主线，就抓这条：

1. 浏览器如何发出请求
2. 请求如何到达服务器
3. 服务器如何通过 HTTP 返回资源
4. 浏览器如何基于缓存、跨域、安全策略处理响应
5. 页面如何在真实网络条件下稳定、快速、安全地工作

把这条线打通之后，网络与 HTTP 就不再是一堆碎概念，而是一整套能支撑前端开发、优化和排障的底层能力。
