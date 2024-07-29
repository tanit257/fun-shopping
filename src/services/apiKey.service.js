"use strict";

const apiKeyModel = require("../models/apiKey.model");
const crypto = require("crypto");

const findById = async (key) => {
  try {
    // const newKey = await apiKeyModel.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["READ", "WRITE"],
    // });
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
  } catch (error) {
    console.log(error);
    return {
      code: "xxx",
      message: error.message,
      status: "error",
    };
  }
};

module.exports = { findById };
