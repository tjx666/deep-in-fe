const assert = require('assert');
const safetyify = require('../../src/safeGet/safetyify');

describe('safetyify', () => {
    it('not nullableObject throw TypeError', function() {
        assert.throws(() => {
            safetyify(new Date());
        }, TypeError);
    });

    it('nullableObject is null/undefined', function() {
        safetyify(null);
        safetyify(undefined);
    });

    it('get normal value', function() {
        const testObj = {
            father: { son: { name: 'lily' } },
            nul: null,
            und: undefined,
        };
        const safeObj = safetyify(testObj);
        assert.strictEqual('lily', safeObj.father.son.name.get());
        assert.strictEqual(testObj.father, safeObj.father.get());
        assert.strictEqual(null, safeObj.nul.get());
        assert.strictEqual(undefined, safeObj.und.get());
    });

    it('default value', function() {
        const testObj = { name: 'ly' };
        const safeObj = safetyify(testObj);
        console.log('KKKK', safeObj.gf.get(''));
        assert.strictEqual('', safeObj.gf.get(''));
        assert.strictEqual('', safeObj.a.b.c.get(''));
        assert.strictEqual('', safeObj.name.d.e.get(''));
        assert.strictEqual('', safetyify(null).name.k.f.c.get(''));
    });
});
