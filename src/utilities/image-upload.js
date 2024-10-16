const multer = require("@koa/multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const env = process.env.NODE_ENV || "development";
const config = require(`../../config/env/${env}.config.json`)
// cloudenary credencial
const api_key = config.Cloudenary_instance.api_key;
const api_secret = config.Cloudenary_instance.api_secret;
const cloud_name = config.Cloudenary_instance.cloud_name;

// Initialiese cloud computation
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});
// Koa multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../Public/Images");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// upload file middleware
const upload = multer({ storage });

const UploadOnCloudenery = async (path) => {
  try {
    const result = (await cloudinary.uploader.upload(path))?.secure_url;
    fs.unlinkSync(path);
    return result;
  } catch (error) {
    throw new Error(error.messsage);
  }
};
module.exports = { upload, UploadOnCloudenery };
