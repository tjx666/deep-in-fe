const isObject = require('../is/isObject');

function New(constructor, ...args) {
    if (typeof constructor !== 'function') throw new TypeError(`${constructor} is not a constructor`);

    const target = Object.create(constructor.prototype);
    const result = constructor.apply(target, args);

    return isObject(result) ? result : target;
}

module.exports = New;
