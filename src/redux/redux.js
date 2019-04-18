const createStore = (reducer) => {
    let state;
    const listeners = [];

    const subscribe = (listener) => {
        listeners.push(listener);
        const unsubscribe = () => {
            const index = listeners.findIndex(eleListener => eleListener === listener);
            ~index && listeners.splice(index, 1);
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