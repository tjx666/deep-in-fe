const Promise = require('./MyPromise');

const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('3 秒后');
        resolve(123);
    }, 3000);
});

p.then(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('6 秒后');
        }, 3000);
    });
});
