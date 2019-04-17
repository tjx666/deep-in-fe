const eventDelegate = (parentSelector, targetSelector, events, callback) => {
    const delegateCallback = (event, ...args) => {
        let { target } = event;
        const currentTarget = event.currentTarget;

        while (target !== currentTarget) {
            if (target.matches(targetSelector)) {
                callback.call(target, event, ...args);
            }

            target = target.parentNode;
        }
    }
    
    events.trim().split(/\s+/).forEach(event => {
        document.querySelectorAll(parentSelector).forEach(parentEle => {
            parentEle.addEventListener(event, delegateCallback);
        })
    })
}