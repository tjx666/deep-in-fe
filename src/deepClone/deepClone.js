/* eslint-disable valid-typeof */
const isObj = obj =>
    (typeof obj === 'object' && typeof obj !== null) ||
    typeof obj === 'function';

const deepClone = (obj, hasTravelMap = new WeakMap()) => {
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
        clonedObj[key] = isObj(value) ? deepClone(value) : value;
    }

    return clonedObj;
};

const testObj = {
    num: 123,
    obj: {
        name: 'ly',
    },
    date: new Date(),
    func: () => console.log('call func...'),
    regExp: /\d{3}/,
    array: [1, 2, 3],
};

const clonedObj = deepClone(testObj);
console.log(testObj);
console.log(clonedObj);
