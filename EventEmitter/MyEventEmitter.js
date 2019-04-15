class MyEventEmitter {
    constructor() {
        this.listeners = {};
        this.maxListeners = MyEventEmitter.defaultMaxListeners;
    }

    getMaxListeners() {
        return this.maxListeners;
    }

    setMaxListeners(n) {
        this.maxListeners = n;
    }

    addListener(eventName, listener) {
        if (this.listeners[eventName]) {
            if (this.listeners[eventName].length <= this.maxListeners) {
                this.listeners[eventName].push(listener);
                this.defaultMaxListeners += 1;
            } else {
                throw new Error(`The listener's count of event ${eventName} had been max: ${this.defaultMaxListeners}!`);
            }
        } else {
            this.listeners[eventName] = [listener];
        }
    }

    removeListener(eventName, listener) {
        if (!this.listeners[eventName]) {
            return;
        } else {
            let listenerIndex = -1;
            this.listeners[eventName].some((existListener, index) => {
                if (existListener === listener || existListener.oldListener === listener) {
                    listenerIndex = index;
                    return true;
                }
            })
            ~listenerIndex && this.listeners[eventName].splice(listenerIndex, 1);
        }
    }

    removeAllListeners(eventName) {
        if (!eventName) {
            this.listeners = {};
        } else {
            this.listeners[eventName] = null;
        }
    }

    on(eventName, listener) {
        this.addListener(eventName, listener);
    }

    off(eventName, listener) {
        this.removeListener(eventName, listener);
    }

    once(eventName, listener) {
        const oldListener = listener;
        listener = (...args) => {
            oldListener(...args);
            this.removeListener(eventName, listener);
        }
        listener.oldListener = oldListener;
        this.addListener(eventName, listener)
    }

    emit(eventName, ...args) {
        if (this.listeners[eventName]) {
            // Node 官方文档写了所有的监听器会同步执行
            this.listeners[eventName].forEach(cb => cb(...args));
        } else if (eventName === 'error') {
            throw new Error('unhandled error');
        }
    }
}

MyEventEmitter.defaultMaxListeners = 10;
module.exports = MyEventEmitter;