title: 'javascript 基础之 call, apply, bind'
tags:

  - basic
categories:
  - javascript
author: YuTengjing
date: 2019-06-27 21:29:00
---

系统，扎实的 javascript 语言基础是一个优秀的前端工程师必须具备的。在看了一些关于 call，apply，bind 的文章后，我还是打算写下这篇总结，原因有几个。首先，在如今 ES6 大行其道的今天，很多文章中讲述的它们的应用场景其实用 ES6 可以更优雅的解决，但是基本上·没有文章会去提 ES6 的解法。再则，讲它们的实现原理的文章其实不少，但是或多或少实现的有些不够完美，本文将把它们通过代码一一比较完美的实现，让它们不再神秘。不谦虚的说，关于 call，apply，bind 的知识，看这一篇文章就够了。

<!-- more -->

## 改变函数中 this 指向的三兄弟

我们知道在 javascript 的 function 中有 `this`，`arguments` 等关键字。本文不讨论 this 指向问题，那个都可以单独整一篇文章了。一个常见的使用场景是当你使用 `.` 来调用一个函数的时候，此时函数中 this 指向 `.` 前面的调用者：

```javascript
const person = {
    name: 'YuTengjing',
    age: 22,
    introduce() {
        console.log(`Hello everyone! My name is ${this.name}. I'm ${this.age} years old.`);
    }
};

// this 此时指向 person
console.log(person.introduce()); // => Hello everyone! My name is YuTengjing. I'm 22 years old. 
```

通过 call，apply，bind 这三兄弟可以改变 `introduce` 中 this 的指向。

### [call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

```javascript
const myFriend = {
    name: 'dongdong',
    age: 21,
};

console.log(person.introduce.call(myFriend)); // => Hello everyone! My name is dongdong. I'm 21 years old. 
```

通过上面代码我们可以看出 `introduce` 这个函数中的 this 指向被改成了 myFriend。Function.prototype.call 的函数签名是 `fun.call(thisArg, arg1, arg2, ...)`。第一个参数为调用函数时 this 的指向，随后的参数则作为函数的参数并调用，也就是 fn(arg1, arg2, ...)。

### [apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

apply 和 call 的区别只有一个，就是它只有两个参数，而且第二个参数为调用函数时的参数构成的数组。函数签名：`func.apply(thisArg, [argsArray])`。如果不用给函数传参数，那么他俩就其实是完全一样的，需要传参数的时候注意它的应该将参数转换成数组形式。

一个简单的例子：

```javascript
function displayHobbies(...hobbies) {
    console.log(`${this.name} likes ${hobbies.join(', ')}.`);
}

// 下面两个等价
displayHobbies.call({ name: 'Bob' }, 'swimming', 'basketball', 'anime'); // => // => Bob likes swimming, basketball, anime. 
displayHobbies.apply({ name: 'Bob' }, ['swimming', 'basketball', 'anime']); // => Bob likes swimming, basketball, anime. 
```

有些 API 比如 Math.max 它的参数为多参数，当我们有多参数构成的数组使或者说参数很多时该怎么办呢？

```javascript
// Math.max 参数为多参数
console.log(Math.max(1, 2, 3)); // => 3

// 现在已知一个很大的元素为随机大小的整数数组
const bigRandomArray = [...Array(10000).keys()].map(num => Math.trunc(num * Math.random()));

// 怎样使用 Math.max 获取 bigRandomArray 中的最大值呢？Math.max 接受的是多参数而不是数组参数啊!
// 思考下面的写法
console.log(Math.max.apply(null, bigRandomArray)); // => 9936
```

可以上 ES6 的话就简单了，使用扩展运算符即可，优雅简洁。

```javascript
console.log(Math.max(...bigRandomArray));
```

### [bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

bind 和上面两个用途差别还是比较大，如同字面意思（绑定），是用来绑定 this 指向的，返回一个原函数被绑定 this 后的新函数。一个简单的例子：

```javascript
const person = {
    name: 'YuTengjing',
    age: 22,
};

function introduce() {
    console.log(`Hello everyone! My name is ${this.name}. I'm ${this.age} years old.`);
}

const myFriend = { name: 'dongdong', age: 21 };
person.introduce = introduce.bind(myFriend);

