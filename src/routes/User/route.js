const Router = require("@koa/router");
const controllers = require("../../controllers");

let r = new Router();

r.get("/auth/users", async (ctx, next) => {
  let controller = new controllers.Auth(ctx, next);
  await controller.execute("users");
});

r.post("/auth/register", async (ctx, next) => {
  let controller = new controllers.Auth(ctx, next);
  await controller.execute("register");
});
r.post("/auth/login", async (ctx, next) => {
  let controller = new controllers.Auth(ctx, next);
  await controller.execute("login");
});
r.patch("/auth/forgatepass", async (ctx, next) => {
  let controller = new controllers.Auth(ctx, next);
  await controller.execute("forgatepass");
});

r.post("/auth/refresh-token", async (ctx, next) => {
  let controller = new controllers.Auth(ctx, next);
  await controller.execute("refreshToken");
});
r.patch("/auth/update/:id", async (ctx, next) => {
  let controller = new controllers.Auth(ctx, next);
  await controller.execute("updateProfile");
});
r.post("/auth/valid", async (ctx, next) => {
  let controller = new controllers.Auth(ctx, next);
  await controller.execute("tokenValidate");
});

module.exports = r;
