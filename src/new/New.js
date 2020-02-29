const isObject = require('../is/isObject');

/**
 * 模拟 new 运算符
 *
 * @param {Function} constructor 构造器
 * @param  {...any} args 参数
 * @returns {object}
 */
function New(constructor, ...args) {
    if (typeof constructor !== 'function') {
        throw new TypeError(`${constructor} is not a constructor`);
    }

    const target = Object.create(constructor.prototype);
    const result = constructor.apply(target, args);

    return isObject(result) ? result : target;
}

module.exports = New;
