const assert = require('assert');
const curry = require('../../src/curry/curry1');

describe('#testCurry1', () => {
    const add = (x, y) => x + y;
    it('add(1, 2) return 3', () => {
        const curriedAdd = curry(add);
        assert.strictEqual(add(1, 2), curriedAdd(1)(2));
    });
});
