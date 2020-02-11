const isObject = require('../is/isObject');

module.exports = class MyPromise {
    static _states = Object.freeze({
        PENDING: Symbol('pending'), // 初始状态
        FULFILLED: Symbol('fulfilled'), // 成功执行后的状态
        REJECTED: Symbol('rejected'), // 执行出错的状态
    });

    /**
     * Promise 构造器
     *
     * @param {(resolve: (value) => void, reject: (reason) => void) => void} executor
     */
    constructor(executor) {
        // 默认值
        this.state = MyPromise._states.PENDING;
        this.value = null;
        this.reason = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        // executor 必须是函数类型
        if (typeof executor !== 'function') {
            throw new TypeError(`Promise resolver ${executor} is not a function`);
        }

        this.onFulfilledCallbacks.push(value => {
            // 默认的回调也要检查是否循环链
            if (value === this)
                throw new TypeError('Chaining cycle detected for promise #<Promise>');
            return value;
        });

        this.onRejectedCallbacks.push(reason => {
            // 如果没有 cache 抛 TypeError 和报警告
            if (reason === this)
                throw new TypeError('Chaining cycle detected for promise #<Promise>');

            // console.error(`UnhandledPromiseRejectionWarning: ${reason}`);
            // console.error(
            //     `UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().`
            // );
        });

        const resolve = value => {
            // 如果已经 resolve 或者 reject 再调用应该忽略
            if (this.state === MyPromise._states.PENDING) {
                this.state = MyPromise._states.FULFILLED;
                this.value = value;

                // 使用 setTimeout 模拟 micro task
                this.onFulfilledCallbacks.forEach(cb => setTimeout(() => cb(this.value), 0));

                // 清空回调
                this.onFulfilledCallbacks = null;
                this.onRejectedCallbacks = null;
            }
        };

        const reject = reason => {
            if (this.state === MyPromise._states.PENDING) {
                this.state = MyPromise._states.REJECTED;
                this.reason = reason;

                this.onRejectedCallbacks.forEach(cb => setTimeout(() => cb(reason), 0));

                this.onFulfilledCallbacks = null;
                this.onRejectedCallbacks = null;
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            // 出错直接 reject
            reject(error);
        }
    }

    /**
     *
     * @param {function} onfulfilled 在 executor 中调用 resolve(value) 后的回调
     * @param {function} onrejected 在 executor 中调用 reject(error) 或者抛出异常时的回调
     */
    then = (onfulfilled, onrejected) => {
        // 处理回调不是函数的情况，要确保后续调用 then 和 catch 能继续拿到 value 和 error
        if (typeof onfulfilled !== 'function') onfulfilled = value => value;
        if (typeof onrejected !== 'function') {
            onrejected = error => {
                throw error;
            };
        }

        // 链式调用一般就两种实现方式：
        // 1. 返回本身
        // 2. 返回一个新对象
        // 因为 then 中抛出异常会导致 Promise 状态从 fulfilled 变成 rejected
        // 但是 A+ 规范规定: Promise 状态一旦发生改变不能发生变化，所以我们采用返回新实例的方式来实现链式调用
        const promise2 = new MyPromise((resolve, reject) => {
            if (this.state === MyPromise._states.PENDING) {
                // pending 就 push 回调
                this.onFulfilledCallbacks.push(value => {
                    try {
                        const x = onfulfilled(value);
                        MyPromise._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });

                this.onRejectedCallbacks.push(reason => {
                    try {
                        const x = onrejected(reason);
                        MyPromise._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this.state === MyPromise._states.FULFILLED) {
                // 已经改变状态就直接执行回调
                setTimeout(() => {
                    try {
                        const x = onfulfilled(this.value);
                        MyPromise._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else if (this.state === MyPromise._states.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onrejected(this.reason);
                        MyPromise._resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
        });

        return promise2;
    };

    // 第一个参数不传即可
    catch(onrejected) {
        this.then(null, onrejected);
    }

    // 两个回调都设置为 onFinally
    finally(onFinally) {
        this.then(onFinally, onFinally);
    }

    // 返回一个 resolve(value) 的新 Promise 即可
    static resolve(valve) {
        return new MyPromise(resolve => resolve(valve));
    }

    // 返回一个 reject(value) 的新 Promise 即可
    static reject(reason) {
        return new MyPromise((resolve, reject) => reject(reason));
    }

    static all(promises) {
        const resultValues = [];
        promises = Array.from(promises);

        if (promises.length === 0) {
            return MyPromise.resolve(resultValues);
        }

        return new MyPromise((resolve, reject) => {
            promises.forEach(p => {
                const isPromiseLike = p && p.then;
                if (!isPromiseLike) {
                    p = MyPromise.resolve(p);
                }
                p.then(
                    value => {
                        resultValues.push(value);
                        if (resultValues.length === promises.length) {
                            resolve(resultValues);
                        }
                    },
                    err => reject(err),
                );
            });
        });
    }

    // 结果为第一个出结果的 promise 的结果
    static race(promises) {
        promises = Array.from(promises);
        return new MyPromise((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(
                    value => resolve(value),
                    err => reject(err),
                );
            });
        });
    }

    static allSettled(promises) {
        promises = Array.from(promises);
        return new MyPromise((resolve, reject) => {
            const results = [];
            promises.forEach(promise => {
                promise
                    .then(
                        value => results.push({ status: 'fulfilled', value }),
                        reason => results.push({ status: 'rejected', reason }),
                    )
                    .finally(() => {
                        if (results.length === promises.length) resolve(results);
                    });
            });
        });
    }

    // 处理 then 回调函数的返回值
    static _resolvePromise(promise2, x, resolve, reject) {
        // 循环链检测
        if (promise2 === x) {
            reject(new TypeError('Chaining cycle detected for promise #<Promise></Promise>'));
            return;
        }

        if (isObject(x)) {
            let resolvedOrRejected = false;

            // resolvePromise, rejectPromise 都是只能被调用一次
            const resolvePromise = y => {
                if (resolvedOrRejected) return;
                resolvedOrRejected = true;
                MyPromise._resolvePromise(promise2, y, resolve, reject);
            };

            const rejectPromise = r => {
                if (resolvedOrRejected) return;
                resolvedOrRejected = true;
                reject(r);
            };

            // x 是函数或者是对象
            let then;
            try {
                then = x.then;
            } catch (error) {
                // 获取 then 出错，把 error 当成 reason 去 reject
                reject(error);
            }

            if (typeof then === 'function') {
                try {
                    then.call(x, resolvePromise, rejectPromise);
                } catch (error) {
                    // 如果没处理过异常就 reject(error)，处理过即调用过 resolvePromise, rejectPromise 就啥都不干
                    if (!resolvedOrRejected) {
                        reject(error);
                        resolvedOrRejected = true;
                    }
                }
            } else {
                resolve(x);
            }
        } else {
            resolve(x);
        }
    }

    // promises-aplus-tests 库测试用的
    static resolved = MyPromise.resolve;
    static rejected = MyPromise.reject;
    static deferred() {
        const dfd = {};
        dfd.promise = new MyPromise((resolve, reject) => Object.assign(dfd, { resolve, reject }));
        return dfd;
    }
};
