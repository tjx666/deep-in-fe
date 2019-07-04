const _new = (fn, ...args) => {
    const target = Object.create(fn.prototype);
    const result = fn.call(target, ...args);
    const isObjectOrFunction = (result !== null && typeof result === 'object') || typeof result === 'function';
    return isObjectOrFunction ? result : target;
}

module.exports = _new;