// person.introduce 的 this 已经被绑定到 myFriend 上了
console.log(person.introduce()); // => Hello everyone! My name is dongdong. I'm 21 years old.
console.log(person.introduce.call(person)); // => Hello everyone! My name is dongdong. I'm 21 years old. 
```

bind 的函数签名是 `func.bind(thisArg, arg1, arg2, ...)`。春招的时候被问过 bind 的第二个参数是干嘛用的，因为我之前写代码本身不怎么用这几个 API，用的时候我也只用第一个参数，所以当时面试的时候被问这个问题的时候我还是愣了一下。不过其实如果可以传多个参数的话，猜也能猜得出来是干嘛用的，我当时就猜对了φ(*￣0￣)。

## 学以致用

我们学习知识的时候不能只是停留在理解层面，需要去思考它们有什么用，应用场景有哪些。这样的话，当你处在这种场景中，你就能很自然的想出解决方案。

### 多参函数转换为单个数组参数调用

javascript 中有很多 API 是接受多个参数的比如之前提过的 Math.max，还有很多例如 Math.min，Array.prototype.push 等它们都是接受多个参数的 API，但是有时候我们只有多个参数构成的数组，而且可能还特别大，这个时候就可以利用 apply 巧妙的来转换。

下面是利用 apply 来巧妙的合并数组：

```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

Array.prototype.push.apply(arr1, arr2);
console.log(arr1); // [1, 2, 3, 4, 5, 6]
```

但是，其实用 ES6 可以非常的简洁：

```javascript
arr1.push(...arr2);
```

所以，忘了这种用法吧（￣︶￣）↗　。

### 将[类数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays)转换为数组

JavaScript类型化数组是一种类似数组的对象，它们有数组的一些属性，但是如果你用 Array.isArray() 去测试会返回 false，常见的像 arguments，NodeList 等。

```javascript
function testArrayLike() {
    // 有 length 属性没有 slice 属性
    console.log(arguments.length); // => 3
    console.log(arguments.slice); // => undefined

    // 类数组不是数组
    console.log(Array.isArray(arguments)); // => false
    console.log(arguments); // => { [Iterator]  0: 'a', 1: 'b', 2: 'c', [Symbol(Symbol.iterator)]: [λ: values] } 
    
    const array = Array.prototype.slice.call(arguments);
    console.log(Array.isArray(array)); // => true
    console.log(array); // => [ 'a', 'b', 'c' ]
}

testArrayLike('a', 'b', 'c');
```

其实 把 slice 换成 concat，splice 等其它 API 也是可以的。思考：**为什么通过 Array.prototype.slice.call(arrayLike) 可以转换类数组为数组？**

我没有研究过 slice 的具体实现，猜测是下面这样的：

```javascript
Array.prototype.mySlice = function(start=0, end) {
    const array = this;
    const end = end === undefined ? array.length : end;
    
	const resultArray = [];
	if (array.length === 0) return resultArray;
	for (let index = start; index < end; index++) {
        resultArray.push(array[index]);
    }
    return resultArray;
}
```

我想 slice 内部实现可能就是会像我上面的代码一样只需要一个 length 属性，遍历元素返回新数组，所以调用 slice 时将其 this 指向类数组能正常工作。

其实，这个用法也可以忘了，用 ES6 来转换不造多简单，ES6 大法好😂。

可以使用 Array.from(arrayLike)：

```javascript
const array = Array.from(arguments);
```

还可以使用扩展运算符：

```javascript
const array = [...arguments];
```

### 组合继承

ES6 class 出现之前，个人认为比较完美的继承是使用原型链加组合的继承方式，以前研究原型继承写的代码在这：[**prototypeExtends**](https://github.com/tjx666/javascript-code-lab/tree/master/src/prototypeExtends)。这里不展开讲 javascript 的继承，那会又是一个巨坑。

组合继承其实很好理解，这个组合指的是子类的实例属性组合了父类的实例属性，看代码：

```javascript
function Animal(type) {
	this.type = type;
}

function Bird(type, color) {
	Animal.call(this, type);
	this.color = color;
}

const bird = new Bird('bird', 'green');
console.log(bird); // => Bird { type: 'bird', color: 'green' } 
```

组合继承核心代码就是那句 Animal.call(this, type)，通过调用父类构造器并修改其 this 指向为子类实例来达到子类实例上组合父类的实例属性目的。

## 自己实现 call，apply，bind

### call

实现 call 主要有两种思路，一种是通过在 thisArg 上临时添加 func，然后直接调用 thisArg.func()。另外一种是利用 func.toString() 替换 this 为 thisArg，再 eval 来实现。

#### 方式一

下面这个版本主要为了说明思路，其实是有很多缺陷的：

```javascript
Function.prototype.myCall = function(thisArg, ...args) {
    // 这里的 this 其实就是 func.myCall(thisArg, ...args) 中的 func，因为 myCall 是通过 func 调用的嘛
    const func = this;

    // 在 thisArg 上临时绑定 func
    thisArg.tempFunc = func;

    // 通过 thisArg 调用 func 来达到改变 this 指向的作用
    const result = thisArg.tempFunc(...args);

    // 删除临时属性
    delete thisArg.tempFunc;
    return result;
}

