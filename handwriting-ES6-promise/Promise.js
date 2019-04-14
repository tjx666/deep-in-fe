const Status = {
    PENDING: Symbol('pending'),
    FULFILLED: Symbol('fulfilled'),
    REJECTED: Symbol('rejected'),
}

class MyPromise {
    constructor(executor) {
        this.status = Status.PENDING;
        this.value = null;
        this.reason = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            setTimeout(() => {
                if (this.status === Status.PENDING) {
                    this.status = Status.FULFILLED;
                    this.onFulfilledCallbacks.forEach(cb => cb);
                }
            });
        }

        const reject = (value) => {
            setTimeout(() => {
                if (this.status == Status.PENDING) {
                    this.reason = value;
                    this.onRejectedCallbacks(cb => cb());
                }
            })
        }

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        const self = this;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        };

        const promise2 = new MyPromise((resolve, reject) => {
            if (self.status === Status.PENDING) {
                self.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(self.value);
                        } catch (error) {
                            reject();
                        }
                    })
                })

                self.onRejectedCallbacks.push(() => {
                    try {
                        const x = onRejected(self.reason);
                    } catch (err) {
                        reject();
                    }
                })
            }
        });

    }

    static resolvePromise(promise2, x, reject, resolve) {
        if (promise2 === returnValue) throw new TypeError('Chaining cycle detected for promise #<Promise></Promise>');

        const isObjOrFunc = x !== null && (Object.prototype.toString.call(x) === '[object Object]' || Object.prototype.toString.call(x) === '[object Function]';
        try {
            const then = x.then;

            if (isObjOrFunc) {
                if (typeof then === 'function') {
                    x.then(y => {
                        resolvePromise(promise2, y, resolve, reject);
                    }, reason => {
                        reject(reason);
                    })
                }
            }
        } catch (err) {
            
        }
    }
}