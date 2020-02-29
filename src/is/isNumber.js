const getTag = require('./getTag');

/**
 * 判断 value 是不是个数字，包括数字字面量和包装类实例
 *
 * @param {*} value
 * @returns {boolean}
 * @example
 *
 * isNumber(6);
 * // => true
 *
 * isNumber(new Number(6));
 * // => true
 *
 * isNumber('6');
 * // => false
 */
function isNumber(value) {
    return typeof value === 'number' || getTag(value) === '[object Number]';
}

module.exports = isNumber;