function printName() {
    console.log(this.name);
}

console.log(printName.myCall({ name: 'ly' })); // => ly
```

上面的代码中有一些缺陷：

1. myCall 的第一个参数可能被传入非对象参数，要对不同类型的 thisArg 分别处理。[MDN 中对 thisArg 的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)：

   > 在 *fun* 函数运行时指定的 `this` 值*。*需要注意的是，指定的 `this` 值并不一定是该函数执行时真正的 `this` 值，如果这个函数在[`非严格模式`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下运行，则指定为 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 和 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) 的 `this` 值会自动指向全局对象（浏览器中就是 window 对象），同时值为原始值（数字，字符串，布尔值）的 `this` 会指向该原始值的自动包装对象。

2. 可能 thisArg 原本就有一个属性叫 tempFunc，这是完全有可能的，按照上面的代码来实现 myCall 就把原有的 tempFunc 属性消除了。可以使用 ES6 Symbol 来解决这个问题。

所以完善后的 myCall 是酱紫：

```javascript
Function.prototype.myCall = function(thisArg, ...args) {
    if (thisArg === undefined || thisArg === null) {
        // 如果 thisArg 是 undefined 或则 null，this 指向全局对象，直接调用就可以达到指向全局对象的目的了
        return tempFunc(...args);
    }

    // 这里的 this 其实就是 func.myCall(thisArg, ...args) 中的 func，因为 myCall 是通过 func 调用的嘛
    const func = this;

    const tempFunc = Symbol('Temp property');
    // 在 thisArg 上临时绑定 func
    thisArg[tempFunc] = func;

    // 通过 thisArg 调用 func 来达到改变 this 指向的作用
    const result = thisArg[tempFunc](...args);

    // 删除临时属性
    Reflect.deleteProperty(thisArg, tempFunc);
    return result;
}

function printName() {
    console.log(this.name);
}

console.log(printName.myCall({ name: 'ly' })); // => ly
```

#### 方式二

讲第二中方式之前，先来聊聊其它的一些相关的东西。

##### Function.prototype.toString

调用一个函数的 toString 方法返回的是这个函数定义时代码字符：

![function toString](https://i.loli.net/2019/06/29/5d16c5b48ef8590170.png)

我故意在 `console.log('hello world');` 上下插了一个空行，func 左右多打了几个空格，可以看到 func.toString() 返回的字符串完全是我定义 func 时的样子，多余的空行和空格依然存在，没有格式化。

##### eval

eval 函数可以让我们将一个字符串当作代码来运行：

```javascript
const ctx = { name: 'Bob' };
eval('console.log(ctx.name)'); // Bob
```

##### 动手实现

所以看到这里思路已经很清晰了：先通过 func.toString 拿到 func 的代码字符串，再替换其中的 this 为 thisArg，再使用 eval 获取替换 this 后的临时函数（函数名显然和 func 一样）并执行。代码实现就是酱紫：

```javascript
Function.prototype.myCall = function (thisArg, ...args) {
    if (thisArg === undefined || thisArg === null) {
        // 如果 thisArg 是 undefined 或则 null，this 指向全局对象，直接调用就可以达到指向全局对象的目的了
        return tempFunc();
    }

    // 这里的 this 其实就是 func.myCall(thisArg, ...args) 中的 func，因为 myCall 是通过 func 调用的嘛
    const func = this;
    const funcString = func.toString();

    // 替换 this 为 thisArg
    const tempFuncString = funcString.replace(/this/g, 'thisArg');

    // 通过 eval 构造一个临时函数并执行
    const tempFunc = eval(`(${tempFuncString})`);

    // 调用 tempFunc 并传入参数
    return tempFunc(...args);
}

function printName() {
    console.log(this.name);
}

console.log(printName.myCall({ name: 'ly' })); // => ly

