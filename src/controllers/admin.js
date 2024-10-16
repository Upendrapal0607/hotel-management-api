const _ = require("lodash");
const BaseClass = require("./base");
const validation = require("../validation");
const jwt = require("jsonwebtoken");
const { Token } = require("../utilities");

class Admin extends BaseClass {
  constructor(ctx, next) {
    super(ctx, next);
  }
  async admins() {
    try {
      const userList = await this.models.Admin.find({});
      this.ctx.body = {
        userList,
        status: "success",
      };
    } catch (error) {
      this.throwError(
        "201",
        error.message || "Some error accurse please try again later"
      );
    }
  }
  async register() {
    let { value, error } = validation.Admin.AdminValidation.validate(
      this.ctx.request.body
    );
    if (error) {
      let errorMessage =
        _.size(error.details) > 0 ? error.details[0].message : null;
      this.throwError("201", errorMessage);
    }

    let existingAdmin = await this.models.Admin.findOne({
      email: this.ctx.request.body.email,
    });
    if (existingAdmin) {
      this.throwError("201", "Admin already exists");
    }

    // Create a new user
    let admin = new this.models.Admin(this.ctx.request.body);
    try {
      // Attempt to save the new user
      await admin.save();
      // Respond with success message
      this.ctx.body = {
        success: true,
        message: "Admin registered successfully",
      };
    } catch (error) {
      this.throwError("301", error.message);
    }
  }
  async login() {
    // check Validation
    const { email, password } = this.ctx.request.body;
    let { value, error } = validation.Admin.AdminPassValidation.validate({
      email,
      password,
    });

    if (error) {
      let errorMessage =
        _.size(error.details) > 0 ? error.details[0].message : null;
      this.throwError("201", errorMessage);
    }
    // Check if user with the same email already exists
    let existingAdmin = await this.models.Admin.findOne({ email });

    if (!existingAdmin) {
      this.throwError("201", "User is not exists");
      return;
    }
    const isMatched = await existingAdmin.verifyPassword(
      this.ctx.request.body.password
    );
    if (!isMatched) {
      this.throwError("201", "password is wrong please check");
      return;
    }
    const token = new Token(existingAdmin, "Admin").createAccessToken();
    try {
      this.ctx.status = 200;
      this.ctx.body = {
        status: true,
        message: "Login success",
        token,
        user: existingAdmin,
        userType: "Admin",
      };
    } catch (error) {
      // Log detailed error and throw custom error
      console.error("Error saving user:", error.message, error.errors);
      this.throwError("301", error.message);
    }
  }
  async refreshToken() {}
  async forgetpass() {
    const { email, password } = this.ctx.request.body;
    try {
      // Await the promise returned by findOne
      const CheckExistUser = await this.models.User.findOne({ email });
      if (!CheckExistUser) {
        this.ctx.body = {
          message: "User not found with email: " + email,
        };
        this.ctx.status = 404;
        return;
      }

      const updatedUser = await this.models.User.findOneAndUpdate(
        { email },
        { password: password }, // Ensure field name is correct
        { new: true } // Returns the updated user document
      );

      this.ctx.body = {
        message: "Your password has been updated",
        user: updatedUser,
      };
      this.ctx.status = 200; // OK status
    } catch (error) {
      console.error("Error updating password:", error);
      this.ctx.body = {
        message: "An error occurred while updating the password",
      };
      this.ctx.status = 500; // Internal server error
    }
  }
  async tokenValidate() {
    const token = this.ctx.headers.authorization?.split(" ")[1];
    if (!token) this.throwError("102", "Authentication token is missing");
    const CheckIsValidate = new Token().verifiedToken(token);
    this.ctx.body = {
      status: true,
      data: CheckIsValidate,
    };
  }
  async resetpass() {}
}

module.exports = Admin;
