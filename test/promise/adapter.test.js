const adapter = require('../../src/promise/Promise');

describe('#Promises/A+ Tests', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe, node/no-unpublished-require
    require('promises-aplus-tests').mocha(adapter);
});
