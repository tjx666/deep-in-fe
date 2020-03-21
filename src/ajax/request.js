function makeRequestError(xhr, error, message) {
    const requestError = error || new Error(message);
    requestError.status = xhr.status;
    requestError.response = xhr.response;
    return requestError;
}

function request(options) {
    const defaultOptions = {
        url: undefined,
        method: 'GET',
        params: {},
        data: undefined,
        async: true,
        timeout: 0,
        onProgress: undefined,
    };
    options = { ...defaultOptions, ...options };
    options.method = options.method.toUpperCase();

    if (!options.url) {
        throw new Error(`url can't be ${options.url}`);
    }

    const queryString =
        Object.keys(options.params).length > 0
            ? Object.entries(options.params).reduce(
                  ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
                  '?',
              )
            : '';

    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();

        XHR.timeout = options.timeout;
        XHR.addEventListener('readystatechange', () => {
            const status = (XHR.status / 100) | 0;
            if (XHR.readyState === XHR.DONE) {
                if (status === 2) {
                    resolve(XHR.response);
                } else {
                    reject(makeRequestError(XHR, null, 'request failed!'));
                }
            }
        });
        XHR.addEventListener('error', error => reject(makeRequestError(XHR, error)));
        XHR.addEventListener('abort', () => makeRequestError(XHR, null, 'abort request!'));
        options.onProgress && XHR.addEventListener('progress', options.onProgress);

        XHR.open(options.method, `${options.url}${queryString}`, options.async);
        XHR.send(options.data ? JSON.stringify(options.data) : undefined);
    });
}
