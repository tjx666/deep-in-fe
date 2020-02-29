/**
 * 数组去重
 *
 * @param {Array} array
 * @returns {Array}
 */
function deduplicate(array) {
    return array.reduce((result, value) => {
        if (!result.includes(value)) {
            result.push(value);
        }
        return result;
    }, []);
}

module.exports = deduplicate;
