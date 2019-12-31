const assert = require('assert');
const Promise = require('../../src/promise/MyPromise');

describe('#MyPromise', () => {
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
                    }, 100 * milliseconds);
                });
            };

            await Promise.race([addOne(1), addOne(3), addOne(10)]);
            assert(completedCount === 1);
        });

        it('race reject', async () => {
            try {
                // eslint-disable-next-line prefer-promise-reject-errors
                await Promise.race([Promise.reject(1), Promise.reject(2), Promise.reject(3)]);
            } catch (err) {
                assert(err[2] === 3);
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
});
