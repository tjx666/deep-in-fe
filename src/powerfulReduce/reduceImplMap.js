/**
 * reduce 实现 map
 * 因为 map 是返回一个数组，所以初始值肯定是空数组
 *
 * @param {Array} array 被映射的数组
 * @param {Function} iteratee 映射函数
 * @returns {Array}
 */
function reduceImplMap(array, iteratee) {
    return array.reduce((pre, current, index, self) => {
        pre.push(iteratee(current, index, self));
        return pre;
    }, []);
}

module.exports = reduceImplMap;
