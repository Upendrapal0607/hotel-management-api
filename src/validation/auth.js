const Joi = require("joi");
const addressSchema = Joi.object({
  city: Joi.string().trim().min(3).max(100).label("City").required(),
  state: Joi.string().trim().min(1).max(50).label("State").required(),
  country: Joi.string().trim().min(3).max(70).label("Country").required(),
  zipcode: Joi.string().trim().min(4).max(9).label("Zipcode").required(),
  landmark: Joi.string().trim().min(3).max(50).label("Landmark").optional(),
  locality: Joi.string().trim().min(3).max(150).label("Locality").required(),
});

const UserRegisterSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).label("Name").required(),
  password: Joi.string().trim().min(8).max(32).label("Password").required(),
  email: Joi.string().lowercase().trim().email().label("Email").required(),
  gender: Joi.string().lowercase().trim().label("Gender").optional(),
});

const userPass = Joi.object({
  password: Joi.string().trim().min(8).max(32).label("Password").required(),
  email: Joi.string().lowercase().trim().email().label("Email").required(),
});

module.exports = { UserRegisterSchema, userPass, addressSchema };
