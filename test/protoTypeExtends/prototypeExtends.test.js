const assert = require('assert');
const myExtends = require('../../src/prototypeExtends/prototypeExtends');

describe('#test prototypeExtends', () => {
    function Father(name) {
        this.friends = [];
        this.name = name;
    }

    Father.prototype.sayHello = () => 'hello';

    function Son(name, age) {
        Father.call(this, name);
        this.age = age;
    }

    it('#simpleTest', () => {
        myExtends(Son, Father);
        const son1 = new Son('Bob', 10);
        son1.friends.push('lily');
        assert.strictEqual(son1.sayHello&&son1.sayHello(), 'hello');
        const son2 = new Son('Bob', 1);
        assert.notStrictEqual(son1.friends, son2.friends);
        assert(son1 instanceof Father);
        assert(son1.__proto__.__proto__ === Father.prototype);
    })
})