const { toString } = Object.prototype;

/**
 * Gets the toStringTag of value
 *
 * @param {*} value The value to query
 */
const getTag = (value) => {
    if (value === null) return '[object Null]';
    if (value === undefined) return '[object Undefined]';
    return toString.call(value);
};

module.exports = getTag;
