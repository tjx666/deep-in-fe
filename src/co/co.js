const co = (generator) => {
    const it = generator();
    const run = (it, lastValue) => {
        const { done, value } = lastValue ? it.next(lastValue) : it.next();

        if (!done) {
            if (Reflect.apply(Object.prototype.toString, value, []) === '[object Promise]')
                value.then((data) => run(it, data));
            else run(it, value);
        }
    };

    run(it);
};

const sleep = (seconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), seconds * 1000);
    });
};

const getStudentFromDB = () => {
    return sleep(3).then(() => ({ name: 'lyreal666', age: 22 }));
};

function* worker() {
    const student = yield getStudentFromDB();
    console.log(student);
}

co(worker);
