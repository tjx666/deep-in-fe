const isObj = require('../is/isObject');

function cloneDeep(obj, hasTravelMap = new WeakMap()) {
    if (!isObj(obj)) return obj;
    let clonedObj;
    const Constructor = obj.constructor;
    switch (Constructor) {
        case Date:
            clonedObj = new Constructor(obj.getTime());
            break;
        case RegExp:
            clonedObj = new Constructor(obj);
            break;
        case Function:
            clonedObj = obj.name ? eval(obj.toString()) : obj;
            break;
        default:
            if (hasTravelMap.has(obj)) return hasTravelMap.get(obj);
            clonedObj = new Constructor();
            hasTravelMap.set(obj, clonedObj);
    }

    for (const [key, value] of Object.entries(obj)) {
        clonedObj[key] = isObj(value) ? cloneDeep(value) : value;
    }

    return clonedObj;
}

module.exports = cloneDeep;
