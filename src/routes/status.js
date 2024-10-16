const Router = require("@koa/router");

const r = new Router();
r.get("/", async ctx => {
    ctx.status = 200;
    ctx.body = {
        status : true,
        message : "Backend API is operating normally"
    }
})

module.exports = r;