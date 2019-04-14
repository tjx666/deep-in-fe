const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    static resolve(val) {
        return new MyPromise((resolve, reject) => {
            resolve(val)
        })
    }
    //reject方法
    static reject(val) {
        return new MyPromise((resolve, reject) => {
            reject(val)
        })
    }
    static all(promiseArr) {
        return new MyPromise((resolve, reject) => {
            let result = [];

            promiseArr.forEach((promise, index) => {
                promise.then((value) => {
                    result[index] = value;

                    if (result.length === promiseArr.length) {
                        resolve(result);
                    }
                }, reject);
            });
        });
    }
    static race(promiseArr) {
        return new MyPromise((resolve, reject) => {
            promiseArr.forEach(promise => {
                promise.then((value) => {
                    resolve(value);
                }, (err) => reject(err));
            });
        });
    }
    static deferred() {
        let dfd = {};
        dfd.promies = new MyPromise((resolve, reject) => {
            dfd.resolve = resolve;
            dfd.rfeject = reject;
        });
        return dfd;
    }

    constructor(executor) {
        this.state = PENDING;
        this.value = null;
        this.reason = null;
        // 存放成功回调的函数
        this.onFulfilledCallbacks = [];
        // 存放失败回调的函数
        this.onRejectedCallbacks = [];

        const resolve = value => {
            if (this.state === PENDING) {
                this.value = value;
                this.state = FULFILLED;
                this.onFulfilledCallbacks.map(fn => fn());
            }
        }

        const reject = value => {
            if (this.state === PENDING) {
                this.reason = value;
                this.state = REJECTED;
                this.onRejectedCallbacks.map(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        let self = this;
        let promise2 = null;
        //解决onFulfilled,onRejected没有传值的问题
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : y => y
        //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后then的resolve中捕获
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err;
        }

        promise2 = new MyPromise((resolve, reject) => {
            if (self.state === PENDING) {
                self.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(self.value);
                            self.resolvePromise(promise2, x, resolve, reject);
                        } catch (reason) {
                            reject(reason);
                        }
                    }, 0)

                });
                self.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(self.reason);
                            self.resolvePromise(promise2, x, resolve, reject);
                        } catch (reason) {
                            reject(reason);
                        }
                    }, 0);
                });
            }

            if (self.state === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value);
                        self.resolvePromise(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                }, 0);
            }

            if (self.state === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason);
                        self.resolvePromise(promise2, x, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                })
            }
        });

        return promise2;
    }

    resolvePromise(promise2, x, resolve, reject) {
        let self = this;
        let called = false; // called 防止多次调用
        //因为promise2是上一个promise.then后的返回结果，所以如果相同，会导致下面的.then会是同一个promise2，一直都是，没有尽头
        //相当于promise.then之后return了自己，因为then会等待return后的promise，导致自己等待自己，一直处于等待
        if (promise2 === x) {
            return reject(new TypeError('循环引用'));
        }
        //如果x不是null，是对象或者方法
        if (x !== null && (Object.prototype.toString.call(x) === '[object Object]' || Object.prototype.toString.call(x) === '[object Function]')) {
            // x是对象或者函数
            try {
                let then = x.then;

                if (typeof then === 'function') {
                    then.call(x, (y) => {
                        // 别人的Promise的then方法可能设置了getter等，使用called防止多次调用then方法
                        if (called) return;
                        called = true;
                        // 成功值y有可能还是promise或者是具有then方法等，再次resolvePromise，直到成功值为基本类型或者非thenable
                        self.resolvePromise(promise2, y, resolve, reject);
                    }, (reason) => {
                        if (called) return;
                        called = true;
                        reject(reason);
                    });
                } else {
                    if (called) return;
                    called = true;
                    resolve(x);
                }
            } catch (reason) {
                if (called) return;
                called = true;
                reject(reason);
            }
        } else {
            // x是普通值，直接resolve
            resolve(x);
        }
    }
    //catch方法
    catch (onRejected) {
        return this.then(null, onRejected)
    } finally(fn) {
        return this.then(value => {
            fn();
            return value;
        }, reason => {
            fn();
            throw reason;
        });
    }
}

const mp1 = MyPromise.resolve(1);
const mp2 = MyPromise.resolve(2);
const mp3 = MyPromise.resolve(3);
const mp4 = MyPromise.reject(4);

MyPromise.all([mp1, mp2, mp3]).then(x => {
    console.log(x);
}, (err) => {
    console.log('err1', err);
})
MyPromise.race([mp1, mp4, mp2, mp3]).then(x => {
    console.log(x);
}, (err) => {
    console.log('err2', err);
})

var mp = new MyPromise((resolve, reject) => {
    console.log(11111);
    setTimeout(() => {
        resolve(22222);
        console.log(3333);
    }, 1000);
});
mp.then(x => {
    console.log(x);
}, (err) => {
    console.log('err2', err);
})