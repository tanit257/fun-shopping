"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const KeyTokenService = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "client-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: "1 days",
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
const authentication =  async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new AuthFailureError("Invalid Request")

    const keyStore = await KeyTokenService.findByUserId(userId);

    if(!keyStore) throw new NotFoundError("Not Found Key Token")

    const accessToken = req.headers[HEADER.AUTHORIZATION];

    try{
      const decodeToken = JWT.verify(accessToken, keyStore.publicKey)
      if (userId !== decodeToken.userId) throw new AuthFailureError("Invalid Token")
      req.KeyStore = keyStore; 
      return next();
    }
    catch(err) {
      if(err.name === "TokenExpiredError") {
        throw new AuthFailureError("Token Expired")
      }
      throw new AuthFailureError("Invalid Token")
    }
};


module.exports = { createTokenPair, authentication, HEADER };
