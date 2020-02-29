const isObjectLike = require('./isObjectLike');
const getTag = require('./getTag');

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object, else `false`.
 * @example
 *
 * isArguments(function() { return arguments }())
 * // => true
 *
 * isArguments([1, 2, 3])
 * // => false
 */
function isArguments(value) {
    return isObjectLike(value) && getTag(value) === '[object Arguments]';
}

module.exports = isArguments;
