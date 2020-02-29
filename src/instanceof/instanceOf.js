const isObject = require('../is/isObject');

/**
 * 简单来说就是判断构造器的 prototype 是否是实例对象的原型
 *
 * @param {object} obj
 * @param {Function} constructor
 */
function instanceOf(obj, constructor) {
    if (!isObject(constructor)) {
        throw new TypeError(`Right-hand side of 'instanceof' is not an object`);
    } else if (typeof constructor !== 'function') {
        throw new TypeError(`Right-hand side of 'instanceof' is not callable`);
    }

    return constructor.prototype.isPrototypeOf(obj);
}

module.exports = instanceOf;
