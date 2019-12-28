const PromiseStates = Object.freeze({
    PENDING: Symbol('Promise(pending)'), // 初始状态
    FULFILLED: Symbol('Promise(fulfilled)'), // 成功执行
    REJECTED: Symbol('Promise(rejected)'), // 执行出错
});

class MyPromise {
    // promises-aplus-tests 测试用的
    static deferred() {
        const dfd = {};
        dfd.promise = new Promise((resolve, reject) => Object.assign(dfd, { resolve, reject }));
        return dfd;
    }

    // 处理 promise.then 的返回值
    static resolvePromise(promise2, x, resolve, reject) {
        // 循环链检测
        if (promise2 === x) reject(new TypeError('Chaining cycle detected for promise #<Promise></Promise>'));

        if (x instanceof MyPromise) {
            // 如果 x 就是 promise，针对不同的状态处理
            if (x.state === PromiseStates.PENDING) {
                // promise 状态是 pending
                // 对执行结果递归
                // 执行出错 reject
                x.then(value => MyPromise.resolvePromise(promise2, value, resolve, reject)).catch(reason =>
                    reject(reason)
                );
            } else if (x.state === PromiseStates.FULFILLED) {
                // promise 状态时 fulfilled 直接 resolve
                resolve(x.value);
            } else if (x.state === PromiseStates.REJECTED) {
                // promise 状态是 rejected，直接 reject
                reject(x.reason);
            }
        } else if (typeof x === 'function' || (typeof x === 'object' && x !== null)) {
            // x 是函数或者是对象
            let then;
            try {
                then = x.then;
            } catch (error) {
                // 获取 then 出错，把 error 当成 reason 去 reject
                reject(error);
            }

            if (typeof then === 'function') {
                // 如果 then 是函数
                const hadCalledKey = Symbol('function had been called!');

                // resolvePromise, rejectPromise 都是只能被调用一次
                const resolvePromise = y => {
                    if (resolvePromise[hadCalledKey]) return;
                    MyPromise.resolvePromise(promise2, y, resolve, reject);
                    resolvePromise[hadCalledKey] === true;
                };

                const rejectPromise = r => {
                    if (rejectPromise[hadCalledKey]) return;
                    reject(r);
                    rejectPromise[hadCalledKey] = true;
                };

                try {
                    then.call(x, resolvePromise, rejectPromise);
                } catch (error) {
                    // 如果没处理过异常就 reject(error)，处理过即调用过 resolvePromise, rejectPromise 就啥都不干
                    if (!resolvePromise[hadCalledKey] && !rejectPromise(hadCalledKey)) {
                        reject(error);
                    }
                }
            } else {
                resolve(x);
            }
        } else {
            resolve(x);
        }
    }

    // 返回一个 resolve(value) 的新 Promise 即可
    static resolve(valve) {
        return new MyPromise(resolve => resolve(valve));
    }

    // 返回一个 reject(value) 的新 Promise 即可
    static reject(valve) {
        return new MyPromise(reject => reject(valve));
    }

    static all(promises) {
        const length = promises;
        const values = [];

        // 返回一个新的 Promise
        return new MyPromise((resolve, reject) => {
            promises.forEach(promise => {
                promise
                    .then(value => {
                        values.push(value);
                        // 所有 promises 都 resolve 才 resolve 外部的 promise
                        if (values.length === length) resolve(values);
                    })
                    // 一个 promise reject 外部的 promise 就 reject
                    .catch(reject);
            });
        });
    }

    static race(promises) {
        const length = promises;
        const errors = [];

        return new MyPromise((resolve, reject) => {
            promises.forEach(promise =>
                // 一个 promise resolve 外部的 promise 就 promise
                promise.then(resolve, error => {
                    errors.push(error);
                    // 所有 promises 都 reject，外部的 promise 才 reject
                    if (errors.length === length) reject(errors);
                })
            );
        });
    }

    /**
     * Promise 构造器
     *
     * @param {(resolve: (value) => void, reject: (reason) => void) => void} executor
     */
    constructor(executor) {
        // 默认值
        this.state = PromiseStates.PENDING;
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
            if (value === this) throw new TypeError('Chaining cycle detected for promise #<Promise>');

            return value;
        });

        this.onRejectedCallback.push(reason => {
            // 如果没有 cache 抛 TypeError 和报警告
            if (reason === this) throw new TypeError('Chaining cycle detected for promise #<Promise>');

            console.error(`UnhandledPromiseRejectionWarning: ${reason}`);
            console.error(
                `UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().`
            );
        });

        const resolve = value => {
            // 如果已经 resolve 或者 reject 再调用应该忽略
            if (this.state === PromiseStates.PENDING) {
                this.state = PromiseStates.FULFILLED;
                this.value = value;

                // 使用 setTimeout 模拟 micro task
                this.onFulfilledCallbacks.forEach(cb => setTimeout(() => cb(this.value), 0));
            }
        };

        const reject = reason => {
            if (this.state === PromiseStates.PENDING) {
                this.state = PromiseStates.REJECTED;
                this.reason = reason;

                this.onRejectedCallbacks.forEach(cb => setTimeout(() => cb(reason), 0));
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
            if (this.state === PromiseStates.PENDING) {
                // pending 就 push 回调
                this.onFulfilledCallbacks.push(value => {
                    try {
                        const x = onfulfilled(value);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });

                this.onRejectedCallbacks.push(reason => {
                    try {
                        const x = onrejected(reason);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this.state === PromiseStates.FULFILLED) {
                // 已经改变状态就直接执行回调
                setTimeout(() => {
                    try {
                        const x = onfulfilled(this.value);
                        MyPromise.resolve(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else if (this.state === PromiseStates.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onrejected(this.reason);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
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
}

module.exports = MyPromise;
