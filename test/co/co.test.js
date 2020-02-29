const assert = require('assert');
const co = require('../../src/co/co');

const sleep = (seconds, value) => {
    return new Promise(resolve => {
        resolve(value);
    }, seconds * 1000);
};

describe('#co', () => {
    it('simple test co(gen)', async () => {
        function* gen() {
            const value = yield sleep(1, 666);
            assert.strictEqual(value, 666);
        }

        await co(gen);
    });

    it('test promise reject', async () => {
        const gen = function*() {
            try {
                // eslint-disable-next-line prefer-promise-reject-errors
                yield Promise.reject(666);
            } catch (error) {
                assert.strictEqual(error, 666);
            }
        };

        await co(gen);
    });

    it('test execute next throw exp', async () => {
        const gen = function*() {
            yield Promise.resolve(666);
            // eslint-disable-next-line no-throw-literal
            throw 666;
        };

        try {
            await co(gen);
        } catch (error) {
            assert.strictEqual(error, 666);
        }
    });

    it('test yield not arrowed value', async () => {
        const gen = function*() {
            yield 333;
        };

        try {
            await co(gen);
        } catch (error) {
            assert.ok(error instanceof TypeError);
        }
    });
});
