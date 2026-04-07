# JavaScript 核心知识点

本文档系统梳理 JavaScript 核心概念，从基础语法到高级特性，包含大量代码示例和最佳实践。

---

## 1. 基础语法与数据类型

JavaScript 中有两种数据类型：**原始类型**（Primitive）和**引用类型**（Reference）。理解它们的区别是避免 bug 的关键。

**核心区别：**
- 原始类型存储的是值本身，赋值时复制值；引用类型存储的是内存地址，赋值时复制引用
- 原始类型不可变（修改会创建新值），引用类型可变，修改会影响所有引用

### 原始类型 vs 引用类型

```javascript
// 原始类型（Primitive）- 7种
const str = 'hello'      // string
const num = 42           // number
const bool = true        // boolean
const n = null           // null
const u = undefined      // undefined
const sym = Symbol()     // symbol
const big = 9007199254740991n  // bigint

// 引用类型（Reference）
const obj = { name: 'Tom' }     // object
const arr = [1, 2, 3]          // array (object)
const fn = function() {}       // function (object)

// 赋值差异示例
let a = 1
let b = a
b = 2
console.log(a)  // 1（a 不受影响）

let obj1 = { x: 1 }
let obj2 = obj1
obj2.x = 2
console.log(obj1.x)  // 2（obj1 也被修改）
```

**关键要点：**
- 基本类型比较的是值，`{} === {}` 为 false（不同内存地址）
- 数组和函数也是对象，`typeof []` 返回 `'object'`

### 类型检测

JavaScript 提供了多种类型检测方法，各有适用场景：

- **`typeof`**：适合检测基本类型，但对 `null` 和数组有缺陷
- **`instanceof`**：检测原型链关系，适合判断自定义类和继承关系
- **`Object.prototype.toString`**：最准确的方法，能区分所有类型

```javascript
// typeof - 检测基本类型
// 优点：简单快速；缺点：null 判定为 object，无法区分数组和对象
typeof 'hello'      // 'string'
typeof 42           // 'number'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof Symbol()     // 'symbol'
typeof 1n           // 'bigint'
typeof null         // 'object' (历史遗留 bug，无法修复)
typeof {}           // 'object'
typeof []           // 'object'（无法区分数组和普通对象）
typeof (() => {})   // 'function'

// instanceof - 检测原型链关系（不能检测基本类型）
// 原理：检查右侧构造函数的 prototype 是否在左侧对象的原型链上
[] instanceof Array           // true
[] instanceof Object          // true（数组继承自 Object）
new Date() instanceof Date    // true
'a' instanceof String         // false（原始值不是实例）

// Object.prototype.toString - 最准确的类型检测方法
// 原理：调用对象内部的 [[Class]] 属性
Object.prototype.toString.call([])           // '[object Array]'
Object.prototype.toString.call({})           // '[object Object]'
Object.prototype.toString.call(null)         // '[object Null]'
Object.prototype.toString.call(undefined)    // '[object Undefined]'
Object.prototype.toString.call(new Date())   // '[object Date]'

// 封装通用类型检测函数
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
getType([])     // 'array'
getType({})     // 'object'
getType(null)   // 'null'

// Array.isArray - ES5 新增，专门检测数组
Array.isArray([])     // true
Array.isArray({})     // false
```

**最佳实践：**
- 检测基本类型用 `typeof`（注意 `typeof null === 'object'` 是已知缺陷）
- 检测数组用 `Array.isArray()`
- 其他复杂情况用 `Object.prototype.toString.call()`

### 类型转换

JavaScript 是弱类型语言，类型转换非常灵活但也容易出错。分为**隐式转换**（自动）和**显式转换**（手动）。

**常见触发场景：**
- 算术运算（`+` 会触发字符串拼接，其他运算符转数字）
- 比较运算（`==` 会触发类型转换，`===` 不会）
- 逻辑运算（转布尔值）
- 条件判断（`if`、`while` 等转布尔值）

```javascript
// 隐式转换规则
1 + '2'        // '12'（+ 运算符，任一操作数是字符串则转字符串拼接）
'5' - 3        // 2（- 运算符，转数字计算）
'5' + 3        // '53'（字符串优先）
!!'hello'      // true（两次取反转布尔）
null == undefined  // true（规定 null 和 undefined 宽松相等）
0 == ''        // true（都转为数字 0 比较）
[] == false    // true（数组转数字为 0）

// 显式转换 - 更可控，推荐优先使用显式转换
// 转数字
Number('123')      // 123
Number('')         // 0
Number('  ')       // 0（空白字符串）
Number('abc')      // NaN（无法转换）
Number(null)       // 0
Number(undefined)  // NaN
Number(true)       // 1
Number(false)      // 0
Number([])         // 0（空数组）
Number([1, 2])     // NaN（非空数组）
Number({})         // NaN

// parseInt / parseFloat 提取数字（更宽松）
parseInt('123px')    // 123（遇到非数字停止）
parseInt('123', 16)  // 291（按16进制解析）
parseFloat('1.23em') // 1.23

// 转字符串
String(123)       // '123'
String(null)      // 'null'
String(undefined) // 'undefined'
(123).toString()  // '123'

// 转布尔 - 只有以下6个值转为 false（称为 "falsy"）
Boolean(0)        // false
Boolean('')       // false
Boolean(null)     // false
Boolean(undefined)// false
Boolean(NaN)      // false
Boolean(false)    // false
// 其他所有值都转为 true，包括：
Boolean([])       // true（空数组是 truthy）
Boolean({})       // true（空对象是 truthy）
Boolean(' ')      // true（含空格的字符串是 truthy）
```

**最佳实践：**
- 避免使用 `==`，改用 `===` 严格相等
- 需要类型转换时显式调用 `Number()`、`String()`、`Boolean()`
- 空数组和空对象转布尔是 `true`，这是常见坑点

---

## 2. 作用域与闭包

作用域定义了变量和函数的可访问范围。JavaScript 有**词法作用域**（静态作用域），即作用域在代码编写时确定。

