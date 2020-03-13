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
    // 或者 subClass.prototype = Object.create(superClass.prototype);
    Reflect.setPrototypeOf(subClass.prototype, superClass.prototype);
    Object.defineProperty(subClass.prototype, 'constructor', {
        value: subClass,
        writable: true,
    });
    subClass.prototype.constructor = subClass;
}

module.exports = prototypeExtends;
