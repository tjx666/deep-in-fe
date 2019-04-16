const instance_of = (leftOperand, rightOperand) => rightOperand.prototype.isPrototypeOf(leftOperand);

module.exports = instance_of;