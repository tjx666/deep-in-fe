/**
 * 基于组合和原型链来实现的继承
 * !: 要达到组合的目的必须像测试那样在子类中调用父类构造函数
 *
 * @param {*} subClass 子类
 * @param {*} superClass 父类
 */
const myExtends = (subClass, superClass) => {
    const prototype = Object.create(superClass.prototype);
    prototype.constructor = subClass;
    subClass.prototype = prototype;
};

module.exports = myExtends;
