const assert = require('assert');
const myBind = require('../../src/callApplyBind/myBind');

describe('#myBind', () => {
    function fn(a = 0, b = 0, c = 0) {
        return {
            this: this,
            sum: a + b + c,
        };
    }

    const thisArg = { p: 666 };
    // eslint-disable-next-line mocha/no-setup-in-describe
    const boundFn = myBind(fn, thisArg, 1);

    it('should name and length property be set correctly', () => {
        assert.strictEqual(boundFn.name, 'bound fn');
        assert.strictEqual(boundFn.length, 0);
    });

    it('should this be bound', () => {
        assert.deepStrictEqual(boundFn(), {
            this: thisArg,
            sum: 1,
        });
    });

    it('should be correctly be deal when new the fn', () => {
        function Student(name) {
            this.name = name;
        }
        Student.prototype.a = 1;

        const BoundStudent = myBind(Student);
        const stu = new BoundStudent('ly');
        assert.strictEqual(stu.name, 'ly');
        assert.strictEqual(stu.a, 1);
    });
});
