const assert = require('assert');
const flat1 = require('../../src/flat/flat1');
const flat2 = require('../../src/flat/flat2');
const flat3 = require('../../src/flat/flat3');

[flat1, flat2, flat3].forEach((flat, index) => {
    describe(`#flat${index + 1}`, () => {
        it('should flat the given array', () => {
            const testArray = [1, [2, 3, [4, 5], 6], 7, [8, 9, [10]], 11];
            assert.deepStrictEqual(flat(testArray), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        });
    });
});
