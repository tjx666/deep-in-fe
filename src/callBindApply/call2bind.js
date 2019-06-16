Function.prototype.myBind = function (thisArg, ...fixedArgs) {
    const func = this;

    const bindFund = function (...others) {
        const args = [...fixedArgs, ...others];
        if (new.target)  return new func(...args);
        return func.call(thisArg, ...args)
    }
    bindFund.prototype = func.prototype;

    return bindFund;
}

const displayThisAndArgs = function (...args) {
    console.log('this: ', this);
    console.log('args: ', ...args);
}

function Student(name, age) {
    this.name = name;
    this.age = age;
}
const BindStudent = Student.myBind(null, 'ly');
BindStudent.prototype.__attr__ = 'lyreal666';

const stu = new BindStudent(22);
console.log(stu); // => Student { name: 'ly', age: 22 }
console.log(stu.__attr__); // => lyreal666
