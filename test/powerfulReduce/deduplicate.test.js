const assert = require('assert');
const deduplicate = require('../../src/powerfulReduce/deduplicate');

describe('#deduplicate', () => {
    it('should return query object', () => {
        const array = [1, 2, 2, 3, 4, 4, 3, 5, 7, 6, 6, 6];
        assert.deepStrictEqual(deduplicate(array), [1, 2, 3, 4, 5, 7, 6]);
    });
});
