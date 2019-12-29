const adapter = require('../../src/promise/MyPromise');

describe('Promises/A+ Tests', function() {
    require('promises-aplus-tests').mocha(adapter);
});
