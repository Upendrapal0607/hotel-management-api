const Router = require("@koa/router");
const { upload, UploadOnCloudenery } = require("../utilities/image-upload");

let r = new Router();

r.post("/upload", upload.single("file"), async (ctx, next) => {
  const file = ctx.request.file.path;
  const image_url = await UploadOnCloudenery(file);
  ctx.body = {
    status: true,
    image_url,
  };
});

module.exports = r;
