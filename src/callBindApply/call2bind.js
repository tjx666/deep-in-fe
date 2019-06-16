Function.prototype.myBind = function (thisArg, ...fixedArgs) {
    const func = this;
    return function(...others) {
        const args = [...fixedArgs, ...others];
        if (new.target) {
            return new func(...args);
        }
        return func.call(thisArg, ...args)
    }
}

const displayThisAndArgs = function (...args) {
    console.log('this: ', this);
    console.log('args: ', ...args);
}

displayThisAndArgs.myBind({ num: 1 }, 1, 2)(3, 4);
// =>
// this:  { num: 1 }
// args:  1 2 3 4

function Student(name, age) {
    this.name = name;
    this.age = age;
}
const BindStudent = Student.myBind(null, 'ly');
console.log(new BindStudent(22)); // => Student { name: 'ly', age: 22 }
