const { EventEmitter } = require('events');

const e = new EventEmitter();

e.setMaxListeners();
console.log(e.getMaxListeners());
