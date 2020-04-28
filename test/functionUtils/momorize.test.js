const assert = require('assert');
const memorize = require('../../src/functionUtils/memorize');

describe('#memorize', () => {
    let flag = false;
    // eslint-disable-next-line mocha/no-setup-in-describe
    const memorized = memorize((...args) => {
        flag = !flag;
        return args.reduce((a, b) => a + b, 0);
    });
    it('should just return the cache value when arguments is the same', () => {
        memorized(1, 2, 3);
        assert.ok(flag);
        memorized(1, 2, 3);
        assert.ok(flag);
        assert.strictEqual(memorized(3, 4, 5), 12);
        assert.strictEqual(flag, false);
    });
});
