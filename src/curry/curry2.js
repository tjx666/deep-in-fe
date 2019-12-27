const curry = fn => {
    const allArgs = [];
    const { length } = fn;

    const proxyObj = new Proxy(fn, {
        apply(target, ctx, args) {
            allArgs.push(...args);

            if (allArgs.length < length) {
                return proxyObj;
            }
            return fn.apply(ctx, allArgs);
        },
    });
    return proxyObj;
};

module.exports = curry;
