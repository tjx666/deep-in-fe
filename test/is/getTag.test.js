const assert = require('assert');
const getTag = require('../../src/is/getTag');

describe('#getTag', () => {
    it('getTag(666) return [object Number]', () => {
        assert.strictEqual('[object Number]', getTag(666));
    });

    it('getTag({}) return [object Object]', () => {
        assert.strictEqual(getTag({}), '[object Object]');
    });

    it('getTag(new Date()) return [object Date]', () => {
        assert.strictEqual(getTag(new Date()), '[object Date]');
    });

    it('getTag(null) return [object Null]', () => {
        assert.strictEqual(getTag(null), '[object Null]');
    });

    it('getTag(undefined) return [object Undefined]', () => {
        assert.strictEqual(getTag(undefined), '[object Undefined]');
    });
});
