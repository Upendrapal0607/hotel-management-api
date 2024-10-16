const { Schema } = require("mongoose");
const constants = require("./constants");
const { address } = require("./address");
const { room } = require("./room");
const { required } = require("joi");
let schema = new Schema(
  {
    hotel_name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    hotel_type: {
      type: String,
      required: true,
      default: constants.hotel_type.default,
    },
    owner_info: {
      type: {},
      required: true,
      _id: false,
    },
    hotel_address: {
      type: address,
      required: true,
    },
    hotel_image: {
      type: String,
      default: "hotel_image.jpg",
    },
    hotel_category: {
      type: String,
      required: true,
      default: "5-star",
    },
    description: {
      type: String,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    type_of_room: {
      type: [room],
    },
  },
  {
    collection: "hotel",
    timestamps: {
      createdAt: "created",
      updatedAt: "modified",
    },
    autoCreate: false,
    versionKey: false,
  }
);

module.exports = schema;
