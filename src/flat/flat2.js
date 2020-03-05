/**
 * 扁平化数组
 *
 * 适合数字数组拍平
 *
 * @param {Array} array 待拍平的数组
 * @returns {Array} 拍平后的数组
 */
function flat(array) {
    return array
        .toString()
        .split(',')
        .map(numStr => Number(numStr));
}

module.exports = flat;
