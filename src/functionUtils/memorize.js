/**
 * 接受一个函数，返回一个新函数，这个函数会在参数相同的情况下直接返回缓存的结果而不会重新计算
 * @param {Function} func
 */
function memorize(func) {
    const cacheMap = new Map();
    return function memorized(...args) {
        const key = Array.from(cacheMap.keys()).find(
            (cachedArgs) =>
                args.length === cachedArgs.length &&
                args.every((arg, index) => Object.is(arg, cachedArgs[index])),
        );
        if (key != null) {
            return cacheMap.get(key);
        }
        const result = func.apply(this, args);
        cacheMap.set(args, result);
        return result;
    };
}

module.exports = memorize;

// function log(...args) {
//     console.log(args);
// }

// const memorizedLog = memoize(log);
// memorizedLog(1);
// memorizedLog(1);
// memorizedLog(2);

// memorizedLog({ a: 1 });
// memorizedLog({ a: 1 });
// const obj = { b: 2 };
// memorizedLog(obj);
// memorizedLog(obj);

/*
=>
[ 1 ]
[ 2 ]
[ { a: 1 } ]
[ { a: 1 } ]
[ { b: 2 } ]
*/
