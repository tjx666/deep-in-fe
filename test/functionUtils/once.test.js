const assert = require('assert');
const once = require('../../src/functionUtils/once');

describe('#once', () => {
    let flag = false;
    // eslint-disable-next-line mocha/no-setup-in-describe
    const toggle = once(() => {
        flag = !flag;
    });

    it('should only execute once when call multiple', () => {
        toggle();
        assert.ok(flag);
        toggle();
        assert.ok(flag);
    });
});
