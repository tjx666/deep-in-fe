/**
 * 模拟实现 Function.prototype.call
 *
 * @param {Function} fn 被临时绑定 this 的函数
 * @param {*} thisArg fn 会被绑定到 thisArg 上
 * @param  {...any} args fn 的参数
 */
function myCall(fn, thisArg, ...args) {
    if (thisArg == null) {
        return fn(...args);
    }

    // 使用 Symbol 防止属性冲突
    const prop = Symbol('temporary property for fn');
    thisArg[prop] = fn;

    const result = thisArg[prop](...args);
    // 移除临时属性
    Reflect.deleteProperty(thisArg, prop);

    return result;
}

module.exports = myCall;
