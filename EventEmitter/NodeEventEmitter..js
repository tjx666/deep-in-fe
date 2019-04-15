const EventEmitter = require('events').EventEmitter;

class HttpServer extends EventEmitter {
    constructor() {
        super();
        super.emit('createServer');

        setTimeout(() => {
            super.emit('receiveRequest', {
                method: 'GET',
                url: 'http://127.0.0.1:4000/test_get'
            });
        }, 1000);

        setTimeout(() => {
            super.emit('sendResponse');
        }, 1000);
    }

    listen(ip, port) {
        super.emit('serverStartListen')
        console.log(`Server is running at http://${ip}:${port}/`)
    }
}


const server = new HttpServer();
server.listen('localhost', 4000);
server.on('receiveRequest', (request) => {
    const { method, url } = request;
    console.log(`[${method}] url=${url}`);
});
// error 是个特别的事件，如果没有监听器会抛错误
server.emit('error');

