const assert = require('assert');
const myApply = require('../../src/callApplyBind/myApply');

describe('#myApply', () => {
    function fn(...args) {
        return {
            this: this,
            args,
        };
    }

    it('should this be bound global object when thisArg is nullable', () => {
        assert.deepStrictEqual(myApply(fn), { this: global, args: [] });
    });

    it('should this be temporarily bound to this argument', () => {
        const thisArg = { some: 666 };
        const result = myApply(fn, thisArg);
        assert.deepStrictEqual(result, { this: thisArg, args: [] });
    });

    it('should the arguments be applied to fn', () => {
        assert.deepStrictEqual(myApply(fn, null, [1, 2, 3]), { this: global, args: [1, 2, 3] });
    });
});
