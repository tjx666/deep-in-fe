const assert = require('assert');
const flatDepth = require('../../src/flat/flatDepth');

describe('#flatDepth', () => {
    it('should flat the specific depth', () => {
        const testArray = [1, [2, [3, [4, 5, 6]]], 7, [8, 9, [10]], 11];
        assert.deepStrictEqual(flatDepth(testArray, Infinity), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        assert.deepStrictEqual(flatDepth(testArray, 2), [1, 2, 3, [4, 5, 6], 7, 8, 9, 10, 11]);
    });
});
