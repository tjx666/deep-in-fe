var assert = require('assert');
var requireDir = require('../../../src/utils/requireDir');

// first test regularly:
assert.deepEqual(requireDir('./simple'), {
    a: 'a',
    b: 'b',
});

console.log('Simple tests passed.');
