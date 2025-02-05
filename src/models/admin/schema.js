const { Schema } = require("mongoose");
const constants = require("./constants");
const bcryptPlugin = require("mongoose-bcrypt");

let schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
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
    },
  },
  {
    collection: "Admin",
    timestamps: {
      createdAt: "created",
      updatedAt: "modified",
    },
    autoCreate: false,
    versionKey: false,
  }
);

schema.plugin(bcryptPlugin);

module.exports = schema;
