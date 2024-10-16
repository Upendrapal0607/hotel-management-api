const Router = require("@koa/router");
const controller = require("../../controllers");

const r = new Router();

r.get("/booking", async (ctx, next) => {
  const BookingController = new controller.Booking(ctx, next);
  await BookingController.execute("Booking");
});
r.post("/booking", async (ctx, next) => {
  const BookingController = new controller.Booking(ctx, next);
  await BookingController.execute("UserBooking");
});
r.post("/booking/add", async (ctx, next) => {
  const BookingController = new controller.Booking(ctx, next);
  await BookingController.execute("newBooking");
});
r.patch("/booking/update/:id", async (ctx, next) => {
  const BookingController = new controller.Booking(ctx, next);
  await BookingController.execute("updateBooking");
});
r.patch("/booking/cancel/:id", async (ctx, next) => {
  const BookingController = new controller.Booking(ctx, next);
  await BookingController.execute("cancelBooking");
});

// r.delete("/booking/delete/:id", async (ctx, next) => {
//     const BookingController = new controller.Booking(ctx,next);
//     await BookingController.execute("deleteBooking")

// })

module.exports = r;
