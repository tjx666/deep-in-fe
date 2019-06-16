// 同步形式
const sleepSync = (milliseconds) => {
    const start = Date.now();
    while(Date.now() - start < milliseconds);
}

// sleepSync(10000);

// 异步形式
const sleep1 = (milliseconds, callback) => {
    setTimeout(callback, milliseconds);
}

// sleep1(3000, () => console.log('1秒后...'));

// Promise 形式
const sleep2 = (milliseconds) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), milliseconds);
})

// sleep2(3000).then(() => console.log('3秒后...'));

// async/await
const sleep3 = async (milliseconds) => {
    await sleep2(milliseconds);
}

!async function test(){
    await sleep3(3000);
    console.log('3 秒后...');
}()

