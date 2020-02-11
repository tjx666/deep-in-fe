/* eslint-disable prefer-promise-reject-errors */
const assert = require('assert');
const Promise = require('../../src/promise/MyPromise');

describe('#MyPromise', () => {
    it('should throw Error when executor is not function', () => {
        assert.throws(() => {
            // eslint-disable-next-line no-new
            new Promise(123);
        });
    });

    it('should be reject when throw Error is executor', done => {
        new Promise(() => {
            throw new Error();
        }).catch(() => done());
    });

    describe('#Promise.all', () => {
        it('addOne three times completedCount === 3', async () => {
            let completedCount = 0;
            const addOne = () => {
                return new Promise(resolve => {
                    completedCount++;
                    resolve();
                });
            };

            await Promise.all([addOne(), addOne(), addOne()]);
            assert(completedCount === 3);
        });
    });

    describe('#Promise.race', () => {
        it('addOne one time', async () => {
            let completedCount = 0;
            const addOne = milliseconds => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        completedCount++;
                        resolve();
                    }, 1000 * milliseconds);
                });
            };

            await Promise.race([addOne(1), addOne(3), addOne(10)]);
            assert.equal(completedCount, 1);
        });

        it('race reject', async () => {
            try {
                // eslint-disable-next-line prefer-promise-reject-errors
                await Promise.race([Promise.reject(1), Promise.reject(2), Promise.reject(3)]);
            } catch (err) {
                assert(err === 1);
            }
        });
    });

    describe('finally', () => {
        it('onFinally will be call when reject', done => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject();
                }, 100);
            });

            promise.finally(() => done());
        });
    });

    describe('#allSettled', () => {
        it('simple test allSettled', async () => {
            const promise1 = Promise.reject(0);
            const promise2 = Promise.resolve(1);
            await Promise.allSettled([promise1, promise2]).then(results => {
                assert.deepEqual(results, [
                    { status: 'rejected', reason: 0 },
                    { status: 'fulfilled', value: 1 },
                ]);
            });
        });
    });
});
