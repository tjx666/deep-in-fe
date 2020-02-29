/**
 * 解析 url queryString
 *
 * @param {string} queryString
 * @returns {object}
 */
function parseQuery(queryString) {
    return queryString.split('&').reduce((result, keyValueStr) => {
        const [key, value] = keyValueStr.split('=');
        result[key] = value;
        return result;
    }, {});
}

module.exports = parseQuery;
