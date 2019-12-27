const curry = fn => {
    const allArgs = [];
    const { length } = fn;

    function curriedFn(...args) {
        allArgs.push(...args);

        if (allArgs.length < length) {
            return curriedFn;
        }
        return fn.apply(this, allArgs);
    }

    return curriedFn;
};

module.exports = curry;
