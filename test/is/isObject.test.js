const assert = require('assert');
const isObject = require('../../src/is/isObject');

describe('#isObject', () => {
    it(`#isObject({}) should return true`, () => {
        assert(isObject({}));
    });

    it(`#isObject(new Date()) should return true`, () => {
        assert(isObject(new Date()));
    });

    it(`#isObject([]) should return true`, () => {
        assert(isObject([]));
    });

    it(`#isObject(() => {}) should return true`, () => {
        assert(isObject(() => {}));
    });

    it('#isObject(1) should return false', () => {
        assert(!isObject(1));
    });

    it(`#isObject('') should return false`, () => {
        assert(!isObject(''));
    });

    it('#isObject(true) should return false', () => {
        assert(!isObject(true));
    });

    it('#isObject(null) should return false', () => {
        assert(!isObject(null));
    });

    it('#isObject(undefined) should return false', () => {
        assert(!isObject(undefined));
    });
});
