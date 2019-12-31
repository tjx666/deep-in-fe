const assert = require('assert');
const instanceOf = require('../../src/instanceof/instanceOf');

describe('#instanceOf', () => {
    function Student() {}
    const stu = new Student();

    class User {}
    const user = new User();

    it('#stu is instance of constructor Student, user is instance of class User', () => {
        assert(instanceOf(stu, Student));
        assert(instanceOf(user, User));
    });

    it('#stu is not instance of User', () => {
        assert(!instanceOf(stu, User));
    });

    it('#throw TypeError when constructor argument is not Object', () => {
        assert.throws(() => instanceOf(stu, null), {
            name: 'TypeError',
            message: `Right-hand side of 'instanceof' is not an object`,
        });
    });

    it('#throw TypeError when constructor argument is not callable', () => {
        assert.throws(() => instanceOf(stu, {}), {
            name: 'TypeError',
            message: `Right-hand side of 'instanceof' is not callable`,
        });
    });
});
