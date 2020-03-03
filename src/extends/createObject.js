const isObject = require('../is/isObject');

/**
 * 创建一个以 proto 为原型的对象，并设置它的属性描述符
 *
 * @param {object|null} proto
 * @param {object} propertiesObject
 */
function createObject(proto, propertiesObject) {
    const resultObj = {};
    Reflect.setPrototypeOf(resultObj, proto);
    if (isObject(propertiesObject)) {
        Object.defineProperties(resultObj, propertiesObject);
    }

    return resultObj;
}

module.exports = createObject;
