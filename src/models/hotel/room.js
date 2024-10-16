const { Schema } = require("mongoose");
const constants = require("./constants");
let room = new Schema(
  {
    roomType: {
      type: String,
      default: constants.hotel_room_type.default,
      required: true,
    },
    booked_room: {
      type: Number,
      required: true,
      default: 0,
    },
    available_room: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

module.exports = { room };
