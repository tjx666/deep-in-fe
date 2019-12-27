/* eslint-disable camelcase */

const instance_of = (leftOperand, rightOperand) => {
    const rightOperandPrototype = rightOperand.prototype;
    let prototype = Object.getPrototypeOf(leftOperand);

    while (prototype !== null) {
        if (prototype === rightOperandPrototype) return true;
        prototype = Object.getPrototypeOf(prototype);
    }

    return false;
};

module.exports = instance_of;
