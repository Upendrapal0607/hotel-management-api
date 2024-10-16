const { Schema } = require("mongoose");
let schema = new Schema(
  {
    // _id: Schema.Types.ObjectId,
    user_Id: {
      type: String,
      required: true,
    },
    hotel_Id: {
      type: String,
      required: true,
    },
    booking_status: {
      type: String,
      required: true,
      enum: ["Cancelled", "Completed", "Booked"],
    },
    from_date: {
      type: Date,
      required: true,
    },
    to_date: {
      type: Date,
      required: true,
    },
    selectedRoom: {
      type: [],
      required: true,
    }
  },
  {
    collection: "Booking",
    timestamps: {
      createdAt: "created",
      updatedAt: "modified",
    },
    autoCreate: false,
    versionKey: false,
  }
);

module.exports = schema;
