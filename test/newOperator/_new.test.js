const assert = require('assert');
const _new = require('../../src/newOperator/_new');

describe('#test _new', () => {
    it('#return value is neither object nor function', () => {
        function User(name) {
            this.name = name;
        }

        const user = _new(User, 'lily');
        assert.strictEqual(user.name, 'lily');
    });

    it('#return value is object', () => {
        const obj = {
            age: 22,
        };

        function User(name) {
            this.name = name;
            return obj;
        }

        const user = _new(User, 'lily');
        assert.strictEqual(user, obj);
    });
});
