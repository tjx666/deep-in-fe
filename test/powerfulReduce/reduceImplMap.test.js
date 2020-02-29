const assert = require('assert');
const reduceImplMap = require('../../src/powerfulReduce/reduceImplMap');

describe('#reduceImplMap', () => {
    it('should return mapped array', () => {
        const array = [1, 2, 3];
        const iteratee = value => value + 1;
        assert.deepStrictEqual(reduceImplMap(array, iteratee), array.map(iteratee));
    });
});
