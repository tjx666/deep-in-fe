class MyPromise {
    // Promise 三种状态
    static status = {
        PENDING: Symbol('Promise(pending)'), // 初始状态
        FULFILLED: Symbol('Promise(fulfilled)'), // 成功执行
        REJECTED: Symbol('Promise(rejected)'), // 执行出错
    };

    static resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) throw new TypeError('Chaining cycle detected for promise #<Promise></Promise>');
        const isObject =
            x !== null &&
            (Object.prototype.toString.call(x) === '[object Object]' ||
                Object.prototype.toString.call(x) === '[object Function]');

        if (isObject) {
            const { then } = x;
            if (typeof then === 'function') {
                if (x.__called__) return;
                x.__called__ = true;
                try {
                    x.then(
                        y => {
                            MyPromise.resolvePromise(promise2, y, resolve, reject);
                        },
                        reason => {
                            reject(reason);
                        }
                    );
                } catch (reason) {
                    if (x.__called__) return;
                    x.__called__ = true;
                    reject(reason);
                }
            } else {
                if (x.__called__) return;
                x.__called__ = true;
                resolve(x);
            }
        } else {
            resolve(x);
        }
    }

    static resolve(valve) {
        return new MyPromise((resolve, reject) => {
            resolve(valve);
        });
    }

    static reject(valve) {
        return new MyPromise((resolve, reject) => {
            reject(valve);
        });
    }

    static all(promiseArray) {
        const resultArray = [];

        return new MyPromise((resolve, reject) => {
            promiseArray.forEach(promise => {
                promise
                    .then(data => {
                        resultArray.push(data);
                        if (resultArray.length === promiseArray.length) resolve(resultArray);
                    })
                    .catch(reject);
            });
        });
    }

    static race(promiseArray) {
        const errArray = [];

        return new MyPromise((resolve, reject) => {
            promiseArray.forEach(promise =>
                promise.then(resolve, err => {
                    errArray.push(err);
                    if (errArray.length === promiseArray.length) reject(errArray);
                })
            );
        });
    }

    constructor(executor) {
        this.MyPromise = MyPromise.status.PENDING;
        this.value = null;
        this.reason = null;
        this.onFulfilledCallback = value => value;
        this.onRejectedCallback = reason => {
            console.warn(`UnhandledPromiseRejectionWarning: ${JSON.stringify(reason)}`);
        };

        const resolve = value => {
            setTimeout(() => {
                if (this.MyPromise === MyPromise.status.PENDING) {
                    this.MyPromise = MyPromise.status.FULFILLED;
                    this.value = value;
                    this.onFulfilledCallback();
                }
            });
        };

        const reject = reason => {
            setTimeout(() => {
                if (this.MyPromise === MyPromise.status.PENDING) {
                    this.MyPromise = MyPromise.status.REJECTED;
                    this.reason = reason;
                    this.onRejectedCallback();
                }
            });
        };

        try {
            executor(resolve, reject);
        } catch (reason) {
            reject(reason);
        }
    }

    /**
     *
     * @param {*} onFulfilled 在 executor 中调用 resolve(result) 后的回调
     * @param {*} onRejected 在 executor 中调用 reject(err) 或者抛出异常时的回调
     */
    then = (onFulfilled, onRejected) => {
        // 处理回调不是函数的情况，要确保后续调用 then 和 catch 能继续拿到 result 和 err
        if (typeof onFulfilled !== 'function') onFulfilled = result => result;
        if (typeof onRejected !== 'function') {
            onRejected = err => {
                throw err;
            };
        }

        // 链式调用一般就两种实现方式：
        // 1. 返回本身
        // 2. 返回一个新对象
        // 因为 then 中抛出异常会导致 Promise 状态从 fulfilled 变成 rejected
        // 但是 A+ 规范规定: Promise 状态一旦发生改变不能发生变化，所以我们采用返回新实例的方式来实现链式调用
        const promise2 = new MyPromise((resolve, reject) => {
            if (this.MyPromise === MyPromise.status.PENDING) {
                this.onFulfilledCallback = () => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value);
                            MyPromise.resolvePromise(promise2, x, resolve, reject);
                        } catch (reason) {
                            reject(reason);
                        }
                    });
                };

                this.onRejectedCallback = () => {
                    try {
                        const x = onRejected(this.reason);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                };
            } else if (this.MyPromise === MyPromise.status.FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        MyPromise.resolve(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                });
            } else if (this.MyPromise === MyPromise.status.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                });
            }
        });

        return promise2;
    };

    catch(onReject) {
        this.then(null, onReject);
    }

    finally(onFinally) {
        this.then(
            () => {
                onFinally();
            },
            reason => {
                onFinally();
                throw reason;
            }
        );
    }
}

module.exports = MyPromise;
