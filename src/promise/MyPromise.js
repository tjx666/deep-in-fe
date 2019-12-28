const PromiseStatus = Object.freeze({
    PENDING: Symbol('Promise(pending)'), // 初始状态
    FULFILLED: Symbol('Promise(fulfilled)'), // 成功执行
    REJECTED: Symbol('Promise(rejected)'), // 执行出错
});

class MyPromise {
    static resolvePromise(promise2, x, resolve, reject) {
        // 循环链检测
        if (promise2 === x) reject(new TypeError('Chaining cycle detected for promise #<Promise></Promise>'));

        if (x instanceof MyPromise) {
            // 如果 x 就是 promise
            if (x.status === PromiseStatus.PENDING) {
                // promise 状态是 pending
                x.then(value => {
                    // 递归解析
                    MyPromise.resolvePromise(promise2, value, resolve, reject);
                }).catch(reason => {
                    reject(reason);
                });
            } else if (x.status === PromiseStatus.FULFILLED) {
                // promise 状态时 fulfilled 直接 resolve
                resolve(x.value);
            } else if (x.status === PromiseStatus.REJECTED) {
                // promise 状态是 rejected，直接 reject
                reject(x.reason);
            }
        } else if (typeof x === 'function' || (typeof x === 'object' && x !== null)) {
            // x 是函数或者是对象
            let then;
            try {
                then = x.then;
            } catch (error) {
                // 获取 then 错误把 error 当成 reason reject
                reject(error);
            }

            if (typeof then === 'function') {
                // 如果 the 是函数
                const hadCalledKey = Symbol('function had been called!');

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
                    // 如果没处理过异常 reject(error)，处理过就啥都不干
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

    static resolve(valve) {
        return new MyPromise(resolve => resolve(valve));
    }

    static reject(valve) {
        return new MyPromise(reject => reject(valve));
    }

    static all(promises) {
        const length = promises;
        const values = [];

        return new MyPromise((resolve, reject) => {
            promises.forEach(promise => {
                promise
                    .then(value => {
                        values.push(value);
                        if (values.length === length) resolve(values);
                    })
                    .catch(reject);
            });
        });
    }

    static race(promises) {
        const length = promises;
        const errors = [];

        return new MyPromise((resolve, reject) => {
            promises.forEach(promise =>
                promise.then(resolve, error => {
                    errors.push(error);
                    if (errors.length === length) reject(errors);
                })
            );
        });
    }

    constructor(executor) {
        // 默认值
        this.status = PromiseStatus.PENDING;
        this.value = null;
        this.reason = null;
        this.onFulfilledCallback = value => {
            // 默认的回调也要检查是否循环链
            if (value === this) throw new TypeError('Chaining cycle detected for promise #<Promise>');

            return value;
        };

        this.onRejectedCallback = reason => {
            if (reason === this) throw new TypeError('Chaining cycle detected for promise #<Promise>');

            console.error(`UnhandledPromiseRejectionWarning: ${reason}`);
            console.error(
                `UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().`
            );
        };

        const resolve = value => {
            if (this.status === PromiseStatus.PENDING) {
                this.status = PromiseStatus.FULFILLED;
                this.value = value;

                setTimeout(this.onFulfilledCallback);
            }
        };

        const reject = reason => {
            if (this.status === PromiseStatus.PENDING) {
                this.status = PromiseStatus.REJECTED;
                this.reason = reason;

                setTimeout(this.onRejectedCallback);
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    /**
     *
     * @param {*} onfulfilled 在 executor 中调用 resolve(value) 后的回调
     * @param {*} onrejected 在 executor 中调用 reject(error) 或者抛出异常时的回调
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
            if (this.status === PromiseStatus.PENDING) {
                this.onFulfilledCallback = value => {
                    try {
                        const x = onfulfilled(value);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                };

                this.onRejectedCallback = reason => reject(reason);
            } else if (this.status === PromiseStatus.FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onfulfilled(this.value);
                        MyPromise.resolve(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this.status === PromiseStatus.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onrejected(this.reason);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });

        return promise2;
    };

    catch(onrejected) {
        this.then(null, onrejected);
    }

    finally(onFinally) {
        this.then(onFinally, onFinally);
    }
}

module.exports = MyPromise;
