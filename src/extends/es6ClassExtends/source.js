class Person {
    constructor(name) {
        this.name = name;
    }

    run() {
        console.log(`${this.name} run...`);
    }
}

class Student extends Person {
    constructor(name, grade) {
        super(name);
        this.grade = grade;
    }

    introduce() {
        console.log(`${this.name} is ${this.grade} grade`);
    }
}
