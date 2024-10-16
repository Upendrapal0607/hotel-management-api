const { Token } = require("../utilities");
const jwt = require("jsonwebtoken");
const BaseClass = require("./base");

class Hotel extends BaseClass {
  constructor(ctx, next) {
    super(ctx, next);
    this._beforeMethods.updateHotel = ["checkIsLogin"];
    this._beforeMethods.addHotel = ["checkIsLogin"];
    this._beforeMethods.deleteHotel = ["checkIsLogin"];
  }
  async getHotel() {
    const {
      roomType,
      hotelCategory,
      priceRange,
      fromDate,
      toDate,
      hotelLocation,
      page,
      limit,
    } = this.ctx.request.query;
    const query = {};

    if (roomType) {
      query["type_of_room.roomType"] = roomType;
    }

    if (hotelCategory) {
      query.hotel_category = hotelCategory;
    }
 
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        query["type_of_room"] = {
          $elemMatch: { price: { $gte: minPrice, $lte: maxPrice } }
        };
      }
  else if (!isNaN(minPrice)) {
  if  (minPrice<=2000) {
        query["type_of_room"] = {
          $elemMatch: { price: { $lt: minPrice } }
        };
      }
      else {
        query["type_of_room"] = {
          $elemMatch: { price: { $gt: minPrice } }
        };
      } 
      }
    }
    
    if (hotelLocation) {
      query.$or = [
        { "hotel_address.city": new RegExp(hotelLocation, "i") },
        { "hotel_address.state": new RegExp(hotelLocation, "i") },
        { "hotel_address.country": new RegExp(hotelLocation, "i") },
        { hotel_name: new RegExp(hotelLocation, "i") },
      ];
    }
    const sortOptions = {};

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;
    const hotelList = await this.models.Hotel.countDocuments(query);
    const totalPages = Math.ceil(hotelList / pageSize);

    try {
      const hotelList = await this.models.Hotel.find(query)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      this.ctx.body = {
        message: "successfully found a hotel",
        status: true,
        hotelList,
        totalPages,
      };
    } catch (error) {
      this.throwError("102", error.message);
    }
  }

  async getSingleHotel() {
    const { id } = this.ctx.params;
    try {
      const sigleHotel = await this.models.Hotel.findById(id);
      this.ctx.body = {
        message: "successfully found a hotel",
        status: true,
        sigleHotel,
      };
    } catch (error) {
      this.throwError("102", error.message);
    }
  }

  async addHotel() {
    console.log({ body: this.ctx.request.body });
    try {
      let Bookedhotel = new this.models.Hotel(this.ctx.request.body);
      await Bookedhotel.save();

      this.ctx.body = {
        status: true,
        message: "Hotel added successfully",
      };
    } catch (error) {
      console.log(error);

      this.throwError("201", error.message);
    }
  }

  async updateHotel() {
    const { id } = this.ctx.request.params;
    try {
      let updatedhotel = await this.models.Hotel.findByIdAndUpdate(
        id,
        this.ctx.request.body,
        { new: true }
      );

      this.ctx.body = {
        status: true,
        updatedhotel,
      };
    } catch (error) {
      console.log(error);

      this.throwError("201", error.message);
    }
  }

  async deleteHotel() {
    const { id } = this.ctx.request.params;
    try {
      const checkedHotel = await this.models.Hotel.findOne({ _id: id });
      if (!checkedHotel) this.throwError("302", "Hotel not found");

      let deletedHotel = await this.models.Hotel.findByIdAndDelete(id);
      await this.models.Booking.deleteMany({ hotel_Id: id });

      this.ctx.body = {
        status: true,
        deletedHotel,
        message: "Hotel deleted successfully",
      };
    } catch (error) {
      throw new Error("302", error.message);
    }
  }
}

module.exports = Hotel;
