const { Schema } = require("mongoose");
const constants = require("./constants");

let address = new Schema(
  {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    landmark: {
      type: String,
    },

    locality: {
      type: String,
    },
  },
  { _id: false }
);

module.exports = { address };
