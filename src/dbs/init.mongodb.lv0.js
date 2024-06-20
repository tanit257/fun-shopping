"use strict";

const mongose = require("mongoose");

mongose
  .connect(connectString)
  .then(() => {
    console.log(`Connected Mongodb Success`);
  })
  .catch((err) => console.log("Error Connect"));

if (1 === 1) {
  mongose.set("debug", true);
  mongose.set("debug", { color: true });
}

module.export = mongose;
