const createObject = require('./createObject');

/**
 * 原型继承
 *
 * 原型继承的目的就是要让子类实例的原型链往上就是父类的原型
 * 具体实现要修改子类的 prototype 为父类的实例
 * 并且注意修正 prototype 的 constructor 属性
 *
 * @param {Function} subClass 子类
 * @param {Function} superClass 父类
 */
function prototypeExtends(subClass, superClass) {
    subClass.prototype = createObject(superClass.prototype);
    subClass.prototype.constructor = subClass;
}

module.exports = prototypeExtends;
