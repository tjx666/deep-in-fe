/**
 * 函数管道
 *
 * @param  {...Function} fns
 * @returns {Function}
 */
function pipe(...fns) {
    return input => fns.reduce((pre, current) => current(pre), input);
}

module.exports = pipe;
