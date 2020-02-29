const assert = require('assert');
const runPromiseInSequence = require('../../src/powerfulReduce/runPromiseInSequence');

describe('#runPromiseInSequence', () => {
    it('should run promise in sequence', async () => {
        // promise function 1
        function p1(a) {
            return new Promise((resolve, reject) => {
                resolve(a * 5);
            });
        }

        // promise function 2
        function p2(a) {
            return new Promise((resolve, reject) => {
                resolve(a * 2);
            });
        }

        // function 3  - will be wrapped in a resolved promise by .then()
        function f3(a) {
            return a * 3;
        }

        // promise function 4
        function p4(a) {
            return new Promise((resolve, reject) => {
                resolve(a * 4);
            });
        }

        const promiseArr = [p1, p2, f3, p4];
        const result = await runPromiseInSequence(promiseArr, 10);
        assert.strictEqual(result, 1200);
    });
});
