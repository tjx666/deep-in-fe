/* eslint-disable no-use-before-define */

/**
 * 模拟 async/await 异步流程控制的工具函数
 *
 * @param {Function} generatorFn
 * @return {Promise}
 */
function co(generatorFn, ...args) {
    return new Promise((resolve, reject) => {
        // 获取生成器对象
        const generatorObj = typeof generatorFn === 'function' ? generatorFn.apply(this, args) : generatorFn;
        // 如果返回不是生成器对象就直接 resolve
        if (!isGenerator(generatorObj)) return resolve(generatorFn);

        function onFulfilled(value) {
            let result;

            try {
                result = generatorObj.next(value);
            } catch (err) {
                return reject(err);
            }

            next(result);
        }

        function onRejected(err) {
            let result;

            try {
                result = generatorFn.throw(err);
            } catch (err) {
                return reject(err);
            }

            next(result);
        }

        const next = result => {
            if (result.done) return resolve(result.value);

            const promise = toPromise.call(this, result.value);
            if (isPromise(promise)) return promise.then(onFulfilled, onRejected);

            return onRejected(
                new TypeError(
                    // prettier-ignore
                    `You may only yield a function, promise, generator, array, or object, but the following object was passed: "${String(result.value)}"`
                )
            );
        };

        onFulfilled();
    });
}

co.wrap = function(fn) {
    createPromise.__generatorFunction__ = fn;

    function createPromise(...args) {
        return co.call(this, fn.apply(this, args));
    }

    return createPromise;
};

function objectToPromise(obj) {
    const results = new obj.constructor();

    const defer = (promise, key) => {
        results[key] = undefined;
        promises.push(
            promise.then(value => {
                results[key] = value;
            })
        );
    };

    const promises = Object.entries(([key, value]) => {
        const promise = toPromise.call(this, value);

        if (isPromise(promise)) {
            defer(promise, key);
        } else {
            results[key] = value;
        }
    });

    return Promise.all(promises).then(() => results);
}

function toPromise(value) {
    if (!value) return value;
    if (isPromise(value)) return value;
    if (isGeneratorFunction(value) || isGenerator(value)) return co.call(this, value);
    if (Array.isArray(value)) return Promise.all(value.map(toPromise, this));
    if (isObject(value)) return objectToPromise(value);

    return value;
}

function isPromise(obj) {
    return typeof obj.then === 'function';
}

function isGenerator(obj) {
    return obj && typeof obj.next === 'function' && typeof obj.throw === 'function';
}

function isGeneratorFunction(obj) {
    const { constructor } = obj;

    if (!constructor) return false;
    if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') return true;

    return isGenerator(constructor.prototype);
}

function isObject(obj) {
    return obj && obj.constructor === Object;
}

// 兼容 esm 以及解构赋值
module.exports = co.default = co.co = co;
