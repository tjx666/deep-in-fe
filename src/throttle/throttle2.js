/**
 * 节流
 * 第二种实现是使用定时器和 flag
 *
 * @param {Function} fn 被节流的函数
 * @param {number} delay 时间间隔
 * @returns {*} 如果 fn 被执行了边返回 fn 返回值，否则返回 undefined
 */
function throttle(fn, delay) {
    let flag = true;
    return function throttled(...args) {
        if (flag) {
            flag = false;
            setTimeout(() => {
                flag = true;
            }, delay);
            return fn.apply(this, args);
        }
    };
}
