class Scheduler {
    constructor(maxRunningCount) {
        if (typeof maxRunningCount !== 'number') {
            throw TypeError(`${maxRunningCount} is not a number`);
        }
        this.maxRunningCount = maxRunningCount;
        this.runningCount = 0;
        this.todos = [];
    }

    add(promiseCreator) {
        if (this.runningCount === this.maxRunningCount) {
            return new Promise((resolve, reject) => {
                this.todos.push(() => {
                    this.runningCount++;
                    promiseCreator().then((value) => {
                        this.runningCount--;
                        if (this.todos.length !== 0) {
                            this.todos.shift()();
                        }
                        resolve(value);
                    }, reject);
                });
            });
        }

        this.runningCount++;
        return promiseCreator().then((value) => {
            this.runningCount--;
            if (this.todos.length !== 0) {
                this.todos.shift()();
            }
            return value;
        });
    }
}

// const timeout = (time) =>
//     new Promise((resolve) => {
//         setTimeout(resolve, time);
//     });

// const scheduler = new Scheduler(2);

// const addTask = (time, order) => {
//     scheduler.add(() => timeout(time)).then(() => console.log(order));
// };

// addTask(1000, '1');
// addTask(500, '2');
// addTask(300, '3');
// addTask(400, '4');
// output: 2 3 1 4

// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4
