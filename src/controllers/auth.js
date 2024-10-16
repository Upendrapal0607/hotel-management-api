const _ = require("lodash");
const BaseClass = require("./base");
const validation = require("../validation");
const jwt = require("jsonwebtoken");
const { Token } = require("../utilities");

class Auth extends BaseClass {
  constructor(ctx, next) {
    super(ctx, next);
  }
  async users() {
    const { page = 1, limit = 20 } = this.ctx.request.query;
 
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const userCount = await this.models.User.countDocuments();
    const totalPages = Math.ceil(userCount / pageSize);
  
    try {
      const skipCount = (pageNumber - 1) * pageSize;
      const userList = await this.models.User.find({})
        .skip(skipCount)
        .limit(pageSize);
  
      this.ctx.body = {
        status: true,
        users: userList,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
  
  async register() {
    const { name, email, password, gender } = this.ctx.request.body;
    let { value, error } = validation.Auth.UserRegisterSchema.validate({
      name,
      email,
      password,
      gender,
    });

    if (error) {
      let errorMessage =
        _.size(error.details) > 0 ? error.details[0].message : null;
        this.throwError("201", errorMessage);
    }

    let existingUser = await this.models.User.findOne({
      email: this.ctx.request.body.email,
    });
    if (existingUser) {
      this.throwError("201", "User already registered login now.");
    }

 

    try {
      let user = new this.models.User(this.ctx.request.body);
      
      await user.save();
      this.ctx.body = {
        status: true,
        message: "User registered successfully",
        data: {
          user,
        },
      };
      return;
    } catch (error) {
      console.log({
        message: error.message,
        error: error.stack,
        error,
      });

      this.ctx.body = {
        message: "Let us check error",
      };
      this.throwError("301", error.message);
    }
  }
  async login() {
    // check Validation
    const { email, password } = this.ctx.request.body;
    let { value, error } = validation.Auth.userPass.validate({
      email,
      password,
    });

    if (error) {
      let errorMessage =
        _.size(error.details) > 0 ? error.details[0].message : null;
      this.throwError("201", errorMessage);
    }
    // Check if user with the same email already exists
    let existingUser = await this.models.User.findOne({
      email: this.ctx.request.body.email,
    });
    if (!existingUser) {
      this.throwError("201", "User is not exists");
      return;
    }
    if (existingUser?.status == "block") {
      this.ctx.body = {
        status: true,
        message: "Account is blocked connect with admin",
        isBlock: true,
      };
      return;
    }

    const isMatched = await existingUser.verifyPassword(
      this.ctx.request.body.password
    );

    if (!isMatched) {
      this.throwError("201", "password is wrong please check");
      return;
    }
    const token = new Token(existingUser, "User").createAccessToken();

    try {
      this.ctx.status = 200;
      this.ctx.body = {
        status: true,
        message: "Login success",
        token,
        user: existingUser,
        userType: "User",
      };
    } catch (error) {
      this.throwError("301", error.message);
    }
  }

  async updateProfile() {
    // Retrieve the user's ID from the request
    const { id } = this.ctx.params;
  
    
    try {
      let user = await this.models.User.findByIdAndUpdate(
        id,
        this.ctx.request.body,
        { new: true }
      );

      if (!user) {
        this.ctx.body = {
          status: false,
          message: "User not found with ID: " + id,
        };
        this.ctx.status = 404;
        return;
      }

      this.ctx.body = {
        message: "User profile updated successfully",
        status: true,
        user,
        userType: "User",
      };
      return;
    } catch (error) {
      console.error("Error updating user profile:", error);
      this.ctx.body = {
        message: "An error occurred while updating the user profile",
      };
      this.ctx.status = 500; //
    }
  }

  async tokenValidate() {
    const token = this.ctx.headers.authorization?.split(" ")[1];
    if (!token) this.throwError("102", "Authentication token is missing");
    const CheckIsValidate = new Token().verifiedToken(token);
    if (CheckIsValidate) {
      this.ctx.body = {
        status: true,
        data: CheckIsValidate,
      };
    } else {
      this.ctx.body = {
        status: false,
        message: "Token is not valid",
      };
    }
  }
  async forgetpass() {
    const { email, password } = this.ctx.request.body;
    try {
      const CheckExistUser = await this.models.User.findOne({ email });
      if (!CheckExistUser) {
        this.ctx.body = {
          message: "User not found with email: " + email,
        };
        this.ctx.status = 404;
        return;
      }

      // Hash the new password before storing it (assuming bcrypt is being used)
      //   const bcrypt = require('bcryptjs');
      //   const hashedPassword = await bcrypt.hash(newPass, 10);

      // Await the update operation as well
      const updatedUser = await this.models.User.findOneAndUpdate(
        { email },
        { password: password }, 
        { new: true }
      );

      this.ctx.body = {
        message: "Your password has been updated",
        user: updatedUser,
      };
      this.ctx.status = 200;
    } catch (error) {
      console.error("Error updating password:", error);
      this.ctx.body = {
        message: "An error occurred while updating the password",
      };
      this.ctx.status = 500;
    }
  }
  async resetpass() {}
}

module.exports = Auth;
