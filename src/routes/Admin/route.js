const Router = require("@koa/router");
const controllers = require("../../controllers");
const r = new Router();

r.get("/auth/admin", async (ctx, next) => {
  const AdminController = new controllers.Admin(ctx, next);
  await AdminController.execute("admins");
});
r.post("/auth/admin/register", async (ctx, next) => {
  const AdminController = new controllers.Admin(ctx, next);
  await AdminController.execute("register");
});

r.post("/auth/admin/login", async (ctx, next) => {
  const AdminController = new controllers.Admin(ctx, next);
  await AdminController.execute("login");
});
r.get("/auth/admin/valid", async (ctx, next) => {
  let controller = new controllers.Admin(ctx, next);
  await controller.execute("tokenValidate");
});

module.exports = r;
