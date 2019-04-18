const { createStore } = require('../../src/redux/redux');
const assert = require('assert');

describe('#test redux', () => {
    const counterReducer = (state = {
        counter: 0
    }, action) => {
        switch (action.type) {
            case 'ADD': {
                const amount = action.payload && action.payload.amount || 0;
                return {
                    ...state,
                    counter: state.counter + amount
                }
            }
            default: {
                return state;
            }
        }
    };

    const { getState, dispatch, subscribe } = createStore(counterReducer);

    it('#getState()', () => {
        assert.deepStrictEqual({ counter: 0 }, getState());
    })

    it(`#dispatch({ action: 'ADD', payload: { amount: 3 } }) should counter changed to 3`, () => {
        dispatch({
            type: 'ADD',
            payload: {
                amount: 3
            }
        });

        assert.strictEqual(getState().counter, 3);
    })

    it('#test subscribe', () => {
        let flag = false;
        subscribe(() => {
            flag = true;
        });

        dispatch({
            type: 'ADD',
            payload: {
                amount: -3
            }
        })

        assert(flag);
    })

    it('#test unsubscribe', () => {
        let flag = false;
        const unsubscribe = subscribe(() => {
            flag = true;
        });
        unsubscribe();
        dispatch({
            type: 'ADD',
            payload: {
                amount: -3
            }
        })

        assert(!flag);
    })
})