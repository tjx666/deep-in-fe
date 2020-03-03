// 组合继承就是子类组合父类的属性

// 父类
function SuperClass(name) {
    this.name = name;
}
// 父类静态属性
SuperClass.sayHello = function() {
    console.log('hello');
};

// 子类
function SubClass(name, title) {
    // 调用父类构造器组合父类实例属性
    SuperClass.call(this, name);
    this.title = title;
}

// 设置子类原型为父类，组合父类的静态属性
Reflect.setPrototypeOf(SubClass, SuperClass);

const sub = new SubClass('ly', 'student');
// 子类实例可以访问父类实例属性
console.log(sub.name); // => ly
// 子类可以访问父类静态方法
SubClass.sayHello(); // hello