**三种作用域类型：**
- **全局作用域**：全局访问，全局变量生命周期过长，应避免滥用
- **函数作用域**：`var` 声明的变量作用域为整个函数
- **块级作用域**：`let`/`const` 声明的变量只在 `{}` 块内有效

**关键概念：**
- 作用域链：查找变量时由内向外查找，直到全局作用域
- 变量提升：`var` 和函数声明会提升到作用域顶部

### 作用域类型

```javascript
// 全局作用域 - 任何地方都能访问
var globalVar = 'I am global'
let globalLet = 'I am also global'

function scopeDemo() {
  // 函数作用域 - var 声明的变量在整个函数内有效
  var funcVar = 'I am local'
  
  if (true) {
    // ES6 块级作用域 - let/const 只在 {} 内有效
    let blockVar = 'I am block scoped'
    const blockConst = 'I am constant'
    
    console.log(blockVar)    // ✓ 可访问（在块内）
    console.log(funcVar)     // ✓ 可访问（函数内）
  }
  
  console.log(funcVar)       // ✓ 可访问
  console.log(blockVar)      // ✗ ReferenceError: 块外访问 let 变量
}

// var 的陷阱 - 函数作用域不是块级作用域
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)  // 3, 3, 3（var 在全局）
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100)  // 0, 1, 2（每次循环新块）
}
```

### 变量提升

```javascript
// var 会提升，值为 undefined
console.log(a)   // undefined
var a = 1

// let/const 存在暂时性死区 (TDZ)
console.log(b)   // ReferenceError: Cannot access 'b' before initialization
let b = 2

// 函数声明提升
foo()   // 可以调用
function foo() {
  console.log('foo')
}

// 函数表达式不会提升
bar()   // TypeError: bar is not a function
var bar = function() {
  console.log('bar')
}
```

### 闭包

**闭包**是指函数能够记住并访问其词法作用域的能力，即使该函数在其词法作用域之外执行。

**形成条件：**
1. 函数嵌套（内部函数访问外部函数的变量）
2. 内部函数被返回或传递到外部
3. 内部函数在外部被调用

**闭包的作用：**
- 数据私有化：创建私有变量和方法
- 延长变量生命周期：函数执行后变量仍然存活
- 函数柯里化：参数复用和延迟执行

**闭包的缺点：**
- 内存泄漏风险：闭包保持对外部变量的引用，可能导致内存无法释放
- 性能影响：过多闭包会占用更多内存

```javascript
// 基础闭包示例
function createCounter() {
  let count = 0  // 外部函数变量
  
  // 返回的对象包含闭包函数
  return {
    increment() {
      return ++count  // 访问并修改外部变量
    },
    decrement() {
      return --count
    },
    getCount() {
      return count
    }
  }
}

const counter = createCounter()
counter.increment()  // 1
counter.increment()  // 2
counter.getCount()   // 2
// count 变量无法从外部直接访问，实现了私有化

// 每个闭包实例独立
const counter2 = createCounter()
counter2.increment()  // 1（独立的 count）

// 闭包陷阱：循环中引用
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)  // 3, 3, 3
}
// 原因：var 作用域是函数级，setTimeout 回调共享同一个 i

// 解决：使用 let 创建块级作用域
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)  // 0, 1, 2
}
// 或立即执行函数
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100)  // 0, 1, 2
  })(i)
}

const counter = createCounter()
counter.increment()  // 1
counter.increment()  // 2
counter.getCount()   // 2

// 模块模式
const Module = (function() {
  let privateVar = 'private'
  
  function privateMethod() {
    console.log(privateVar)
  }
  
  return {
    publicMethod() {
      privateMethod()
    }
  }
})()

// 柯里化
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
curry((a, b, c) => a + b + c)(1)(2)(3)  // 6
curry((a, b, c) => a + b + c)(1, 2)(3)  // 6
```

---

## 3. this 指向与执行上下文

`this` 是 JavaScript 中最令人困惑的概念之一。它不是在函数定义时绑定，而是在**函数调用时**动态绑定。

**核心原则：** this 指向谁，完全取决于函数的调用方式。

### this 绑定规则

绑定优先级（从高到低）：
1. **new 绑定**：this 指向新创建的实例
2. **显式绑定**：call/apply/bind 强制指定
3. **隐式绑定**：调用时的上下文对象
4. **默认绑定**：非严格模式 window，严格模式 undefined
5. **箭头函数**：继承定义时的外层 this

```javascript
// 1. 默认绑定（函数单独调用）
function defaultBinding() {
  console.log(this)  // window (非严格) / undefined (严格)
}
defaultBinding()  // 直接调用

// 2. 隐式绑定（作为对象方法调用）
const obj = {
  name: 'Tom',
  sayName() {
    console.log(this.name)  // this 指向调用者 obj
  }
}
obj.sayName()  // 'Tom'

// 3. 隐式丢失（函数被赋值后调用）
const say = obj.sayName  // 只是赋值，没有调用
say()  // undefined（this 丢失到全局）

// 4. 显式绑定（call/apply/bind 强制指定）
defaultBinding.call(obj)    // obj（call 立即执行，传参数列表）
defaultBinding.apply(obj)   // obj（apply 立即执行，传数组）
const bound = defaultBinding.bind(obj)  // bind 返回新函数
bound()  // obj（永久绑定，无法再次修改）

// 5. new 绑定
function Person(name) {
  this.name = name  // this 指向新创建的实例
}
const person = new Person('Tom')

// 6. 箭头函数（没有自己的 this！）
const arrow = {
  name: 'Arrow',
  regular: function() {
    console.log(this.name)  // 'Arrow'（this = 调用者）
  },
  arrow: () => {
    console.log(this.name)  // undefined（继承外层，可能是 window）
  }
}

// 箭头函数经典陷阱
const obj = {
  name: 'Tom',
  getName: () => this.name  // this != obj！
}
obj.getName()  // undefined（this 指向全局或外层）
```

