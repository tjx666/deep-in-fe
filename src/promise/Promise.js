/* eslint-disable promise/catch-or-return */
const { types } = require('util');
const isObject = require('../is/isObject');

function isThenable(value) {
    return !!(value && value.then);
}

class Promise {
    static _states = Object.freeze({
        PENDING: Symbol('pending'), // 初始状态
        FULFILLED: Symbol('fulfilled'), // 成功执行后的状态
        REJECTED: Symbol('rejected'), // 执行出错的状态
    });

    /**
     * Promise 构造器，接受一个函数作为参数，这个函数会传递两个函数参数：resolve 和 reject
     * @param {(resolve: (value) => any, reject: (reason) => any) => any} executor
     */
    constructor(executor) {
        // 默认值
        // promise 状态
        this._state = Promise._states.PENDING;
        // resolve 的值
        this._value = null;
        // reject 的值
        this._reason = null;
        this._caught = false;

        // executer 中 resolve 后执行的回调
        // 我们必须用数组存而不是一个回调函数，是因为同一个 promise 可能被多次调用
        // 例如：
        // const p = new Promise(() => {});
        // p.then(() => {});
        // p.then(() => {})
        this.onFulfilledMicroTasks = [];
        // executor 中 reject 时或者抛出错误时执行的回调
        this.onRejectedMicroTasks = [];

        this.onFulfilledMicroTasks.push(value => {
            // 默认的回调也要检查是否循环链，例如：
            // const p = new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         resolve(p);
            //     })
            // })
            if (value === this) {
                console.warn('Chaining cycle detected for promise #<Promise>');
            }
        });

        this.onRejectedMicroTasks.push(reason => {
            if (reason === this) {
                console.warn('Chaining cycle detected for promise #<Promise>');
                // eslint-disable-next-line no-useless-return
                return;
            }

            // 目前 node v12.16.1 和 chrome  80.0.3987.122 在没有 catch Promise 错误的情况下
            // 只会输出警告，不会影响后续代码的执行
            // 为了不影响我们 debug 这里先注释掉
            if (!this._caught) {
                console.error(`UnhandledPromiseRejectionWarning: ${reason}`);
                console.error(
                    `UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().`,
                );
            }
        });

        // executor 必须是函数类型
        if (typeof executor !== 'function') {
            throw new TypeError(`Promise resolver ${executor} is not a function`);
        }

        const resolve = value => {
            // 有可能用户在 executor 中多次调用 resolve 或者 reject
            if (this._state === Promise._states.PENDING) {
                this._state = Promise._states.FULFILLED;
                this._value = value;

                // 使用 setTimeout 模拟 micro task
                this.onFulfilledMicroTasks.forEach(microTask => setTimeout(() => microTask(value)));
            }
        };

        const reject = reason => {
            if (this._state === Promise._states.PENDING) {
                this._state = Promise._states.REJECTED;
                this._reason = reason;
                this.onRejectedMicroTasks.forEach(microTask => setTimeout(() => microTask(reason)));
            }
        };

        try {
            // 因为在 Promise 构造器中就直接同步直接了 executor
            // 所以 executor 中的代码时同步代码
            executor(resolve, reject);
        } catch (error) {
            // 出错直接 reject
            reject(error);
        }
    }

