const createStore = (reducer) => {
    let state;
    const listeners = [];

    const subscribe = (listener) => {
        listeners.push(listener);

        let isUnsubscribed = false;
        const unsubscribe = () => {
            if (isUnsubscribed) return;
            
            const index = listeners.findIndex(eleListener => eleListener === listener);
            ~index && listeners.splice(index, 1);
            isUnsubscribed = true;
        }
        return unsubscribe;
    }

    const getState = () => state;
    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    }
    dispatch({});
    return {
        getState,
        dispatch,
        subscribe
    };
};

module.exports = { createStore };