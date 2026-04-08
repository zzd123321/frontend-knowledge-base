# 网络与 HTTP 核心知识点

前端开发中的“网络”通常重点指 HTTP、HTTPS、浏览器缓存、跨域、Cookie、会话、DNS、TCP/UDP、HTTP/2/3、请求优化等。即使不做后端，理解网络原理仍然非常重要，因为接口请求、性能优化、安全控制和线上排障都离不开这些知识。

---

## 1. TCP/IP 基本认知

实际开发中更常接触 TCP/IP 分层思想：

- 应用层：HTTP、HTTPS、WebSocket、DNS
- 传输层：TCP、UDP
- 网络层：IP
- 链路层：数据链路

---

## 2. URL 结构

```txt
https://example.com:443/path/list?id=1#detail
```

组成部分：

- 协议
- 主机
- 端口
- 路径
- 查询参数
- 哈希

---

## 3. DNS 解析

DNS 的作用是把域名解析为 IP 地址。

常见解析顺序：

1. 浏览器缓存
2. 系统缓存
3. 本地 DNS
4. 递归到权威 DNS

---

## 4. TCP 与 UDP

### TCP

- 面向连接
- 可靠传输
- 有序

### UDP

- 无连接
- 不保证可靠和顺序
- 开销更小

HTTP 通常基于 TCP。

---

## 5. TCP 三次握手与四次挥手

### 三次握手

用于确认双方收发能力并建立连接。

### 四次挥手

用于关闭连接，因为双方关闭发送能力需要分别确认。

---

## 6. HTTP 基础

HTTP 是应用层协议，特点包括：

- 请求响应模型
- 无状态
- 可扩展

请求报文通常包含：

- 请求行
- 请求头
- 请求体

响应报文通常包含：

- 状态行
- 响应头
- 响应体

---

## 7. HTTP 方法

常见方法：

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`
- `HEAD`

---

## 8. HTTP 状态码

常见状态码：

- `200`
- `201`
- `204`
- `301`
- `302`
- `304`
- `400`
- `401`
- `403`
- `404`
- `409`
- `500`
- `502`
- `503`
- `504`

---

## 9. 常见请求头与响应头

### 请求头

- `Accept`
- `Content-Type`
- `Authorization`
- `Cookie`
- `Origin`

### 响应头

- `Content-Type`
- `Cache-Control`
- `Set-Cookie`
- `ETag`
- `Last-Modified`
- `Access-Control-Allow-Origin`

---

## 10. GET 与 POST 的区别

语义上：

- `GET` 用于获取资源
- `POST` 用于提交数据

常见差异：

- `GET` 参数通常在 URL
- `POST` 数据通常在请求体
- `GET` 更容易被缓存

---

## 11. HTTP 无状态与会话保持

HTTP 默认不会记住上一次请求上下文，因此需要：

- Cookie
- Session
- Token
- JWT

---

## 12. Cookie

Cookie 会随同域请求发送。

常见属性：

- `Expires`
- `Max-Age`
- `HttpOnly`
- `Secure`
- `SameSite`

---

## 13. HTTPS

HTTPS = HTTP + TLS

作用：

- 加密传输
- 身份认证
- 防止篡改

---

## 14. 浏览器缓存

缓存分为：

- 强缓存
- 协商缓存

### 强缓存

常见头：

- `Cache-Control`
- `Expires`

### 协商缓存

常见头：

- `ETag` / `If-None-Match`
- `Last-Modified` / `If-Modified-Since`

---

## 15. `Cache-Control`

常见值：

- `max-age`
- `no-cache`
- `no-store`
- `public`
- `private`

重点区别：

- `no-cache`：可缓存，但使用前需验证
- `no-store`：不缓存

---

## 16. 跨域与同源策略

同源要求：

- 协议相同
- 域名相同
- 端口相同

跨域限制本质是浏览器同源策略。

---

## 17. CORS

CORS 是现代跨域主流方案。

关键响应头：

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

---

## 18. 预检请求

以下情况常触发 `OPTIONS` 预检：

- 使用 `PUT`、`DELETE`
- 自定义请求头
- `Content-Type: application/json`

---

## 19. JSONP

JSONP 利用 `<script>` 标签跨域能力实现，只支持 GET。  
现代项目通常已被 CORS 取代。

---

## 20. WebSocket

WebSocket 提供长连接、全双工通信能力，适合：

- 即时聊天
- 实时协作
- 实时推送

---

## 21. HTTP/1.1、HTTP/2、HTTP/3

### HTTP/1.1

- 长连接
- 存在队头阻塞

### HTTP/2

- 二进制分帧
- 多路复用
- 头部压缩

### HTTP/3

- 基于 QUIC
- 底层 UDP

---

## 22. 网络安全基础

前端常见网络安全问题：

- XSS
- CSRF
- 中间人攻击

常见防护：

- HTTPS
- `HttpOnly`
- `SameSite`
- Token / CSRF Token
- 输入输出转义

---

## 23. 请求性能优化

常见方式：

- 利用缓存
- 减少请求数量
- 懒加载
- 资源压缩
- CDN
- DNS 预解析
- HTTP/2

---

## 24. 网络问题排查思路

常见排查维度：

- DNS 是否正常
- 状态码
- 请求头和响应头
- 是否跨域
- 是否命中缓存
- 是否证书问题
