const isObject = require('../typeCheck/isObject');

function instanceOf(obj, constructor) {
    if (!isObject(constructor)) {
        throw new TypeError(`Right-hand side of 'instanceof' is not an object`);
    } else if (typeof constructor !== 'function') {
        throw new TypeError(`Right-hand side of 'instanceof' is not callable`);
    }

    return constructor.prototype.isPrototypeOf(obj);
}

module.exports = instanceOf.default = instanceOf.instanceOf = instanceOf;
