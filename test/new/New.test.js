const assert = require('assert');
const New = require('../../src/new/New');

describe('#new', () => {
    function Student(name, age) {
        Object.assign(this, { name, age });
    }

    function Me(name, age) {
        Object.assign(this, { name, age });
        return { name: 'YuTengjing', age: 22 };
    }

    it(`normal new a Student instance`, () => {
        assert.deepEqual(New(Student, 'ly', 20), { name: 'ly', age: 20 });
    });

    it(`when constructor return Object, use return value as result `, () => {
        assert.deepEqual(New(Me, 'ly', 20), { name: 'YuTengjing', age: 22 });
    });

    it('throw TypeError when new target is not function', () => {
        assert.throws(() => New(123), {
            name: 'TypeError',
            message: '123 is not a constructor',
        });
    });
});
