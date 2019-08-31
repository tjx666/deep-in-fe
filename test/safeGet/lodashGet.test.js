const assert = require('assert');
const get = require('../../src/safeGet/lodashGet');

describe('lodashGet', function() {
    const testObj = { a: { b: { c: 123 }, b1: [{ c1: 789 }], b2: null, b3: undefined }, a1: null };

    it('path is Array', function() {
        assert.strictEqual(testObj.a, get(testObj, ['a']));
        assert.strictEqual(testObj.a.b.c, get(testObj, ['a', 'b', 'c']));
        assert.strictEqual(testObj.a.b1[0].c1, get(testObj, ['a', 'b1', 0, 'c1']));
    });

    it('path is string', function() {
        assert.strictEqual(testObj.a, get(testObj, 'a'));
        assert.strictEqual(testObj.a.b.c, get(testObj, 'a.b.c'));
        assert.strictEqual(testObj.a.b1[0].c1, get(testObj, 'a.b1[0].c1'));
    });

    it('return default value', function() {
        assert.strictEqual('default', get(null, 'aaa', 'default'));
        assert.strictEqual('default', get(undefined, 'aaa', 'default'));
        assert.strictEqual('default', get(testObj, ['b2', 'c2'], 'default'));
        assert.strictEqual('default', get(testObj, ['b3', 'c3'], 'default'));
        assert.strictEqual(null, get(testObj, 'a1'));
    });});
