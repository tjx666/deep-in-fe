const getTag = require('./getTag');

/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
 * @example
 *
 * isBoolean(false)
 * // => true
 *
 * isBoolean(null)
 * // => false
 */
function isBoolean(value) {
    return typeof value === 'boolean' || getTag(value) === '[object Boolean]';
}
