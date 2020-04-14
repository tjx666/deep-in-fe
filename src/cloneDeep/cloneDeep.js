const isObj = require('../is/isObject');

function cloneDeep(obj) {
    const hadTraveledMap = new Map();

    function clone(obj) {
        if (!isObj(obj)) return obj;

        if (hadTraveledMap.has(obj)) return hadTraveledMap.get(obj);
        let clonedObj;
        const Constructor = obj.constructor;

        if (Constructor === Date) {
            clonedObj = new Date(obj.getTime());
        } else if (Constructor === RegExp) {
            clonedObj = new RegExp(obj);
        } else if (Constructor === Function) {
            // ! 不安全，有可能被攻击者重写了函数的 toString()
            clonedObj = eval(`(${obj.toString()})`);
            Reflect.setPrototypeOf(clonedObj, Reflect.getPrototypeOf(obj));
        } else {
            clonedObj = new Constructor();
        }
        hadTraveledMap.set(obj, clonedObj);

        for (const [key, value] of Object.entries(obj)) {
            clonedObj[key] = clone(value);
        }

        return clonedObj;
    }

    return clone(obj);
}

module.exports = cloneDeep;
