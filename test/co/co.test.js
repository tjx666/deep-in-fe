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

        it('#test promise reject', async () => {
            const gen = function*() {
                try {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    yield Promise.reject(666);
                } catch (err) {
                    assert(err === 666);
                }
            };

            await co(gen);
        });

        it('#yield generatorFunction', async () => {
            const gen1 = function*() {
                yield sleep(1, 666);
            };
            const gen2 = function*() {
                yield gen1;
            };

            await co(gen2);
        });

        it('#yield Object', async () => {
            const gen = function*() {
                const value = yield { a: sleep(1, 666) };
                console.log(value);
                assert(value.a === 666);
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
