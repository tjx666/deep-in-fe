const isObject = require('../typeCheck/isObject');

function instanceOf(leftHand, rightHand) {
    if (!isObject(rightHand)) {
        throw new TypeError(`Right-hand side of 'instanceof' is not an object`);
    } else if (typeof rightHand !== 'function') {
        throw new TypeError(`Right-hand side of 'instanceof' is not callable`);
    }

    return rightHand.prototype.isPrototypeOf(leftHand);
}

module.exports = instanceOf.default = instanceOf.instanceOf = instanceOf;
