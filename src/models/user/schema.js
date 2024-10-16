const { Schema } = require("mongoose");
const constants = require("./constants");
const { address } = require("./address");
let schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    profile_photo: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      bcrypt: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    address_list: {
      type: address,
      default: {},
    },
    status: {
      type: String,
      default: constants.status.active,
      enum: constants.status.enum,
    },
  },
  {
    collection: "users",
    timestamps: {
      createdAt: "created",
      updatedAt: "modified",
    },
    autoCreate: false,
    versionKey: false,
  }
);

schema.plugin(require("mongoose-bcrypt"));

module.exports = schema;