**最佳实践：**
- 需要动态 this 时用普通函数，需要固定 this 时用箭头函数
- DOM 事件处理用普通函数，`this` 指向元素
- React/Vue 类组件方法需 bind 或使用箭头函数

### call / apply / bind 区别

```javascript
const obj = { name: 'Tom' }

// call - 参数列表
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation)
}
greet.call(obj, 'Hello', '!')  // 'Hello, Tom!'

// apply - 参数数组
greet.apply(obj, ['Hi', '?'])  // 'Hi, Tom?'

// bind - 返回新函数
const greetTom = greet.bind(obj, 'Hey')
greetTom('...')  // 'Hey, Tom...'

// 实现 bind
Function.prototype.myBind = function(context, ...args) {
  const fn = this
  return function(...args2) {
    return fn.apply(context, [...args, ...args2])
  }
}
```

---

## 4. 原型与继承

JavaScript 使用**原型继承**而非类继承（ES6 class 是语法糖）。理解原型链是理解 JavaScript 面向对象编程的关键。

**核心概念：**
- `prototype`：函数特有的属性，指向原型对象
- `__proto__`：对象的内部属性，指向创建它的构造函数的 prototype
- **原型链**：对象查找属性时沿着 `__proto__` 向上查找，直到 `null`

**为什么需要原型？**
- 节省内存：方法放在原型上，所有实例共享
- 实现继承：子类通过原型链访问父类方法

### 原型链

```javascript
// 构造函数
function Animal(name) {
  this.name = name  // 实例属性
}

// 原型方法 - 所有 Animal 实例共享
Animal.prototype.sayName = function() {
  console.log('My name is ' + this.name)
}

// 原型链关系验证
Animal.prototype.constructor === Animal  // true（prototype 反向指向构造函数）

const animal = new Animal('Leo')
animal.__proto__ === Animal.prototype   // true（实例的原型链）
Animal.prototype.__proto__ === Object.prototype  // true（继承 Object）
Object.prototype.__proto__ === null    // true（原型链终点）

// 属性查找示例
animal.sayName()   // 1. animal 自身无 sayName
                   // 2. animal.__proto__ 即 Animal.prototype 有 sayName ✓

animal.toString()  // 1. animal 自身无 toString
                   // 2. Animal.prototype 也无
                   // 3. Object.prototype.toString ✓

// 面试陷阱
console.log(Animal.__proto__ === Function.prototype)  // true（函数也是对象）
console.log(Function.prototype.__proto__ === Object.prototype)  // true

// 继承
function Dog(name, breed) {
  Animal.call(this, name)  // 借用父构造函数
  this.breed = breed
}

// 原型继承（ES5）
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

Dog.prototype.sayBreed = function() {
  console.log('I am a ' + this.breed)
}

const dog = new Dog('Buddy', 'Golden Retriever')
dog.sayName()   // 'My name is Buddy'
dog.sayBreed()  // 'I am a Golden Retriever'
dog instanceof Dog    // true
dog instanceof Animal // true
```

### ES6 Class

```javascript
// 类声明
class Animal {
  constructor(name) {
    this.name = name
  }
  
  sayName() {
    console.log('My name is ' + this.name)
  }
  
  // 静态方法
  static isAnimal(obj) {
    return obj instanceof Animal
  }
}

// 继承
class Dog extends Animal {
  constructor(name, breed) {
    super(name)  // 必须调用 super
    this.breed = breed
  }
  
  sayBreed() {
    console.log('I am a ' + this.breed)
  }
  
  // 重写父方法
  sayName() {
    super.sayName()
    console.log('Woof woof!')
  }
}

// 私有字段（ES2022）
class Counter {
  #count = 0  // 私有字段
  
  increment() {
    return ++this.#count
  }
  
  #privateMethod() {
    console.log('private')
  }
}

const counter = new Counter()
counter.#count  // SyntaxError: Private field cannot be accessed
```

---

## 5. 异步编程

JavaScript 是单线程语言，异步编程是处理 I/O 操作（网络请求、文件读写、定时器等）的关键。从回调函数到 Promise 再到 async/await，异步处理方式不断演进。

**为什么需要异步？**
- JavaScript 单线程执行，同步操作会阻塞 UI
- 网络请求、文件读写等操作耗时，需要异步处理避免页面卡顿

**发展历程：**
1. 回调函数（Callback）- 回调地狱问题
2. Promise（ES6）- 链式调用，解决回调地狱
3. Async/Await（ES2017）- 更优雅的异步代码写法

### Promise

Promise 是异步操作的最终完成（或失败）及其结果值的代理。它有三种状态：pending（进行中）、fulfilled（成功）、rejected（失败）。

**特点：**
- 状态一旦确定就不可改变
- 支持链式调用，解决回调地狱
- 更好的错误处理（统一的 catch）

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true
    if (success) {
      resolve('Success!')  // 成功，状态变为 fulfilled
    } else {
      reject(new Error('Failed!'))  // 失败，状态变为 rejected
    }
  }, 1000)
})

// 链式调用 - 避免回调地狱
fetch('/api/data')
  .then(response => response.json())  // 前一个 return 作为后一个参数
  .then(data => console.log(data))    // 处理数据
  .catch(error => console.error(error))  // 统一处理错误
  .finally(() => console.log('Done'))    // 无论成功失败都执行

// 链式调用
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'))

// Promise.all - 全部成功才 resolve
Promise.all([
  fetch('/api/1'),
  fetch('/api/2'),
  fetch('/api/3')
])
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(data => console.log(data))

// Promise.race - 第一个完成
Promise.race([
  fetch('/api/fast'),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
])

// Promise.any - 第一个成功
Promise.any([
  fetch('/api/1'),
  fetch('/api/2')
])

// Promise.allSettled - 等待全部完成
Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject('error')
])

// 实现 Promise.all
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let completed = 0
    
    promises.forEach((p, i) => {
      Promise.resolve(p).then(value => {
        results[i] = value
        completed++
        if (completed === promises.length) {
          resolve(results)
        }
      }, reject)
    })
  })
}
```

### Async/Await

```javascript
// 基础用法
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('HTTP error')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// 并行执行
async function fetchMultiple() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ])
  return { user, posts }
}

