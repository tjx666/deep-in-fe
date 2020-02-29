const isObjectLike = require('./isObjectLike');
const getTag = require('./getTag');

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1
 * }
 *
 * isPlainObject(new Foo)
 * // => false
 *
 * isPlainObject([1, 2, 3])
 * // => false
 *
 * isPlainObject({ 'x': 0, 'y': 0 })
 * // => true
 *
 * isPlainObject(Object.create(null))
 * // => true
 */
function isPlainObject(value) {
    if (!isObjectLike(value || getTag(value) !== '[object Object]')) {
        return false;
    }

    if (Reflect.getPrototypeOf(value) === null) {
        return true;
    }

    return Reflect.getPrototypeOf(value) === Object.prototype;
}

module.exports = isPlainObject;
