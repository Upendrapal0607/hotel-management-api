const Router = require("@koa/router");
const _ = require("lodash");
const Controllers = require("../../controllers");
const r = new Router();
r.get("/hotel", async (ctx, next) => {
  const hotelController = new Controllers.Hotel(ctx, next);
  await hotelController.execute("getHotel");
});
r.get("/hotel/:id", async (ctx, next) => {
  const hotelController = new Controllers.Hotel(ctx, next);
  await hotelController.execute("getSingleHotel");
});

r.post("/hotel/add", async (ctx, next) => {
  const hotelController = new Controllers.Hotel(ctx, next);
  await hotelController.execute("addHotel");
});
r.patch("/hotel/update/:id", async (ctx, next) => {
  const hotelController = new Controllers.Hotel(ctx, next);
  await hotelController.execute("updateHotel");
});
r.delete("/hotel/delete/:id", async (ctx, next) => {
  const hotelController = new Controllers.Hotel(ctx, next);
  await hotelController.execute("deleteHotel");
});

module.exports = r;
