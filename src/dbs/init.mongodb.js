"use strict";

const mongose = require("mongoose");
const { countConnect } = require("../helpers/check-connect");

const {
  db: { host, name, port },
} = require("../configs/config.mongo");
const connectString = `mongodb://${host}:${port}/${name}`;

console.log({ connectString });

class Database {
  static instance = null;
  static name = "My name is Database";

  constructor() {
    this.anotherName = "My name is Database";
    this.connect();
  }

  connect() {
    mongose
      .connect(connectString)
      .then(() => {
        console.log(
          `Connected Mongodb Success, Total conecction: ${countConnect()} `
        );
      })
      .catch((err) => console.log("Error Connect", err));
  }

  static getInstance() {
    if (this.instance === null) {
      this.instance = new Database();
      return this.instance;
    }
    return this.instance;
  }
}

const mongoDbInstance = Database.getInstance();

module.exports = mongoDbInstance;
