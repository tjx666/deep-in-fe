const assert = require('assert');
const EventEmitter = require('../../src/eventEmitter/EventEmitter');

describe('#EventEmitter', () => {
    const e = new EventEmitter();
    let flag = false;
    let eventName;

    beforeEach(() => {
        e.removeAllListeners();
        flag = false;
    });

    it('test on', () => {
        eventName = 'test on';

        e.on(eventName, () => {
            flag = true;
        }).on(eventName, () => {
            assert(flag);
        });

        e.emit(eventName);
        assert.ok(flag);
    });

    it('test off', () => {
        eventName = 'test off';

        e.on(eventName, () => {
            flag = true;
        });
        e.off(eventName);
        e.emit(eventName);
        assert.ok(!flag);
    });

    it('test once', () => {
        eventName = 'test once';

        e.once(eventName, () => {
            flag = !flag;
        });

        e.emit(eventName);
        e.emit(eventName);
        assert.ok(flag);
    });

    it('test prependListener', () => {
        eventName = 'test prependListener';
        flag = 6;

        e.addListener(eventName, () => {
            flag *= 2;
        });

        e.prependListener(eventName, () => {
            flag += 1;
        });

        e.emit(eventName);
        assert.strictEqual(flag, 14);
    });

    it('test prependOnceListener', () => {
        eventName = 'test prependOnceListener';
        flag = 6;

        e.addListener(eventName, () => {
            flag *= 2;
        });

        e.prependOnceListener(eventName, () => {
            flag += 1;
        });

        e.emit(eventName);
        e.emit(eventName);
        assert.strictEqual(flag, 28);
    });

    it('test listenerCount', () => {
        eventName = 'test listenerCount';
        const listener = () => {};

        assert(e.getMaxListeners() === 10);

        e.setMaxListeners(0);
        assert(e.getMaxListeners() === 0);
        assert.throws(() => {
            e.setMaxListeners(-1);
        });

        e.setMaxListeners(1);
        e.addListener(listener);
        assert.doesNotThrow(() => e.addListener(listener));
    });

    it('test listeners', () => {
        eventName = 'test listeners';
        const listener = () => {};

        e.addListener(eventName, listener);
        e.once(eventName, listener);
        e.removeListener(eventName);

        assert.strictEqual(e.listeners(eventName).length, 1);
    });

    it('test rawListeners', () => {
        eventName = 'test rawListeners';
        const listener = () => {};

        e.addListener(eventName, listener);
        e.once(eventName, listener);

        assert.strictEqual(e.rawListeners(eventName)[1].listener, listener);
    });

    it('test removeAllListeners', () => {
        const listener = () => {};
        const otherEventName = 'abc';
        eventName = 'test removeAllListeners';

        e.addListener(eventName, listener);
        e.on(otherEventName, listener);
        e.once(eventName, listener);

        e.removeAllListeners(eventName);
        assert.strictEqual(e.listeners(eventName).length, 0);
        assert.strictEqual(e.listeners(otherEventName).length, 1);

        e.removeAllListeners();
        assert.strictEqual(e.listeners(otherEventName).length, 0);
    });
});
