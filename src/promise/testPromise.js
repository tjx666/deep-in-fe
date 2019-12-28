const { MyPromise: Promise } = require('./MyPromise');

const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('3 秒后');
        resolve(123);
        reject();
    }, 3000);
});

p.then(() => {
    console.log('call then1');
});

p.then(() => {
    console.log('call then2');
});
