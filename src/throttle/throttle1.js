/**
 * 节流
 * 节流的主要作用就像是水闸一样可以控制流速
 * 对应到代码里面就是让频繁触发的函数在指定的时间间隔内只能触发一次
 * 相对于防抖而言，实际应用场景更少一些
 * 第一种实现是使用比较时间戳的方式
 *
 * @param {Function} fn 被节流的函数
 * @param {number} delay 时间间隔
 * @returns {*} 如果 fn 被执行了边返回 fn 返回值，否则返回 undefined
 */
function throttle(fn, delay) {
    let lastExec;
    return function throttled(...args) {
        const now = Date.now();
        const shouldExec = lastExec === undefined || now - lastExec >= delay;
        if (shouldExec) {
            lastExec = now;
            return fn.apply(this, args);
        }
    };
}
