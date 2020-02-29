const assert = require('assert');
const pipe = require('../../src/powerfulReduce/functionPipe');

describe('#functionPipe', () => {
    it('should pipe the function', () => {
        const double = x => x + x;
        const triple = x => 3 * x;
        const quadruple = x => 4 * x;
        const multiply24 = pipe(double, triple, quadruple);
        assert.strictEqual(multiply24(10), 240);
    });
});
