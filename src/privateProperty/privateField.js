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

class Example {
    constructor() {
        this.#privateField = 666;
    }
}

const e = new Example();
console.log(e.#privateField);
// SyntaxError: Private field '#privateField' must be declared in an enclosing class
