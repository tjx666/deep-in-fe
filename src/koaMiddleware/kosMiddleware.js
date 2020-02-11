class Koa {
    constructor() {
        this.middlewares = [];
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    applyMiddlewares() {
        let index = 0;
        const next = async () => {
            if (++index < this.middlewares.length) await this.middlewares[index](next);
        };

        (async function() {
            if (index < this.middlewares.length) await this.middlewares[index](next);
        })();
    }
}

const koa = new Koa();
koa.use(async function middleware1(next) {
    console.log('middleware1 start');
    await next();
    console.log('middleware1 end');
});

koa.use(async function middleware2(next) {
    console.log('middleware2 start');
    await next();
    console.log('middleware2 end');
});

koa.applyMiddlewares();
