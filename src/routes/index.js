// const { Auth } = require("../controllers");

module.exports = {
    status:require("./status"),
    admin : require("./Admin"),
    user : require("./User"),
    hotel: require("./hotel"),
    booking: require("./Booking"),
    upload:require("./common")
}