```

添加一些打印语句后在 chrome 中的执行情况：
![eval-call](https://i.loli.net/2019/06/29/5d16d5a0b97eb35960.png)

但是，**这种实现方式其实是很扯淡的**。它有很多不能容忍而且无解的缺陷：

1. 临时函数的作用域和 func 的作用域不一样。使用 eval(`(${tempFuncString})`) 时声明了一个和 func 同名的临时函数，它的作用域是 myCall 这个函数作用域，而 func 的作用域显然在 myCall 外。
2. 替换 'this' 时有可能 func 函数其中有字符串或者标识符本身包含了 'this'，比如 func 函数中有 console.log('this') 这么一条输出语句，那这个 this 也被替换了，或者定义了个变量叫 xxthisxx。

所以，相对而言，第一种实现更靠谱。

### apply

 call 和 apply 除了参数不一样之外没什么区别。所以稍微调整 myCall 中的参数和调用 func 时的调用形式即可。

```javascript
Function.prototype.myApply = function(thisArg, args) {
    if (thisArg === undefined || thisArg === null) {
        // 如果 thisArg 是 undefined 或则 null，this 指向全局对象，直接调用就可以达到指向全局对象的目的了
        return tempFunc(args);
    }

    // 这里的 this 其实就是 func.myCall(thisArg, ...args) 中的 func，因为 myCall 是通过 func 调用的嘛
    const func = this;

    const tempFunc = Symbol('Temp property');
    // 在 thisArg 上临时绑定 func
    thisArg[tempFunc] = func;

    // 通过 thisArg 调用 func 来达到改变 this 指向的作用
    const result = thisArg[tempFunc](args);

    // 删除临时属性
    delete thisArg[tempFunc];
    return result;
}

function printName() {
    console.log(this.name);
}

console.log(printName.myCall({ name: 'ly' })); // => ly
```

第二种方式就不写了，其实也很简单，不写主要时因为第二种实现没什么实用性，介绍它的就是为了扩展一下思路。

### bind

使用 call 来实现 bind 是一个比较常见的面试题，类似于使用 map 实现 reduce，其实还是考察你 javascript 掌握的怎么样。如果面试被问到闭包有哪些实际应用你其实也可以说可以使用闭包来实现 bind，对吧，面试还是有些技巧的。

思路我上面其实已经说了，就是利用闭包和 call 就可以了。

```javascript
Function.prototype.myBind = function(thisArg, ...args) {
    const func = this;

    // bind 返回的是一个新函数
    return function(...otherArgs) {
        // 执行函数时 this 始终为外层函数中的 thisArg，前面的调用参数也被绑定为 args
        return func.call(thisArg, ...args, ...otherArgs)
    };
}

function printThisAndAndArgs() {
    console.log(`This is ${JSON.stringify(this)}, arguments is ${[...arguments].join(', ')}`);
}

const boundFunc = printThisAndAndArgs.myBind({ name: 'Lily' }, 1, 2, 3)
boundFunc(4, 5, 6); // => This is {"name":"Lily"}, arguments is 1, 2, 3, 4, 5, 6 
```

按照惯例，上面实现的版本肯定是有些问题的ㄟ( ▔, ▔ )ㄏ。

#### new 的实现原理

第一个问题是没处理当使用 new 调用的情况：

```javascript
function Student(name, age) {
    this.name = name;
    this.age = age;
}

const BoundStudent1 = Student.bind({ name: 'Taylor' }, 'ly');
console.log(new BoundStudent1(22)); // => Student { name: 'ly', age: 22 } 

