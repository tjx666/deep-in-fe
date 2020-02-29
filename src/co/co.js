/* eslint-disable no-use-before-define */
const { types } = require('util');

/**
 * 模拟 async/await 异步流程控制的工具函数
 * 为了便于理解，相对于 TJ 的 co 库精简了很多
 *
 * @param {Function} gen
 * @return {Promise}
 */
function co(gen, ...args) {
    // 返回一个新的 Promise
    return new Promise((resolve, reject) => {
        if (!types.isGeneratorFunction(gen)) {
            throw TypeError(`${gen} is not generator function!`);
        }

        const genObj = gen.apply(this, args);

        function onFulfilled(value) {
            let result;

            try {
                result = genObj.next(value);
            } catch (error) {
                return reject(error);
            }

            next(result);
        }

        function onRejected(error) {
            let result;

            try {
                result = genObj.throw(error);
            } catch (error) {
                return reject(error);
            }

            next(result);
        }

        function next(result) {
            if (result.done) return resolve(result.value);

            const promise = result.value;
            if (!types.isPromise(promise)) {
                return onRejected(
                    new TypeError(`You can only yield promise, but you yield${promise}`),
                );
            }

            // 递归 onFulfilled
            return promise.then(onFulfilled, onRejected);
        }

        onFulfilled();
    });
}

module.exports = co;
