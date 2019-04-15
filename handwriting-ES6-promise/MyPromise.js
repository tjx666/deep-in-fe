const Status = {
    PENDING: Symbol('pending'),
    FULFILLED: Symbol('fulfilled'),
    REJECTED: Symbol('rejected'),
}

class MyPromise {
    static resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) throw new TypeError('Chaining cycle detected for promise #<Promise></Promise>');
        const isObjOrFunc = x !== null && (Object.prototype.toString.call(x) === '[object Object]' || Object.prototype.toString.call(x) === '[object Function]');

        if (isObjOrFunc) {
            const then = x.then;
            if (typeof then === 'function') {
                if (x.__called__) return;

                try {
                    x.then(y => {
                        x.__called__ = true;
                        MyPromise.resolvePromise(promise2, y, resolve, reject);
                    }, reason => {
                        x.__called__ = true;
                        reject(reason);
                    })
                } catch (reason) {
                    reject(reason);
                }
            } else {
                resolve(x);
            }
        } else {
            resolve(x);
        }
    }

    static resolve(valve) {
        return new MyPromise((resolve, reject) => {
            resolve(valve);
        })
    }

    static reject(valve) {
        return new MyPromise((resolve, reject) => {
            reject(valve);
        })
    }

    static all(promiseArray) {
        const resultArray = [];

        return new MyPromise((resolve, reject) => {
            promiseArray.forEach(promise => {
                promise.then(data => {
                    resultArray.push(data);
                    if (resultArray.length === promiseArray.length) resolve(resultArray);
                }).catch(reject);
            })
        });
    }

    static race(promiseArray) {
        let errArray = [];

        return new MyPromise((resolve, reject) => {
            promiseArray.forEach(promise => promise.then(resolve, err => {
                errArray.push(err);
                if (errArray.length === promiseArray.length) reject(errArray);
            }));
        })
    }

    constructor(executor) {
        this.status = Status.PENDING;
        this.value = null;
        this.reason = null;
        this.onFulfilledCallback = value => value;
        this.onRejectedCallback = (reason) => {
            console.warn(`UnhandledPromiseRejectionWarning: ${JSON.stringify(reason)}`);
        }

        const resolve = (value) => {
            setTimeout(() => {
                if (this.status === Status.PENDING) {
                    this.status = Status.FULFILLED;
                    this.value = value;
                    this.onFulfilledCallback();
                }
            });
        }

        const reject = (reason) => {
            setTimeout(() => {
                if (this.status == Status.PENDING) {
                    this.status = Status.REJECTED;
                    this.reason = reason;
                    this.onRejectedCallback();
                }
            })
        }

        try {
            executor(resolve, reject);
        } catch (reason) {
            reject(reason);
        }
    }

    then(onFulfilled, onRejected) {
        const self = this;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err;
        };

        const promise2 = new MyPromise((resolve, reject) => {
            if (self.status === Status.PENDING) {
                self.onFulfilledCallback = () => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(self.value);
                            MyPromise.resolvePromise(promise2, x, resolve, reject);
                        } catch (reason) {
                            reject(reason);
                        }
                    })
                }

                self.onRejectedCallback = () => {
                    try {
                        const x = onRejected(self.reason);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                }
            } else if (self.status === Status.FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(self.value);
                        MyPromise.resolve(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                })
            } else if (self.status === Status.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(self.reason);
                        MyPromise.resolvePromise(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                })
            }
        });

        return promise2;
    }

    catch (onReject) {
        this.then(null, onReject);
    }

    finally(onFinally) {
        this.then(() => {
            onFinally();
        }, (reason) => {
            onFinally();
            throw reason;
        })
    }
}

module.exports = MyPromise;