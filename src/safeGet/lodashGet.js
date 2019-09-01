/**
 * object (Object): 要检索的对象。
 * path (Array|string): 要获取属性的路径。
 * [defaultValue] (*): 如果解析值是 undefined ，这值会被返回。
 */

const get = (object, path, defaultValue) => {
    if (!Array.isArray(path) && typeof path !== 'string')
        throw new TypeError(`path must be array or string, but you pass the type ${typeof path}`);

    // object 的类型如果是 null 或者 undefined 直接返回 default value
    if (object == null) return defaultValue;

    let propArray = path;
    if (typeof path === 'string') {
        // 如果 path 是字符串需要解析成特性数组，这里只是简单的替换 [expression] 成 .expression 后根据 . 拆分成特性数组
        // 其实 lodash 源码比这复杂的多
        path = path.replace(/\[(\w*)\]/g, '.$1');
        propArray = path.split('.');
    }

    let index = 0;
    let property;
    const length = propArray.length;
    // 利用特性数组循环赋值, 取到 undefined 或者 null 就停止循环
    // 有可能是中途某个属性本身是 null 或 undefined，也有可能是根本没有当前 property 这个属性
    while (object != null && index < length) {
        property = propArray[index++];
        object = object[property];
    }

    return index && index === length && object !== undefined ? object : defaultValue;
};

module.exports = get;
