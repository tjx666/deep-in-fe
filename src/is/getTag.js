/**
 * Gets the toStringTag of value
 *
 * @param {*} value The value to query
 * @returns {string}
 */
function getTag(value) {
    if (value === null) {
        return '[object Null]';
    }

    if (value === undefined) {
        return '[object Undefined]';
    }

    return Object.prototype.toString.call(value);
}

module.exports = getTag;