// 错误处理
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(1000 * Math.pow(2, i))  // 指数退避
    }
  }
}

// Top-level await (ES2022)
const data = await fetchData()

// Async 函数返回值始终是 Promise
async function returnValue() {
  return 42  // 被包装成 Promise.resolve(42)
}
```

### 事件循环

**事件循环（Event Loop）** 是 JavaScript 实现异步编程的核心机制，协调调用栈、消息队列和微任务队列。

**核心概念：**
- **调用栈（Call Stack）**：执行同步代码，后进先出
- **宏任务队列（Macrotask Queue）**：setTimeout、setInterval、I/O 等
- **微任务队列（Microtask Queue）**：Promise.then、MutationObserver、queueMicrotask

**执行顺序：**
1. 执行同步代码（清空调用栈）
2. 执行所有微任务（直至微任务队列为空）
3. 执行一个宏任务
4. 重复步骤 2-3

**为什么先微任务？**
微任务设计用于高优先级操作（如 Promise），确保在当前宏任务结束后立即执行，避免 UI 阻塞。

```javascript
// 经典执行顺序示例
console.log('Start')              // 1. 同步，直接执行
setTimeout(() => {               // 2. 宏任务，加入宏任务队列
  console.log('Timeout')
}, 0)

Promise.resolve().then(() => {   // 3. 微任务，加入微任务队列
  console.log('Promise')
})

console.log('End')              // 4. 同步，直接执行

// 输出顺序：Start -> End -> Promise -> Timeout
// 原因：同步代码先执行，然后微任务，最后宏任务

// 更复杂的示例
console.log('1')                             // 同步
setTimeout(() => console.log('2'), 0)      // 宏任务
Promise.resolve().then(() => console.log('3'))  // 微任务
console.log('4')                             // 同步

// 输出：1 -> 4 -> 3 -> 2

// async/await 的执行（转换为 Promise）
async function demo() {
  console.log('A')           // 同步执行
  await Promise.resolve()    // 阻塞，将后续代码加入微任务
  console.log('B')           // 微任务执行
}
demo()
console.log('C')             // 同步执行
// 输出：A -> C -> B
// 解释：await 会暂停 async 函数，将后续代码作为微任务

---

## 6. ES6+ 新特性

ES6（ECMAScript 2015）是 JavaScript 历史上最重要的更新，后续每年发布一个新版本（ES2016+），带来了大量语法糖和新功能，让代码更简洁、可读性更强。

**主要改进：**
- 更简洁的语法（箭头函数、模板字符串、解构）
- 模块化支持（import/export）
- 新的数据结构（Map/Set、Symbol）
- 异步处理（Promise、async/await）

### 解构赋值

解构赋值是 ES6 引入的语法糖，允许从数组或对象中提取值并赋值给变量，使代码更简洁。

**使用场景：**
- 提取 API 响应数据
- 函数参数配置
- 交换变量值
- 配合展开运算符实现浅拷贝

```javascript
// 数组解构 - 按位置提取
const [a, b, ...rest] = [1, 2, 3, 4, 5]
// a=1, b=2, rest=[3,4,5]

const [first, , third] = ['a', 'b', 'c']  // 跳过元素
// first='a', third='c'

// 对象解构 - 按属性名提取（与顺序无关）
const { name, age = 25 } = { name: 'Tom' }  // age = 默认值
const { name: userName, age: userAge } = { name: 'Tom', age: 30 }  // 重命名

// 嵌套解构 - 提取深层属性
const { user: { email } } = { user: { email: 'tom@example.com' } }

// 函数参数解构 - 常用技巧
function createUser({ name, role = 'user' }) {
  return { name, role }
}

// 配合 rest 运算符提取剩余属性
const { id, ...data } = { id: 1, name: 'Tom', age: 25 }
// id=1, data={name:'Tom', age:25}

// 经典用法：变量交换
let x = 1, y = 2
;[x, y] = [y, x]  // x=2, y=1

// 解构失败保护
function drawChart({ size = 'big', cords = { x: 0, y: 0 } } = {}) {
  // 不传参数也不报错
}

### 展开运算符

```javascript
// 数组展开
const arr1 = [1, 2]
const arr2 = [3, 4]
const combined = [...arr1, ...arr2, 5, 6]
// [1, 2, 3, 4, 5, 6]

// 对象展开
const obj1 = { a: 1, b: 2 }
const obj2 = { ...obj1, c: 3, b: 4 }  // b 被覆盖
// { a: 1, b: 4, c: 3 }

// 函数参数
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}
sum(1, 2, 3, 4)  // 10

// 浅拷贝
const copy = [...original]
const objCopy = { ...original }

// 注意：深拷贝需要递归或使用库
const deep = JSON.parse(JSON.stringify(obj))  // 有缺陷
// 更好的深克隆
const deepClone = structuredClone(obj)
```

### 模块化

```javascript
// 导出 (module.js)
export const PI = 3.14159
export function circleArea(r) {
  return PI * r * r
}

const DEFAULT_TIMEOUT = 5000
export default DEFAULT_TIMEOUT

// 别名导出
export { circleArea as area }

// 重新导出
export { foo, bar } from './other-module.js'

// 导入
import DEFAULT_TIMEOUT, { PI, circleArea } from './module.js'
import * as math from './module.js'
import { default as timeout } from './module.js'

// 动态导入
async function loadModule() {
  const module = await import('./module.js')
  console.log(module.PI)
  
  // 条件加载
  if (condition) {
    const { feature } = await import('./feature.js')
  }
}
```

### 其他特性

```javascript
// 可选链 (ES2020)
const user = { profile: { name: 'Tom' } }
console.log(user?.profile?.name)    // 'Tom'
console.log(user?.settings?.theme) // undefined (不报错)

// 空值合并 ?? (ES2020)
const value = null ?? 'default'     // 'default'
const zero = 0 ?? 'default'         // 0 (不是 null/undefined)

