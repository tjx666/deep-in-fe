const assert = require('assert');
const createObject = require('../../src/extends/createObject');

describe('#createObject', () => {
    const proto = {};

    it(`should resultObject' prototype is first argument`, () => {
        const resultObj = createObject(proto);
        assert.deepStrictEqual(Reflect.getPrototypeOf(resultObj), proto);
    });

    it('should set the properties', () => {
        const propertiesObject = {
            a: {
                value: 6,
                writable: true,
            },
        };
        const resultObj = createObject(proto, propertiesObject);
        assert.strictEqual(resultObj.a, 6);
    });
});
