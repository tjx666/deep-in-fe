/**
 * 扁平化数组
 * 思路一：也是最先想到的思路，遍历每个元素，如果是数组就递归它
 * @param {Array} array 待拍平的数组
 * @returns {Array} 拍平后的数组
 */
function flat(array) {
    return array.reduce(
        (result, current) => result.concat(Array.isArray(current) ? flat(current) : current),
        [],
    );
}

module.exports = flat;
