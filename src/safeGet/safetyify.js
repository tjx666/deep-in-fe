const lodashGet = require('./lodashGet');

/**
 * 将一个普通对象安全化
 * @param {*} nullableObject null/undefined 或者一个普通对象，不包括 data, regexp 等标准对象
 */
const safetyify = (nullableObject) => {
    if (Object.prototype.toString.call(nullableObject) !== '[object Object]' && nullableObject != null) {
        throw new TypeError('nullableObject must be normal object, null or undefined');
    }

    // 给 null/undefined 设置代理会报错，所以改成空对象
    if (nullableObject == null) {
        nullableObject = {}
    }

    // 保存特性路径
    const propPath = [];
    return new Proxy(nullableObject, {
        get(target, property, receiver) {
            if (property !== 'get') {
                propPath.push(property);
                // 返回代理对象
                return receiver;
            }

            return (defaultValue) => {
                const result = lodashGet(target, propPath, defaultValue);
                propPath.length = 0;
                return result;
            };
        },
    });
};

module.exports = safetyify;
// const testObj = { father: { son: { name: 'lily' } }, nul: null, und: undefined };
// const safeObj = safetyify(testObj);
// console.log(safeObj.father.get());
