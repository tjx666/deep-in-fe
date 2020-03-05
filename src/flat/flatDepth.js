/**
 * 指定深度的 flat
 *
 * @param {Array} array 待拍平的数组
 * @param {number} [depth=1] 拍平深度
 * @returns {Array} 拍平后的数组
 */
function flatDepth(array, depth = 1) {
    function flatDeepClosure(array, currentDepth) {
        if (currentDepth > depth) {
            return array;
        }

        return array.reduce(
            (result, current) =>
                result.concat(
                    Array.isArray(current) ? flatDeepClosure(current, currentDepth + 1) : current,
                ),
            [],
        );
    }

    return flatDeepClosure(array, 1);
}

module.exports = flatDepth;
