function debounce(fn, delay, immediate) {
    let timerId;
    function debouncedFn(...args) {
        return new Promise((resolve, reject) => {
            if (timerId !== undefined) {
                clearTimeout(timerId);
            } else if (immediate) {
                timerId = setTimeout(() => {
                    timerId = undefined;
                }, delay);
                resolve(fn.apply(this, args));
                return;
            }

            timerId = setTimeout(() => {
                resolve(fn.apply(this, args));
                timerId = undefined;
            }, delay);
        });
    }

    debouncedFn.cancel = function() {
        clearTimeout(timerId);
        timerId = undefined;
    };

    return debouncedFn;
}
