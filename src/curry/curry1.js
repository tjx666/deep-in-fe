const curry = (fn) => {
    const allArgs = [];
    const length = fn.length;

    function curriedFn(...args) {
        allArgs.push(...args);

        if (allArgs.length < length) {
            return curriedFn;
        } else {
            return fn.apply(this, allArgs);
        }
    }

    return curriedFn;
};


module.exports = curry;