const BoundStudent2 = Student.myBind({ name: 'Taylor' }, 'ly');
console.log(new BoundStudent2(22)); // => {}
```

可以看到 bind 当返回的函数被使用 new 调用时， thisArg 被忽略，此时 bind 函数的作用只是起到了绑定构造函数参数的作用。当前版本的 myBind 只是返回了一个空对象，没有在返回的实例对象上绑定属性。

这里补充一下 new 操作符的实现原理。我有一个项目[**javascript-code-lab**](https://github.com/tjx666/javascript-code-lab)上保存我探索原生 js 奥秘的一些代码，有兴趣可以看看。其中我 new 操作符的实现是这样的：

```javascript
const _new = (fn, ...args) => {
    const target = Object.create(fn.prototype);
    const result = fn.call(target, ...args);
    const isObjectOrFunction = (result !== null && typeof result === 'object') || typeof result === 'function');
    return isObjectOrFunction ? result : target;
}
```

其实很好理解，当我们调用 new fn(arg1, arg2, ...) 的时候，其实相当于执行了 _new(fn, arg1, arg2, ...)。具体内部的执行步骤是这样的：

首先构造一个空对象 target，它的原型应该为 fn.prototype，这里我使用了 ES6 的 Object.create 来实现。

然后我们需要在 target 上绑定你在 fn 中通过 this.key = value 来绑定到实例对象的属性。具体做法就是执行 fn 并且将其 this 指向 target，也就是 const result = fn.call(target, ...args);。

最后还要注意的就是当 fn 的返回值 result 是对象或者函数的时候，new fn(arg1, arg2, ...) 返回的就是指行 fn 的返回值而不是 target，否则直接返回 target，也就是实例对象。

![new](https://i.loli.net/2019/06/29/5d16ec374162677354.png)

如果有人问你有哪些方式可以修改函数的 this 指向，其实 **new 操作符也可以修改构造函数的指向**，没毛病吧。

了解了 new 操作符的原理之后，我们再来看看上面我们实现的 myBind 为什么会在 new 时工作不正常。当我们调用 new BoundStudent2(22) 时，根据我上面讲的 new 的原理知道，在构造出一个以 BoundStudent.prototype 为原型的空对象 target 后，会调用 BoundStudent.call(target) 。但是，观察我们实现的 myBind，作为 myBind(thisArg) 的返回值的 BoundStudent2，它内部执行时始是调用 func.call(thisArg, ...args, ...otherArgs)，也就是说 this 始终是 thisArg，所以才没有绑定 name，age 属性到 target 上，其实是被绑定到了 thisArg 上去了。而且由于 BoundStudent.call(target) 返回值为 undefined，所以 new BoundStudent2(22) 的结果就是 target。 

#### 区分函数是否是通过 new 调用

上面我们分析了 new 调用 myBind 绑定的函数产生的问题的原因，那么该如何解决呢？想要解决这个问题我们必须得能够区分出调用 BoundFunc2 时是否是通过 new 来调用的。可以使用 ES6 中 [new.target](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target) 来区分。

![new.target](https://i.loli.net/2019/06/29/5d16fed23267568788.png)

**new.target**属性允许你检测函数或构造方法是否是通过[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符被调用的。在通过[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符被初始化的函数或构造方法中，`new.target`返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target` 的值是[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

```javascript
Function.prototype.myBind = function (thisArg, ...args) {
    const func = this;

    // bind 返回的是一个新函数，如果使用 new 调用了被绑定后的函数，其中的 this 即是 new 最后返回的实例对象，也就是 target
    return function (...otherArgs) {
        // 当 new.target 为 func，不为空时，绑定 this，而不是 thisArg
        return func.call(new.target ? this : thisArg, ...args, ...otherArgs)
    };
}

function Student(name, age) {
    this.name = name;
    this.age = age;
}

const BoundStudent1 = Student.bind({ name: 'Taylor' }, 'ly');
console.log(new BoundStudent1(22)); // => Student { name: 'ly', age: 22 } 

const BoundStudent2 = Student.myBind({ name: 'Taylor' }, 'ly');
console.log(new BoundStudent2(22)); // => { name: 'ly', age: 22 }
```

#### 处理原型链

当前版本的  myBind 没有处理原型链，BoundStudent2  new 出来的实例无法访问 Student 原型链上的属性。修改如下：

````javascript
Function.prototype.myBind = function (thisArg, ...args) {
    const func = this;

    // bind 返回的是一个新函数，如果使用 new 调用了被绑定后的函数，其中的 this 即是 new 最后返回的实例对象，也就是 target
    const boundFunc =  function (...otherArgs) {
        // 当 new.target 为 func，不为空时，绑定 this，而不是 thisArg
        return func.call(new.target ? this : thisArg, ...args, ...otherArgs)
    };

    boundFunc.prototype = Object.create(func.prototype);
    boundFunc.prototype.constructor = boundFunc;
    return boundFunc;
}

function Student(name, age) {
    this.name = name;
    this.age = age;
}

Student.prototype.type = 'student';

const BoundStudent2 = Student.myBind({ name: 'Taylor' }, 'ly');
console.log(new BoundStudent2(22).type); // => student
````

#### 完善一些细节

返回的函数毕竟是一个新的函数，它的有些属性需要我们修改。我们在处理一下 name 和 length 属性。如果一个函数 func 被绑定了英文叫 bound，那么 func.name 应该是 `bound func`。

````javascript
function func() {}
const boundFunc = func.bind({});
console.log(boundFunc.name); // bound func
````

func.length 表示函数的参数个数，但是 BoundFunc 的参数个数和 func 的参数个数可不一样，所以我们需要调整 func.length。值得注意的是 Function.prototype.name 和 Function.prototype.length 是不可写的，所以要通过 Object.defineProperties 来修改。

最终版：

````javascript
Function.prototype.myBind = function (thisArg, ...args) {
    const func = this;

    // bind 返回的是一个新函数，如果使用 new 调用了被绑定后的函数，其中的 this 即是 new 最后返回的实例对象，也就是 target
    const boundFunc = function (...otherArgs) {
        // 当 new.target 为 func，不为空时，绑定 this，而不是 thisArg
        return func.call(new.target ? this : thisArg, ...args, ...otherArgs)
    };

    boundFunc.prototype = Object.create(func.prototype);
    boundFunc.prototype.constructor = boundFunc;
    Object.defineProperties(boundFunc, {
        name: {
            value: `bound ${func.name}`
        },
        length: {
            value: func.length
        }
    });
    return boundFunc;
}

function Student(name, age) {
    this.name = name;
    this.age = age;
}

Student.prototype.type = 'student';
const BoundStudent2 = Student.myBind({ name: 'Taylor' }, 'ly');

console.log(new BoundStudent2(22).type); // => student
console.log(BoundStudent2.name); // => bound Student
console.log(BoundStudent2.length); // => 2
````

bind 是 ES5 才新增的 API，[es5-shim](https://github.com/es-shims/es5-shim) 是一个让传统和现代的浏览器引擎兼容 es5 的垫片库，其中 bind 的定义是下面这样的：

```javascript
defineProperties(FunctionPrototype, {
    bind: function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (!isCallable(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = array_slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound;
        var binder = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = apply.call(
                    target,
                    this,
                    array_concat.call(args, array_slice.call(arguments))
                );
                if ($Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return apply.call(
                    target,
                    that,
                    array_concat.call(args, array_slice.call(arguments))
                );

            }

        };

        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.

        var boundLength = max(0, target.length - args.length);

        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            array_push.call(boundArgs, '$' + i);
        }

        // XXX Build a dynamic function with desired amount of arguments is the only
        // way to set the length property of a function.
        // In environments where Content Security Policies enabled (Chrome extensions,
        // for ex.) all use of eval or Function costructor throws an exception.
        // However in all of these environments Function.prototype.bind exists
        // and so this code will never be executed.
        bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    }
});
```

由于这个库是用来兼容 ES5 的，所以没有用 ES6 的 **new.target** 而是用 **instanceOf** 来判断是否是使用 new 来调用的，也没有使用 ES6 的 Object.defineProperty 或者 Object.definePropertyies。可以看到官方源代码中的注释还是很详细清晰的，感兴趣的读者可以自行研究一下，有什么问题也可以在评论区提出来。

## 几个疑问

### 使用 bind 多次绑定一个函数，后续的绑定能生效吗？

不能，被绑定后，后续再次使用 bind 绑定没有作用。最后执行函数 fn 时，this 始终时被指向第一次 bind 时的 thisArg。

### 使用 bind 绑定函数 this 后，可以使用 call，apply 改变函数的指向吗？

不能，原因和上面一样。

```javascript
function test() {
	console.log(this);
}

let boundTest = test.bind({ name: 'ly' });
boundTest(); // => { name: 'ly' }

boundTest = boundTest.bind({ name: 'dongdong' });
boundTest(); // => { name: 'ly' }

boundTest.call({ name: 'yinyin' }); // => { name: 'ly' }
```

其实最近看过有些公司前端面试还考了偏函数的知识，其实也用到了 bind。这里我不打算讲偏函数了，偏函数我有空再写一篇文章单独讲。

参考资料：

1. [JavaScript中的call、apply、bind深入理解](https://www.jianshu.com/p/00dc4ad9b83f)
2. [彻底弄清 this call apply bind 以及原生实现](https://juejin.im/post/5c813aa5f265da2dd94cd7c2)
3. [面试官问：能否模拟实现JS的bind方法](https://juejin.im/post/5bec4183f265da616b1044d7)

如果文章内容有什么错误或者不当之处，欢迎在评论区指出。感谢您的阅读，如果文章对您有所帮助或者启发，不妨点个赞，关注一下呗。

本文为原创内容，首发于[个人博客](http://www.lyreal666.com)，转载请注明出处。