// 与 || 区别
const empty = '' || 'default'       // 'default'
const empty2 = '' ?? 'default'      // '' (空字符串不是 null/undefined)

// 链判断 + 空值合并
const theme = user?.settings?.theme ?? 'light'

// BigInt (ES2020)
const big = 9007199254740991n
const bigger = big + 1n

// 数字分隔符
const million = 1_000_000

// Promise.allSettled
await Promise.allSettled([promise1, promise2])

// String 方法
'hello'.startsWith('he')   // true
'hello'.endsWith('lo')     // true
'hello'.includes('ll')     // true
'hello'.repeat(3)          // 'hellohellohello'
'  hello  '.trimStart()    // 'hello  '
'  hello  '.trimEnd()      // '  hello'
'  hello  '.trim()         // 'hello'

// Array 方法
[1, 2, 3].includes(2)      // true
[1, [2, 3], [4, [5, 6]]].flat(2)  // [1, 2, 3, 4, 5, 6]
[1, 2, [3, [4]]].flat(Infinity)

// flatMap = map + flat
const sentences = ['Hello world', 'Good morning']
sentences.flatMap(s => s.split(' '))  // ['Hello', 'world', 'Good', 'morning']

// Object.fromEntries
const entries = [['a', 1], ['b', 2]]
const obj = Object.fromEntries(entries)  // { a: 1, b: 2 }

// Object.entries
const obj2 = { a: 1, b: 2 }
Object.entries(obj2)  // [['a', 1], ['b', 2]]

// 迭代器
const set = new Set([1, 2, 3])
for (const value of set) {
  console.log(value)
}

// Map
const map = new Map()
map.set('key', 'value')
map.set({ id: 1 }, 'object key')

// WeakMap / WeakSet (垃圾回收友好)
const weakMap = new WeakMap()
let obj = {}
weakMap.set(obj, 'data')
obj = null  // 可被垃圾回收
```

---

## 7. 常用 API

### 数组方法

```javascript
const arr = [1, 2, 3, 4, 5]

// 遍历
arr.forEach(item => console.log(item))

// 映射
const doubled = arr.map(x => x * 2)  // [2, 4, 6, 8, 10]

// 过滤
const evens = arr.filter(x => x % 2 === 0)  // [2, 4]

// 归约
const sum = arr.reduce((acc, x) => acc + x, 0)  // 15
const max = arr.reduce((acc, x) => x > acc ? x : acc)

// 查找
arr.find(x => x > 3)       // 4
arr.findIndex(x => x > 3)  // 3
arr.some(x => x > 4)       // true
arr.every(x => x > 0)        // true
arr.includes(3)            // true

// 排序（改变原数组）
const sorted = [...arr].sort((a, b) => b - a)  // [5, 4, 3, 2, 1]

// 聚合
const grouped = arr.reduce((acc, x) => {
  const key = x % 2 === 0 ? 'even' : 'odd'
  acc[key] = [...(acc[key] || []), x]
  return acc
}, {})
// { odd: [1, 3, 5], even: [2, 4] }
```

### 对象方法

```javascript
const obj = { a: 1, b: 2, c: 3 }

// 获取键/值/条目
Object.keys(obj)      // ['a', 'b', 'c']
Object.values(obj)    // [1, 2, 3]
Object.entries(obj)   // [['a', 1], ['b', 2], ['c', 3]]

// 遍历
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key])
  }
}

// 合并
const merged = Object.assign({}, obj, { d: 4 })
// 或
const merged2 = { ...obj, d: 4 }

// 冻结/密封
const frozen = Object.freeze({ a: 1 })
frozen.a = 2  //静默失败（严格模式报错）

const sealed = Object.seal({ a: 1 })
sealed.a = 2     // ✓ 可以修改现有属性
sealed.b = 3     // ✗ 不能添加新属性

delete sealed.a  // ✗ 不能删除

// 属性描述符
Object.defineProperty(obj, 'readOnly', {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
})

// Getter/Setter
const person = {
  firstName: 'John',
  lastName: 'Doe',
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ')
  }
}
```

### 函数式编程工具

```javascript
// 函数组合
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const add1 = x => x + 1
const double = x => x * 2
const square = x => x * x

const composed = compose(square, double, add1)
composed(2)  // (2+1)*2)^2 = 36

const piped = pipe(add1, double, square)
piped(2)     // ((2+1)*2)^2 = 36

// 偏函数
const partial = (fn, ...presetArgs) => (...laterArgs) =>
  fn(...presetArgs, ...laterArgs)

// 记忆化
const memoize = fn => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// 防抖
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流
function throttle(fn, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 惰性求值
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
```

---

## 8. 错误处理与调试

### Error 类型

```javascript
// 内置错误类型
new Error('普通错误')
new SyntaxError('语法错误')
new ReferenceError('引用错误')
new TypeError('类型错误')
new RangeError('范围错误')
new URIError('URI 错误')

// 自定义错误
class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}
```

### try/catch/finally

```javascript
try {
  riskyOperation()
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.field)
  } else if (error instanceof TypeError) {
    console.error('Type error:', error.message)
  } else {
    console.error('Unknown error:', error)
    throw error  // 重新抛出
  }
} finally {
  // 总是执行
  cleanup()
}

// 异步错误处理
async function asyncOperation() {
  try {
    await mightFail()
  } catch (error) {
    console.error('Async error:', error)
  }
}

// Promise catch
fetch('/api')
  .then(handleResponse)
  .catch(handleError)
```

### 调试技巧

```javascript
// console 方法
console.log('message')
console.info('info')
console.warn('warning')
console.error('error')
console.table([{ a: 1, b: 2 }, { a: 3, b: 4 }])
console.dir(obj)  // 显示对象所有属性
console.time('timer')
// ...code
console.timeEnd('timer')  // timer: 1000ms

console.group(' Group')
console.log('item 1')
console.log('item 2')
console.groupEnd()

// 断点
debugger

