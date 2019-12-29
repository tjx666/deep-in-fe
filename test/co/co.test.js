const assert = require('assert');
const co = require('../../src/co/co');

describe('#co', () => {
    const sleep = (seconds, value) => {
        return new Promise(resolve => {
            resolve(value);
        }, seconds * 1000);
    };

    describe('#co', () => {
        it('#simple test co(gen)', async () => {
            const gen = function*() {
                const value = yield sleep(1, 666);
                assert(value === 666);
            };

            await co(gen);
        });
    });

    describe('#wrap', () => {
        it('#simple test co.wrap', async () => {
            const gen = function*(v) {
                assert(v);
                const value = yield sleep(1, 666);
                assert(value === 666);
            };

            await co.wrap(gen)(true);
        });
    });
});
