const MyPromise = require('./MyPromise');

const testThenChain = () => {
    // 测试 then 的链式调用
    const p1 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
            console.log('等待1秒');
            resolve('data1');
        }, 1000);
    });

    p1.then((data) => {
        console.log(`1秒后返回: ${data}`);
        return new MyPromise((resolve, reject) => {
            setTimeout(() => {
                console.log('等待2秒');
                resolve('data2');
            }, 2000);
        });
    }).then((data) => {
        console.log(`2秒后返回: ${data}`);
    });
}

// testThenChain();
/*
等待1秒
1秒后返回: data1
等待2秒
2秒后返回: data2
*/

const testCatch = () => {
    const p = new MyPromise((resolve, reject) => {
        setTimeout(() => {
            console.log('等待1秒');
            resolve('data1');
        }, 1000);
    })

    p.then((data) => {
        console.log(`1秒后返回: ${data}`);
        return new MyPromise((resolve, reject) => {
            setTimeout(() => {
                console.log('2秒后失败');
                reject('data2');
            }, 2000);
        });
    }).catch((err) => {
        console.log(`失败返回的 err: ${err}`);
    })
}

// testCatch();
/*
等待1秒
1秒后返回: data1
2秒后失败
失败返回的 err: data2
*/

const testAll = () => {
    const start = Date.now();
    const promiseArray = Array.from({
        length: 5
    }, (v, index) => {
        return new MyPromise((resolve, reject) => {
            const delayTime = (index + 1) * 1000;
            setTimeout(() => resolve(delayTime), delayTime);
        });
    })

    MyPromise.all(promiseArray).then((resultArray) => {
        console.log({
            resultArray
        });
        console.log(`总共耗时: ${(Date.now() - start)}`);
    })
}

// testAll();
/*
{ resultArray: [ 1000, 2000, 3000, 4000, 5000 ] }
总共耗时: 5012
*/

const testRace = () => {
    const start = Date.now();
    const promiseArray = Array.from({
        length: 5
    }, (v, index) => {
        return new MyPromise((resolve, reject) => {
            const delayTime = (index + 1) * 1000;
            setTimeout(() => resolve(delayTime), delayTime);
        });
    })

    MyPromise.race(promiseArray).then((data) => {
        console.log({
            data
        });
        console.log(`总共耗时: ${(Date.now() - start)}`);
    })
}

testRace();
/*
{ data: 1000 }
总共耗时: 1012
*/