// 追踪调用栈
function trace() {
  console.trace('Stack trace')
}
```

---

## 9. 正则表达式

### 基础语法

```javascript
// 创建方式
const regex1 = /abc/                    // 字面量
const regex2 = new RegExp('abc')        // 构造函数
const regex3 = new RegExp('abc', 'gi')  // 带标志

// 常用标志
// g - 全局匹配
// i - 忽略大小写
// m - 多行匹配
// s - dotAll 模式 (. 匹配换行符)
// u - Unicode 模式
// y - 粘性匹配
```

### 常用方法

```javascript
// test - 测试是否匹配
/abc/.test('abcde')      // true

// exec - 返回匹配详情
/\d+/.exec('abc123def')  // ['123', index: 3, input: 'abc123def']

// match - 字符串方法
'abc123def'.match(/\d+/)     // ['123']
'abc123def456'.match(/\d+/g) // ['123', '456']（全局）

// matchAll - 返回迭代器（ES2020）
const matches = 'abc123def456'.matchAll(/\d+/g)
for (const match of matches) {
  console.log(match[0])  // '123', '456'
}

// search - 返回索引
'hello world'.search(/world/)  // 6

// replace - 替换
'hello world'.replace(/world/, 'JS')           // 'hello JS'
'abc123def456'.replace(/\d+/g, '#')            // 'abc#def#'
'John Doe'.replace(/(\w+) (\w+)/, '$2, $1')    // 'Doe, John'

// replace 回调
'abc123def456'.replace(/\d+/g, (match) => parseInt(match) * 2)
// 'abc246def912'

// split - 分割
'a,b,c'.split(',')           // ['a', 'b', 'c']
'a,b;c|d'.split(/[,;|]/)     // ['a', 'b', 'c', 'd']
```

### 常用正则模式

```javascript
// 基本匹配
/abc/           // 匹配 "abc"
/[abc]/         // 匹配 "a" "b" 或 "c"
/[^abc]/        // 匹配非 "a" "b" "c"
/a|b/           // 匹配 "a" 或 "b"

// 元字符
/./             // 除换行外的任意字符
/\w/            // 单词字符 [a-zA-Z0-9_]
/\W/            // 非单词字符
/\d/            // 数字 [0-9]
/\D/            // 非数字
/\s/            // 空白字符
/\S/            // 非空白字符
/\b/            // 单词边界
/\B/            // 非单词边界

// 量词
/a+/            // 1个或多个
/a*/            // 0个或多个
/a?/            // 0个或1个
/a{3}/          // 恰好3个
/a{3,}/         // 至少3个
/a{3,5}/        // 3到5个

// 贪婪 vs 懒惰
/<.*>/          // 贪婪：匹配 "<div>content</div>"
/<.*?>/         // 懒惰：匹配 "<div>"

// 位置匹配
/^abc/          // 开始
/abc$/          // 结束
/(?=abc)/       // 正向前瞻
/(?!abc)/       // 负向前瞻
/(?<=abc)/      // 正向后顾（ES2018）
/(?<!abc)/      // 负向后顾（ES2018）

// 常用实战
// 邮箱
const email = /^[\w-.]+@[\w-]+\.[\w-.]+$/

// 手机号（中国大陆）
const phone = /^1[3-9]\d{9}$/

// URL
const url = /^(https?:\/\/)?[\w.-]+\.[\w.-]+[/\w\-._~:/?#[\]@!$&'()*+,;=]*$/

// IPv4
const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/

// 日期（YYYY-MM-DD）
const date = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

// 密码强度（8位以上，包含大小写和数字）
const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,}$/

// 提取 HTML 标签属性
const attr = /<\w+\s+([^>]+)>/g
// 提取 Markdown 链接
const mdLink = /\[([^\]]+)\]\(([^)]+)\)/g
```

---

## 10. 设计模式

设计模式是解决常见软件设计问题的通用解决方案。掌握设计模式能帮助我们写出更高质量、可维护的代码。

**设计模式分类：**
- **创建型模式**：处理对象创建机制，如单例、工厂
- **结构型模式**：处理对象组合，如代理、适配器
- **行为型模式**：处理对象交互，如观察者、策略

**使用原则：**
- 不要过度设计，简单问题用简单方案
- 模式是工具，不是教条
- 理解原理比死记硬背重要

### 创建型模式

创建型模式处理对象的创建机制，试图以最合适的方式创建对象。

```javascript
// 单例模式 - 确保类只有一个实例，并提供全局访问点
// 使用场景：配置对象、数据库连接池、全局状态管理
class Singleton {
  static instance = null
  
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
  
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance
    }
    Singleton.instance = this
  }
}

// 工厂模式 - 封装对象创建逻辑，根据类型创建不同对象
// 使用场景：根据配置创建不同组件、插件系统
class UserFactory {
  static create(type) {
    switch(type) {
      case 'admin': return new Admin()
      case 'member': return new Member()
      default: throw new Error('Unknown user type')
    }
  }
}

// 建造者模式 - 链式调用构建复杂对象
// 使用场景：构造复杂配置、API 请求构建
class RequestBuilder {
  constructor() {
    this.url = ''
    this.method = 'GET'
    this.headers = {}
    this.body = null
  }
  
  setUrl(url) {
    this.url = url
    return this  // 返回自身，支持链式调用
  }
  
  setMethod(method) {
    this.method = method
    return this
  }
  
  setHeader(key, value) {
    this.headers[key] = value
    return this
  }
  
  setBody(body) {
    this.body = body
    return this
  }
  
  build() {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
  static instance = null
  
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
  
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance
    }
    Singleton.instance = this
  }
}

// 工厂模式
class UserFactory {
  static create(type) {
    switch(type) {
      case 'admin': return new Admin()
      case 'member': return new Member()
      default: throw new Error('Unknown user type')
    }
  }
}

// 建造者模式
class RequestBuilder {
  constructor() {
    this.url = ''
    this.method = 'GET'
    this.headers = {}
    this.body = null
  }
  
  setUrl(url) {
    this.url = url
    return this
  }
  
