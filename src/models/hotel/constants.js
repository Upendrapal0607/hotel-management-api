module.exports = {
  hotel_type: {
    enum: [
      "guest house",
      "resort",
      "business hotel",
      "boutique hotel",
      "apartment hotel",
      "motel",
      "villa",
      "hostel",
    ],
    default: "luxury",
  },
  hotel_category: {
    enum: ["3 star", "1 star", "5 star"],
    default: "5 star",
  },
  hotel_room_type: {
    default: "luxury",
  },
};