    /**
     * @param {function} onfulfilled 在 executor 中调用 resolve(value) 后的回调
     * @param {function} onrejected 在 executor 中调用 reject(error) 或者抛出异常时的回调
     */
    then = (onfulfilled, onrejected) => {
        // 处理回调不是函数的情况，要确保后续调用 then 和 catch 能继续拿到 value 和 error
        if (typeof onfulfilled !== 'function') onfulfilled = value => value;
        if (typeof onrejected === 'function') {
            this._caught = true;
        } else {
            onrejected = error => {
                throw error;
            };
        }

        // 链式调用一般就两种实现方式：
        // 1. 返回本身
        // 2. 返回一个新实例
        // 因为 then 中抛出异常会导致 Promise 状态从 fulfilled 变成 rejected
        // 并且 Promise A+ 规范规定: Promise 状态一旦发生改变不能发生变化
        // 所以我们采用返回新实例的方式来实现链式调用
        const promise2 = new Promise((resolve, reject) => {
            if (this._state === Promise._states.PENDING) {
                // pending 就 push 回调
                this.onFulfilledMicroTasks.push(value => {
                    try {
                        const x = onfulfilled(value);
                        Promise.resolvePromise(this, promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });

                this.onRejectedMicroTasks.push(reason => {
                    try {
                        const x = onrejected(reason);
                        Promise.resolvePromise(this, promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this._state === Promise._states.FULFILLED) {
                // 已经改变状态就直接执行回调
                setTimeout(() => {
                    try {
                        const x = onfulfilled(this._value);
                        Promise.resolvePromise(this, promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else if (this._state === Promise._states.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onrejected(this._reason);
                        Promise.resolvePromise(this, promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
        });

        return promise2;
    };

    /**
     * 处理 then 回调函数的返回值
     * @param {Promise} self 调用 then 函数的那个 promise
     * @param {Promise} promise2 新返回的 promise
     * @param {any} x then 返回值
     */
    static resolvePromise(self, promise2, x, resolve, reject) {
        if (self === x || promise2 === x) {
            // console.warn('Chaining cycle detected for promise #<Promise></Promise>')
            reject(new TypeError('Chaining cycle detected for promise #<Promise></Promise>'));
            return;
        }

        if (isObject(x)) {
            let resolvedOrRejected = false;

            // resolvePromise, rejectPromise 都是只能被调用一次
            const resolvePromise = y => {
                if (resolvedOrRejected) return;
                resolvedOrRejected = true;
                Promise.resolvePromise(self, promise2, y, resolve, reject);
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
            // 假设对 promise p 进行两次 then，也就是 p.then().then()
            // 为了让第二个 then 中的回调能正常执行，p.then() 返回的这个新的 promise 顺利执行的时候就必须 resole
            resolve(x);
        }
    }

    // 第一个参数不传即可
    catch(onrejected) {
        this.then(undefined, onrejected);
    }

    // 两个回调都设置为 onFinally
    finally(onFinally) {
        this.then(onFinally, onFinally);
    }

    static resolve(value) {
        // 如果 value 是 promise 就直接返回
        if (types.isPromise(value)) {
            return value;
        }

        // 不是 Promise 就返回新的 Promise
        return new Promise((resolve, reject) => {
            // 是 thenable 对象就追踪它的状态
            if (isThenable(value)) {
                value.then(
                    value => resolve(value),
                    reason => reject(reason),
                );
            } else {
                // 直接 resolve
                resolve(value);
            }
        });
    }

    // 返回一个 reject(reason) 的新 Promise 即可
    static reject(reason) {
        return new Promise((resolve, reject) => reject(reason));
    }

    static all(promises) {
        const resultValues = [];
        promises = Array.from(promises);

        if (promises.length === 0) {
            return Promise.resolve(resultValues);
        }

        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                if (!isThenable(promise)) {
                    promise = Promise.resolve(promise);
                }
                promise.then(
                    value => {
                        resultValues.push(value);
                        if (resultValues.length === promises.length) {
                            resolve(resultValues);
                        }
                    },
                    error => reject(error),
                );
            });
        });
    }

    // 结果为第一个出结果的 promise 的结果
    static race(promises) {
        promises = Array.from(promises);
        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(
                    value => resolve(value),
                    error => reject(error),
                );
            });
        });
    }

    // resolve 的 value 是和 promise 数组参数相同长度的对象
    // 其中每个元素 resolve 了就返回 { status: 'fulfilled', value }
    // reject 了就返回 { status: 'rejected', reason }
    static allSettled(promises) {
        promises = Array.from(promises);
        return new Promise((resolve, reject) => {
            const results = [];
            promises.forEach(promise => {
                if (!isThenable(promise)) {
                    promise = Promise.resolve(promise);
                }
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

    // promises-aplus-tests 库测试用的
    static resolved = value => {
        return new Promise(resolve => resolve(value));
    };
    static rejected = Promise.reject;
    static deferred() {
        const dfd = {};
        dfd.promise = new Promise((resolve, reject) => Object.assign(dfd, { resolve, reject }));
        return dfd;
    }
}

module.exports = Promise;
