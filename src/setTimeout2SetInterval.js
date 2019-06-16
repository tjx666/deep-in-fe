// setTimeout  实现 setInterval

const mySetInterval = function (callback, timeout) {
    const timer = setTimeout(() => {
        callback();
        arguments.callee(callback, timeout);
    }, timeout);

    return timer;
}

let times = 0;
// mySetInterval(() => {
//     console.log(`${++times} 秒后...`);
// }, 1000);

// 等价于
// const loop = () => {
//     console.log(`${++times} 秒后...`);
//     setTimeout(loop, 1000);
// }

// setTimeout(loop, 1000);


// setInterval 模拟 setTimeout
const mySetTimeout = (callback, timeout) => {
    const timer = setInterval(() => {
        callback();
        clearInterval(timer);
    }, timeout);
    return timer;
};

mySetTimeout(() => {
    console.log('3 秒后！');
}, 3000);