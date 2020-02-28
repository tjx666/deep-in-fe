const assert = require('assert');
const Promise = require('../../src/promise/Promise');

describe('#Promise', () => {
    it('should throw Error when executor is not function', () => {
        assert.throws(() => {
            // eslint-disable-next-line no-new
            new Promise(123);
        });
    });

    it('should be reject when throw Error in executor', async () => {
        const error = new Error(6);
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => reject(error));
        });

        promise.catch(() => console.log(123));
        assert.rejects(promise, error);
    });

    describe('#all', () => {
        it('should count equals 6 after add', async () => {
            let count = 0;
            const add = amount => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        count += amount;
                        resolve();
                    });
                });
            };

            await Promise.all([add(1), add(2), add(3)]);
            assert.strictEqual(count, 6);
        });
    });

    describe('#race', () => {
        it('should only add one time', async () => {
            let count = 0;
            const addOne = milliseconds => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        count++;
                        resolve();
                    }, 1000 * milliseconds);
                });
            };

            await Promise.race([addOne(1), addOne(3), addOne(10)]);
            assert.strictEqual(count, 1);
        });

        it(`should race reject value be the first rejected promise's`, async () => {
            try {
                // eslint-disable-next-line prefer-promise-reject-errors
                await Promise.race([Promise.reject(1), Promise.reject(2), Promise.reject(3)]);
                assert.fail();
            } catch (err) {
                assert.strictEqual(err, 1);
            }
        });
    });

    describe('#finally', () => {
        it('should onFinally will be call even when reject', done => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject();
                }, 100);
            });

            // eslint-disable-next-line promise/catch-or-return
            promise.finally(() => done());
        });
    });

    describe('#allSettled', () => {
        it(`should return the right results`, async () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            const promise1 = Promise.reject(0);
            const promise2 = Promise.resolve(1);
            await Promise.allSettled([promise1, promise2]).then(results => {
                assert.deepStrictEqual(results, [
                    { status: 'rejected', reason: 0 },
                    { status: 'fulfilled', value: 1 },
                ]);
            });
        });
    });
});
