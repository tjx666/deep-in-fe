/**
 * Runs promises from array of functions that can return promises
 * in chained manner
 *
 * @param {array} arr - promise arr
 * @return {object} promise object
 */
function runPromiseInSequence(arr, input) {
    return arr.reduce(
        (promiseChain, currentFunction) => promiseChain.then(currentFunction),
        Promise.resolve(input),
    );
}

module.exports = runPromiseInSequence;
