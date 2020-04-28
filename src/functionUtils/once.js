/**
 * 返回一个新函数，多次调用这个新函数只会执行一次
 * @param {Function} fn
 */
function once(fn) {
    let called = false;
    return function onceFn(...args) {
        if (called === false) {
            fn.apply(this, args);
            called = true;
        }
    };
}

module.exports = once;

// function log() {
//     console.log(this.a);
// }
// const boundLog = log.bind({ a: 666 });
// const onceLog = once(boundLog);
// onceLog();
// onceLog();

/*
=> 
666
*/
