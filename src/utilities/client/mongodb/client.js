const _ = require("lodash");
const mongoose = require("mongoose");

class Client {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }
  connect() {
    // let connString = `mongodb://${this.config.host}:${this.config.port}/${this.config.db}?${this.config?.options}`;
    let connString =
      `mongodb://${this.config.host}:${this.config.port}` +
      `/${this.config.db}${this.config.options}`;
    console.log("connection string", connString);
    if (_.size(this.config.user) && _.size(this.config.pass)) {
      connString = `mongodb://${this.config.user}:${this.config.pass}@${this.config.host}:${this.config.port}/${this.config.db}?${this.config.options}`;
    }
    // console.log("new connection string",connString)

    let connection = mongoose.createConnection(connString, this.options);

    connection.on("connected", () => console.log("connected"));
    connection.on("open", () => console.log("open"));
    connection.on("disconnected", () => console.log("disconnected"));
    connection.on("reconnected", () => console.log("reconnected"));
    connection.on("disconnecting", () => console.log("disconnecting"));
    connection.on("close", () => console.log("close"));
    return connection;
  }
}

module.exports = Client;
