'use strict';

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
}

var Person = /*#__PURE__*/ (function() {
    function Person(name) {
        this.name = name;
    }

    var _proto = Person.prototype;

    _proto.run = function run() {
        console.log(this.name + ' run...');
    };

    return Person;
})();

var Student = /*#__PURE__*/ (function(_Person) {
    _inheritsLoose(Student, _Person);

    function Student(name, grade) {
        var _this;

        _this = _Person.call(this, name) || this;
        _this.grade = grade;
        return _this;
    }

    var _proto2 = Student.prototype;

    _proto2.introduce = function introduce() {
        console.log(this.name + ' is ' + this.grade + ' grade');
    };

    return Student;
})(Person);
