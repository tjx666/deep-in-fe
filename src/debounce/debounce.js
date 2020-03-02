/**
 * 防抖
 * 防抖主要用于防止函数在短时间没必要的频繁触发
 *
 * @param {Function} fn 需要被防抖的函数
 * @param {number} delay 延迟时间
 * @param {boolean} [immediate] 是否立即执行
 * @returns {Promise}
 */
function debounce(fn, delay, immediate) {
    let timerId;
    function debouncedFn(...args) {
        return new Promise(resolve => {
            if (timerId !== undefined) {
                clearTimeout(timerId);
            }

            if (immediate && timerId === undefined) {
                timerId = setTimeout(() => {
                    timerId = undefined;
                }, delay);
                resolve(fn.apply(this, args));
            } else {
                timerId = setTimeout(() => {
                    resolve(fn.apply(this, args));
                    timerId = undefined;
                }, delay);
            }
        });
    }

    debouncedFn.cancel = function() {
        clearTimeout(timerId);
        timerId = undefined;
    };

    return debouncedFn;
}

if (typeof module != 'undefined') {
    module.exports = debounce;
}
