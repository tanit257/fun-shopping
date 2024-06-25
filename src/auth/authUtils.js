"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
      algorithm: "RS256",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "30 days",
      algorithm: "RS256",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("decode verified", decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    return {
      code: "xxx",
      message: error.message,
      status: "error",
    };
  }
};

module.exports = { createTokenPair };
