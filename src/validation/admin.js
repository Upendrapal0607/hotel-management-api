const Joi = require("joi");

const AdminValidation = Joi.object({
  name: Joi.string().trim().min(1).max(50).label("Name").required(),
  password: Joi.string().trim().min(8).max(32).label("Password").required(),
  email: Joi.string().lowercase().trim().email().label("Email").required(),
  gender: Joi.string().trim().label("Gender").required(),
});
const AdminPassValidation = Joi.object({
  password: Joi.string().trim().min(8).max(32).label("Password").required(),
  email: Joi.string().lowercase().trim().email().label("Email").required(),
});

module.exports = {
  AdminValidation,
  AdminPassValidation,
};
