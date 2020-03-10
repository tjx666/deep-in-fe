const myCall = require('./myCall');

/**
 * myApply 和 myCall 只是 fn 的参数形式不一样而已
 *
 * @param {Function} fn
 * @param {*} thisArg
 * @param {Array} args
 */
function myApply(fn, thisArg, args = []) {
    return myCall(fn, thisArg, ...args);
}

module.exports = myApply;
