const assert = require('assert');
const reduceImplFilter = require('../../src/powerfulReduce/reduceImplFilter');

describe('#reduceImplFilter', () => {
    it('should return filtered array', () => {
        const array = [1, 2, 3, 4, 5];
        const predicate = value => value > 3;
        assert.deepStrictEqual(reduceImplFilter(array, predicate), array.filter(predicate));
    });
});
