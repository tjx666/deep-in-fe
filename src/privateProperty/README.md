## 实现私有属性

ES6 支持私有属性，即使用 `#` 声明的 class 属性将被视为私有的：

```javascript
class Example {
  constructor() {
    this.#privateField = 666;
  }
}

const e = new Example();
console.log(e.#privateField);
// SyntaxError: Private field '#privateField' must be declared in an enclosing class
```

可以使用闭包来返回 class 类或者构造器，将属性定义为闭包变量，这样外部就拿不到属性名，由于 Symbol 值定义的属性默认是不可遍历的，因此可以防止用户在遍历中访问到私有属性，但是也不是觉得的，通过 例如`Object.getOwnPropertySymbols`，`Reflect.ownKeys` 就可以访问到这俩属性。

```javascript
const A = (function () {
  const _privateField = Symbol('some description');

  class A {
    constructor(a) {
      this.a = a;
      this[_privateField] = 777;
    }
  }

  return A;
})();

const a = new A(1);
console.log(Object.keys(a)); // => [ 'a' ]
console.log(Reflect.ownKeys(a)); // => [ 'a', Symbol(some description) ]
console.log(a[Object.getOwnPropertySymbols(a)[0]]); // => 777
console.log(a[Reflect.ownKeys(a)[1]]); // => 777
```

## :link: references

- [Akara 的小站-腾讯 CSIG 二面](https://messiahhh.github.io/blog/mianshi/#%E8%85%BE%E8%AE%AF-csig-%E4%B8%80%E9%9D%A2)
