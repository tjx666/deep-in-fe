// 使用 reduce 实现 map

const testArray = ['a', 'B', 'c'];

const thisArgObj = {
    name: 'lyreal666',
};

// reduce 实现 marginTop:
Array.prototype.reduceMap = function(fn, thisArg) {
    return this.reduce((previous, current, index, array) => {
        return previous.concat([fn.call(thisArg, current, index, array)]);
    }, []);
};

const mapToUpperElements = testArray.reduceMap(function(value, index, array) {
    if (index === 0) {
        console.log(this.name);
        console.log(array);
    }
    return value.toUpperCase();
}, thisArgObj);

console.log({ mapToUpperElements });

// reduce 实现 filter:
Array.prototype.reduceFilter = function(fn, thisArg) {
    return this.reduce((previous, current, index, array) => {
        return previous.concat(
            fn.call(thisArg, current, index, array) ? [current] : []
        );
    }, []);
};

const upperCaseElements = testArray.reduceFilter(function(value, index, array) {
    if (index === 0) {
        console.log(this.name);
        console.log(array);
    }
    return value.toUpperCase() === value;
}, thisArgObj);

console.log({ upperCaseElements });
