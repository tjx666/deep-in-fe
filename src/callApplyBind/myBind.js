/**
 * 模拟实现 Function.prototype.bind
 *
 * @param {Function} fn 被绑定 this 的函数
 * @param {*} thisArg
 * @param  {...any} boundArgs 被绑定的参数
 * @returns {Function} 绑定 this 后的新函数
 */
function myBind(fn, thisArg, ...boundArgs) {
    function boundFn(...otherArgs) {
        // 被使用 new 调用时 this 应该就是被指定的 this
        const ctx = new.target ? this : thisArg;
        return fn.call(ctx, ...boundArgs, ...otherArgs);
    }

    // 这一步是为了 boundFn 被当作构造函数使用时，其实例能正常访问 fn 原型链上的属性
    boundFn.prototype = Object.create(fn.prototype);
    boundFn.prototype.constructor = boundFn;

    // 默认就是 writeable: false，所以 name 和 length 都被设置为不可写了
    Object.defineProperties(boundFn, {
        name: {
            // 被绑定 this 的新函数的 name 都是原函数前面加 bound
            value: `bound ${fn.name}`,
        },
        length: {
            // boundFn 的 length 是剩余需要传递的参数
            value: Math.max(fn.length - boundArgs.length, 0),
        },
    });

    return boundFn;
}

module.exports = myBind;
