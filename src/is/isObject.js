/**
 * 判断 value 是不是一个对象
 *
 * @param {*} value
 * @returns {boolean}
 */
function isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}

module.exports = isObject;
