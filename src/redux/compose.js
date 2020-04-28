/**
 * 传入函数数组 [a, b, c, d], 返回 (...args) => a(b(c(d(...args))))
 * @param {Array<Function>} funcs
 */
function compose(funcs) {
    const { length } = funcs;
    if (length === 0) (arg) => arg;

    if (length === 1) return funcs[0];

    return funcs.reduce((fn1, fn2) => (...args) => fn1(fn2(...args)));
}

const plusOne = (x) => x + 1;
const multipleTwo = (x) => x * 2;
const multipleTwoThenPlusOne = compose([plusOne, multipleTwo]);
console.log(multipleTwoThenPlusOne(3)); // => 7
