const assert = require('assert');
const parseQuery = require('../../src/powerfulReduce/parseQuery');

describe('#parseQuery', () => {
    it('should return query object', () => {
        const queryString = 'name=ly&title=student';
        assert.deepStrictEqual(parseQuery(queryString), {
            name: 'ly',
            title: 'student',
        });
    });
});
