const assert = require('assert');
const MyEventEmitter = require('../../src/EventEmitter/MyEventEmitter');

describe('#MyEventEmitter', () => {
    let db;
    let dbStatus;

    beforeEach(() => {
        db = new MyEventEmitter();
        dbStatus = 'closed';
    });

    it('#addListener', () => {
        // 没有设置监听器时可以正常触发
        db.emit('connect');
        db.addListener('connect', number => {
            dbStatus = 'open';
            assert.equal(number, 666);
        });
        db.emit('connect', 666);
        assert.equal(dbStatus, 'open');
    });

    it('#once', () => {
        db.emit('connect');
        db.once('connect', val => {
            if (dbStatus === 'open') {
                dbStatus = 'reOpen';
            } else {
                dbStatus = 'open';
            }
        });
        db.emit('connect');
        db.emit('connect');
        assert.equal(dbStatus, 'open');
    });

    it('#removeListener', () => {
        const listener = number => {
            dbStatus = 'open';
        };

        db.addListener('connect', listener);
        db.removeListener('connect', listener);
        db.emit('connect', 666);
        assert.equal(dbStatus, 'closed');
    });

    it('removeOnce', () => {
        const listener = number => {
            dbStatus = 'open';
        };

        db.once('connect', listener);
        db.removeListener('connect', listener);
        db.emit('connect');
        assert.equal(dbStatus, 'closed');
    });
});
