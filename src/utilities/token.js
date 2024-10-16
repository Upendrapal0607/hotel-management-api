const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "development";
const config = require(`../../config/env/${env}.config.json`);
class TokenGenerate {
  constructor(user = {}, loginAs = "User") {
    this.user = user;
    this.loginAs = loginAs;
  }
  //   Token generation function
  createAccessToken() {
    return jwt.sign(
      { user: this.user, loginAs: this.loginAs },
      config.secrets.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
  }
  //   Refress Token Generation function
  refreshAccessToken() {
    return jwt.sign(
      { user: this.user, loginAs: this.loginAs },
      config.secrets.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }
  //   Check if token is valid
  verifiedToken(token) {
    try {
      const decode = jwt.verify(token, config.secrets.ACCESS_TOKEN_SECRET);
      return decode;
    } catch (error) {
      throw new Error("Invalid token please contact my support team");
    }
  }
}

module.exports = TokenGenerate;