  setMethod(method) {
    this.method = method
    return this
  }
  
  setHeader(key, value) {
    this.headers[key] = value
    return this
  }
  
  setBody(body) {
    this.body = body
    return this
  }
  
  build() {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body
    }
  }
}

// 使用
const request = new RequestBuilder()
  .setUrl('/api/users')
  .setMethod('POST')
  .setHeader('Content-Type', 'application/json')
  .setBody({ name: 'Tom' })
  .build()
```

### 结构型模式

```javascript
// 装饰器模式
function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

// 代理模式（Proxy）
const protectedData = new Map()
const dataProxy = new Proxy(protectedData, {
  get(target, key) {
    if (!target.has(key)) {
      console.warn(`Key "${key}" not found`)
      return undefined
    }
    return target.get(key)
  },
  set(target, key, value) {
    if (typeof value !== 'string') {
      throw new TypeError('Value must be a string')
    }
    target.set(key, value)
    return true
  }
})

// 适配器模式
class OldApi {
  request() { return { data: [] } }
}

class NewApiAdapter {
  constructor(oldApi) {
    this.oldApi = oldApi
  }
  
  fetch() {
    const response = this.oldApi.request()
    return {
      items: response.data,
      total: response.data.length
    }
  }
}

// 组合模式
class Component {
  constructor(name) {
    this.name = name
  }
  operation() {}
}

class Composite extends Component {
  constructor(name) {
    super(name)
    this.children = []
  }
  
  add(component) {
    this.children.push(component)
  }
  
  operation() {
    console.log(this.name)
    this.children.forEach(child => child.operation())
  }
}
```

### 行为型模式

```javascript
// 观察者模式
class EventEmitter {
  constructor() {
    this.events = {}
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }
  
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args))
    }
  }
  
  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener)
    }
  }
}

// 策略模式
const strategies = {
  isNonEmpty: value => value.trim() !== '',
  isNumber: value => /^\d+$/.test(value),
  isEmail: value => /^[\w-.]+@[\w-]+\.[\w-.]+$/.test(value),
  minLength: (value, len) => value.length >= len
}

function validate(value, rules) {
  for (const rule of rules) {
    const [strategy, ...args] = rule.split(':')
    if (!strategies[strategy](value, ...args)) {
      return false
    }
  }
  return true
}

// 使用
validate('abc', ['isNonEmpty', 'minLength:3'])  // true

// 命令模式
class Command {
  constructor(receiver, action, ...args) {
    this.receiver = receiver
    this.action = action
    this.args = args
  }
  
  execute() {
    this.receiver[this.action](...this.args)
  }
  
  undo() {
    // 实现撤销逻辑
  }
}

const commandStack = []
function executeCommand(command) {
  command.execute()
  commandStack.push(command)
}

// 迭代器模式
class RangeIterator {
  constructor(start, end) {
    this.current = start
    this.end = end
  }
  
  [Symbol.iterator]() {
    return this
  }
  
  next() {
    if (this.current > this.end) {
      return { done: true }
    }
    return {
      value: this.current++,
      done: false
    }
  }
}
```

---

## 11. 内存管理与垃圾回收

### 内存生命周期

```javascript
// 1. 分配内存
const obj = { name: 'Tom' }
const arr = [1, 2, 3]

// 2. 使用内存
console.log(obj.name)
arr.push(4)

// 3. 释放内存（自动垃圾回收）
obj = null  // 解除引用，等待回收
```

### 垃圾回收机制

```javascript
// 标记清除（Mark-and-Sweep）
// 不再被引用的对象会被标记并清除

// 引用计数（旧浏览器）
// 循环引用问题（已被标记清除取代）

// 避免内存泄漏

// 1. 意外全局变量
function leaky() {
  accidentalGlobal = 'I am global'  // 没有声明，成为 window 属性
}

// 2. 闭包
function outer() {
  const hugeData = new Array(1000000)
  
  return function inner() {
    // 即使只需要 hugeData[0]，整个数组都会被保留
    console.log(hugeData[0])
  }
}
const closure = outer()  // hugeData 无法被回收

// 修复：只保存需要的部分
function outerFixed() {
  const hugeData = new Array(1000000)
  const needed = hugeData[0]
  
  return function inner() {
    console.log(needed)  // 只保留需要的数据
  }
}

// 3. DOM 引用
const elements = {
  button: document.getElementById('button')
}
// 即使从 DOM 移除，仍然有引用
document.body.removeChild(elements.button)
// 需要手动清除
elements.button = null

// 4. 定时器和事件监听
let timer = setInterval(() => {/*...*/}, 1000)
// 忘记清除
clearInterval(timer)
timer = null

element.addEventListener('click', handler)
// 移除元素前必须移除监听
element.removeEventListener('click', handler)
```

### WeakMap 和 WeakSet

```javascript
// WeakMap - 键不会阻止垃圾回收
const wm = new WeakMap()
let obj = { id: 1 }
wm.set(obj, 'metadata')

obj = null  // { id: 1 } 可以被垃圾回收

// 使用场景：私有数据
class Person {
  constructor(name) {
    privateData.set(this, { secret: 'my secret' })
  }
}
const privateData = new WeakMap()

// WeakSet - 对象不会阻止垃圾回收
const ws = new WeakSet()
let node = document.getElementById('node')
ws.add(node)

// 使用场景：跟踪已处理的对象
const processed = new WeakSet()
function process(data) {
  if (processed.has(data)) return
  processed.add(data)
  // 处理数据
}
```

---

## 12. 性能优化

### 代码层面

```javascript
// 1. 避免重复创建函数
// 不好
for (let i = 0; i < 100; i++) {
  element.addEventListener('click', () => console.log(i))  // 创建 100 个函数
}

// 好
function handleClick(i) {
  console.log(i)
}
for (let i = 0; i < 100; i++) {
  element.addEventListener('click', () => handleClick(i))  // 复用函数
}

