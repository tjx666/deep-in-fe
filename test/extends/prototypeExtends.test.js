const assert = require('assert');
const prototypeExtends = require('../../src/extends/prototypeExtends');

describe('#prototypeExtends', () => {
    function SuperClass() {}
    function SubClass() {}

    before(() => prototypeExtends(SubClass, SuperClass));

    it(`should the proto of subClass's prototype is superClass's prototype`, () => {
        assert.deepStrictEqual(Reflect.getPrototypeOf(SubClass.prototype), SuperClass.prototype);
    });

    it(`should subClass instanceof superClass`, () => {
        assert.ok(new SubClass() instanceof SuperClass);
    });

    it(`should subClass's constructor is subClass`, () => {
        assert.deepStrictEqual(SubClass.prototype.constructor, SubClass);
    });
});
