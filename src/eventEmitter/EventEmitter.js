/**
 * @see {@link https://nodejs.org/api/events.html|node EventEmitter}
 */
class EventEmitter {
    // 默认最大订阅数 10
    static defaultMaxListeners = 10;

    constructor() {
        // 使用对象而不是数组是因为一个 emitter 可以订阅不同的事件
        this.listenerStore = {};
        this.maxListenerCount = EventEmitter.defaultMaxListeners;
    }

    /**
     * 添加订阅
     *
     * @param {*} eventName
     * @param {*} listener
     * @param {*} prepend
     */
    on(eventName, listener, prepend = false) {
        if (!this.listenerStore[eventName]) this.listenerStore[eventName] = [listener];
        else if (prepend) this.listenerStore[eventName].unshift(listener);
        else this.listenerStore[eventName].push(listener);

        // maxListenersCount 等于 0 时等同于 Infinity
        const currentListenersCount = this.listenerStore[eventName].length;
        // 添加的事件超出最大事件数会报警告
        if (currentListenersCount > (this.maxListenerCount || Infinity)) {
            console.warn(
                `You had add ${currentListenersCount}listeners, more than the max listeners count: ${this.maxListenerCount}`,
            );
        }

        return this;
    }

    /**
     * 每次删除一个事件名是 event 的 listener， 如果同一个函数被多次添加为 listener，需要多次调用 off
     *
     * @param {*} eventName
     * @param {*} listener
     */
    off(eventName, listener) {
        if (!this.listenerStore[eventName]) return;

        const index = this.listenerStore[eventName].findIndex(
            (existListener) => existListener === listener || existListener.listener === listener,
        );
        if (index !== -1) this.listenerStore[eventName].splice(index, 1);

        return this;
    }

    // 使用闭包在执行后 off 掉自身即可
    once(eventName, listener, prepend = false) {
        const onceListener = (...args) => {
            listener(...args);
            this.off(eventName, onceListener);
        };

        onceListener.listener = listener;
        this.on(eventName, onceListener, prepend);

        return this;
    }

    /**
     * 按照注册的顺序同步执行所有事件名为 event 的 listener
     *
     * @param {string} eventName
     * @param  {...any} args 会传给每一个执行 listener
     * @returns {boolean} 如果还有事件名为 event 的 listener 返回 true，否则返回 false
     */
    emit(eventName, ...args) {
        if (this.listenerStore[eventName] && this.listenerStore[eventName].length > 0) {
            const listenersCopy = [...this.listenerStore[eventName]];
            listenersCopy.forEach((listener) => listener(...args));
            return true;
        }

        return false;
    }

    listeners(eventName) {
        return this.listenerStore[eventName]
            ? this.listenerStore[eventName].map((listener) =>
                  listener.listener ? listener.listener : listener,
              )
            : [];
    }

    rawListeners(eventName) {
        return this.listenerStore[eventName] ? this.listenerStore[eventName] : [];
    }

    prependListener(eventName, listener) {
        return this.on(eventName, listener, true);
    }

    prependOnceListener(eventName, listener) {
        return this.once(eventName, listener, true);
    }

    addListener(eventName, listener) {
        return this.on(eventName, listener);
    }

    removeListener(eventName, listener) {
        return this.off(eventName, listener);
    }

    getMaxListeners() {
        return this.maxListenerCount;
    }

    setMaxListeners(n) {
        // 必须为非负数
        if (typeof n !== 'number' || n < 0) {
            throw new Error(
                `The value of "n" is out of range. It must be a non-negative number. Received '${n}'`,
            );
        }

        this.maxListenerCount = n;

        return this;
    }

    removeAllListeners(eventName) {
        if (!eventName) {
            Object.keys(this.listenerStore).forEach((_eventName) => {
                this.listenerStore[_eventName] = undefined;
            });
        } else {
            this.listenerStore[eventName] = undefined;
        }

        return this;
    }
}

module.exports = EventEmitter.default = EventEmitter;
