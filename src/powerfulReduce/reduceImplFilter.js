/**
 * reduce 实现 filter
 *
 * @param {Array} array
 * @param {Function} predicate
 */
function reduceImplFilter(array, predicate) {
    return array.reduce((pre, current, index, self) => {
        if (predicate(current, index, self)) {
            pre.push(current);
        }
        return pre;
    }, []);
}

module.exports = reduceImplFilter;