// 2. 使用对象属性访问缓存
const obj = { data: { value: 1 } }
// 不好
for (let i = 0; i < 10000; i++) {
  console.log(obj.data.value)  // 每次都解析属性链
}

// 好
const value = obj.data.value
for (let i = 0; i < 10000; i++) {
  console.log(value)
}

// 3. 数组方法性能
const arr = [1, 2, 3, 4, 5]

// 慢：创建中间数组
const doubled = arr
  .filter(x => x > 2)
  .map(x => x * 2)

// 快：单次遍历
const result = []
for (const x of arr) {
  if (x > 2) {
    result.push(x * 2)
  }
}

// 4. 字符串拼接
// 慢
let str = ''
for (let i = 0; i < 10000; i++) {
  str += i  // 每次创建新字符串
}

// 快
const arr = []
for (let i = 0; i < 10000; i++) {
  arr.push(i)
}
const str = arr.join('')

// 或现代浏览器使用模板字符串
const str = Array(10000).fill(0).map((_, i) => i).join('')

// 5. 对象属性顺序
// 尽量使用相同顺序创建对象（V8 优化）
const obj1 = { name: 'Tom', age: 25 }
const obj2 = { name: 'Jerry', age: 30 }   // 共享隐藏类
const obj3 = { age: 35, name: 'Mike' }    // 不同隐藏类，性能稍差
```

### 内存优化

```javascript
// 1. 对象池（Object Pooling）
class Bullet {
  constructor() {
    this.active = false
    this.x = 0
    this.y = 0
  }
}

class BulletPool {
  constructor(size) {
    this.pool = Array(size).fill(null).map(() => new Bullet())
    this.activeCount = 0
  }
  
  acquire() {
    if (this.activeCount >= this.pool.length) {
      return null  // 池已满
    }
    const bullet = this.pool[this.activeCount++]
    bullet.active = true
    return bullet
  }
  
  release(bullet) {
    bullet.active = false
    // 放回池尾
    const index = this.pool.indexOf(bullet)
    if (index < this.activeCount - 1) {
      [this.pool[index], this.pool[this.activeCount - 1]] = 
      [this.pool[this.activeCount - 1], this.pool[index]]
    }
    this.activeCount--
  }
}

// 2. 分块加载
async function* loadInChunks(items, chunkSize) {
  for (let i = 0; i < items.length; i += chunkSize) {
    yield items.slice(i, i + chunkSize)
    await new Promise(r => setTimeout(r, 0))  // 让出主线程
  }
}

// 3. 使用 requestIdleCallback
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift()
    task()
  }
})
```

---

## 13. 浏览器相关 API

### Storage

```javascript
// LocalStorage
localStorage.setItem('key', 'value')
localStorage.getItem('key')
localStorage.removeItem('key')
localStorage.clear()
localStorage.length

// SessionStorage
sessionStorage.setItem('key', 'value')

// IndexedDB
const db = await openDB('myDB', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' })
  }
})

await db.put('items', { id: 1, name: 'item' })
const item = await db.get('items', 1)
await db.delete('items', 1)

// Storage 配额检查
const estimate = await navigator.storage.estimate()
console.log(estimate.usage, estimate.quota)
```

### 网络请求

```javascript
// Fetch API
const response = await fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})

// 取消请求
const controller = new AbortController()
fetch('/api/data', { signal: controller.signal })
controller.abort()

// 进度跟踪
const response = await fetch('/large-file')
const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  console.log(`Received ${value.length} bytes`)
}

// Beacon API（页面关闭时发送）
window.addEventListener('unload', () => {
  navigator.sendBeacon('/log', JSON.stringify(logData))
})
```

### 性能 API

```javascript
// Performance API

// 页面加载时间
window.addEventListener('load', () => {
  const timing = performance.timing
  console.log(timing.loadEventEnd - timing.navigationStart)  // 总加载时间
})

// PerformanceObserver
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration)
  }
})
observer.observe({ entryTypes: ['measure', 'navigation'] })

// 测量代码执行时间
performance.mark('start')
// ...code
performance.mark('end')
performance.measure('duration', 'start', 'end')

// 资源加载性能
performance.getEntriesByType('resource').forEach(r => {
  console.log(r.name, r.responseEnd - r.startTime)
})

// Web Vitals
new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const lastEntry = entries[entries.length - 1]
  console.log('LCP:', lastEntry.startTime)
}).observe({ entryTypes: ['largest-contentful-paint'] })
```

---

## 14. Web Workers

### 基础使用

```javascript
// main.js
const worker = new Worker('worker.js')

worker.postMessage({ data: [1, 2, 3, 4, 5] })

worker.onmessage = (e) => {
  console.log('Result:', e.data)  // { result: 15 }
}

worker.onerror = (error) => {
  console.error('Worker error:', error)
}

// worker.js
self.onmessage = (e) => {
  const { data } = e.data
  const result = data.reduce((a, b) => a + b, 0)
  self.postMessage({ result })
}
```

### Shared Worker

```javascript
// shared-worker.js
const ports = []

self.onconnect = (e) => {
  const port = e.ports[0]
  ports.push(port)
  
  port.onmessage = (e) => {
    // 广播给所有连接
    ports.forEach(p => {
      if (p !== port) {
        p.postMessage(e.data)
      }
    })
  }
  
  port.start()
}

// 使用
const worker = new SharedWorker('shared-worker.js')
worker.port.postMessage('Hello')
worker.port.onmessage = (e) => console.log(e.data)
```

### OffscreenCanvas（Worker 中渲染）

```javascript
// main.js
const canvas = document.getElementById('canvas')
const offscreen = canvas.transferControlToOffscreen()
const worker = new Worker('canvas-worker.js')
worker.postMessage({ canvas: offscreen }, [offscreen])

// canvas-worker.js
let canvas, ctx

self.onmessage = (e) => {
  if (e.data.canvas) {
    canvas = e.data.canvas
    ctx = canvas.getContext('2d')
    draw()
  }
}

function draw() {
  // 在 Worker 中渲染
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 100, 100)
  requestAnimationFrame(draw)
}
```
