/**
 * 扁平化数组
 *
 * 非递归解法，碰到数组就在当前位置插入结构后的元素
 *
 * @param {Array} array 待拍平的数组
 * @returns {Array} 拍平后的数组
 */
function flat(array) {
    const result = [...array];
    let index = 0;
    while (result[index] != null) {
        if (Array.isArray(result[index])) {
            result.splice(index, 1, ...result[index]);
        } else {
            index++;
        }
    }
    return result;
}

module.exports = flat;
