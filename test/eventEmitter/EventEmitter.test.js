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

    it('#test on', () => {
        eventName = 'test on';

        e.on(eventName, () => {
            flag = true;
        }).on(eventName, () => {
            assert(flag);
        });

        e.emit(eventName);
        assert(flag);
    });

    it('#test off', () => {
        eventName = 'test off';

        e.on(eventName, () => {
            flag = true;
        });
        e.off(eventName);
        e.emit(eventName);
        assert(!flag);
    });

    it('#test once', () => {
        eventName = 'test once';

        e.once(eventName, () => {
            flag = !flag;
        });

        e.emit(eventName);
        e.emit(eventName);
        assert(flag);
    });

    it('#test prependListener', () => {
        eventName = 'test prependListener';
        flag = 6;

        e.addListener(eventName, () => {
            flag *= 2;
        });

        e.prependListener(eventName, () => {
            flag += 1;
        });

        e.emit(eventName);
        assert(flag === 14);
    });

    it('#test prependOnceListener', () => {
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
        assert(flag === 28);
    });

    it('#listenerCount', () => {
        assert(e.getMaxListeners() === 10);
        e.setMaxListeners(0);
        assert(e.getMaxListeners() === 0);
        assert.throws(() => {
            e.setMaxListeners(-1);
        });
    });

    it('#test listeners', () => {
        eventName = 'test listeners';
        const listener = () => {};

        e.addListener(eventName, listener);
        e.once(eventName, listener);

        assert(e.listeners(eventName).length === 2);
    });

    it('#test rawListeners', () => {
        eventName = 'test rawListeners';
        const listener = () => {};

        e.addListener(eventName, listener);
        e.once(eventName, listener);

        assert(e.rawListeners(eventName)[1].listener === listener);
    });

    it('#test removeAllListeners', () => {
        const listener = () => {};
        const otherEventName = 'abc';
        eventName = 'test removeAllListeners';

        e.addListener(eventName, listener);
        e.on(otherEventName, listener);
        e.once(eventName, listener);

        e.removeAllListeners(eventName);
        assert(e.listeners(eventName).length === 0);
        assert(e.listeners(otherEventName).length === 1);

        e.removeAllListeners();
        assert(e.listeners(otherEventName), 0);
    });
});
