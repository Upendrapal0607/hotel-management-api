
const BaseClass = require("./base");
const mongoose = require("mongoose");

class Booking extends BaseClass {
  constructor(ctx, next) {
    super(ctx, next);
  }
  async UserBooking() {
    const { userId } = this.ctx.request.body;
    const AllBooking = await this.models.Booking.find({});
    const bookingFormatted = await Promise.all(
    AllBooking.map( async booking =>{
      const {
        hotel_Id,
        user_Id
      } = booking;
      const hotelDetails = await this.models.Hotel.findById(hotel_Id);
      const userDetails = await this.models.User.findById(user_Id);
      let formateUser = userDetails;
    
  
     return {
      ...booking.toObject(),
        hotelDetails,
        userDetails : formateUser?{name:formateUser.name,email:formateUser.email,password:null}:{}
      };
    })
  )

  
    try {
      if (userId) {
        const userBookedHotel = bookingFormatted.filter(
          (booking) => String(booking.user_Id) === String(userId)
        );
     

        this.ctx.body = {
          status: true,
          message: "User-specific bookings retrieved successfully",
          bookingList:userBookedHotel,
        };
      } 
      else {
        this.ctx.body = {
          status: true,
          message: "All bookings retrieved successfully",
          bookingList : bookingFormatted,
        };
      }
    } catch (error) {
      this.ctx.body = {
        error,
      };
    }
  }
  async Booking() {
    const {
      page,
      limit,
    } = this.ctx.request.query;

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;
    const hotelList = await this.models.Booking.countDocuments();
    const totalPages = Math.ceil(hotelList / pageSize);
    const AllBooking = await this.models.Booking.find({}).skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

    const bookingFormatted = await Promise.all(
    AllBooking.map( async booking =>{
      const {
        hotel_Id,
        user_Id
      } = booking;
      const hotelDetails = await this.models.Hotel.findById(hotel_Id);
      const userDetails = await this.models.User.findById(user_Id);
      let formateUser = userDetails;
    
  
     return {
      ...booking.toObject(),
        hotelDetails,
        userDetails : formateUser?{name:formateUser.name,email:formateUser.email,password:null}:{}
      };
    })
  )

  
    try {
      this.ctx.body = {
        status: true,
        message: "All Booking retrived successfully",
        bookingList : bookingFormatted,
        totalPages
      };
      return;
     
  
    } catch (error) {
      this.ctx.body = {
        error,
      };
    }
  }
  async newBooking() {
    const { hotel_Id, selectedRoom } = this.ctx.request.body;
    const isValidId = mongoose.Types.ObjectId.isValid(hotel_Id);
    if (!isValidId) {
      this.throwError("201", "Id is not valid");
      return;
    }

    let available_hotel = await this.models.Hotel.findById(hotel_Id);

    if (!available_hotel) {
      this.throwError("404", "Hotel not found");
      return;
    }
    const updatedRoom = available_hotel.type_of_room.map((hotel_room) => {
      const matchingRoom = selectedRoom.find(
        (item) => item.roomType === hotel_room.roomType
      );

      if (matchingRoom) {
        return {
          roomType: hotel_room.roomType,
          price: hotel_room.price,
          available_room: hotel_room.available_room - matchingRoom.numberOfRoom,
          booked_room:
            (hotel_room.booked_room || 0) + matchingRoom.numberOfRoom,
        };
      }

      return {
        roomType: hotel_room.roomType,
        price: hotel_room.price,
        available_room: hotel_room.available_room,
        booked_room: hotel_room.booked_room || 0,
      };
    });

    try {
      if (
        !available_hotel ||
        available_hotel?.type_of_room?.available_room < 1
      ) {
        this.throwError("201", "Room is not awaileble");
        return;
      }

      await this.models.Hotel.findByIdAndUpdate(
        hotel_Id,
        { type_of_room: updatedRoom },
        { new: true }
      );
      let booking = new this.models.Booking(this.ctx.request.body);
      await booking.save();
      this.ctx.body = {
        status: true,
        message: "Booking Success",
        data: {
          booking,
        },
      };
    } catch (error) {
      this.throwError("301", error.message);
    }
  }

  async updateBooking() {
    const { id } = this.ctx.request.params;
 
    await this.models.Booking.findByIdAndUpdate(id, this.ctx.request.body);

    try {
      this.ctx.body = {
        status: true,
        message: "Booking updated successfully",
      };
      return 
    } catch (error) {
      this.throwError("201", error.message);
      return;
    }
  }
  async cancelBooking() {
    const { id } = this.ctx.request.params;
 
    await this.models.Booking.findByIdAndUpdate(id, this.ctx.request.body);

    try {
      this.ctx.body = {
        status: true,
        message: "Booking updated successfully",
      };
      return 
    } catch (error) {
      this.throwError("201", error.message);
      return;
    }
  }
}

module.exports = Booking;
