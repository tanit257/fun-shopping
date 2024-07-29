"use strict";

const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "client-id",
  REFRESH_TOKEN: "refresh-token",
};

const createTokenPair = async (payload, secretKey) => {
  const accessToken = await JWT.sign(payload, secretKey, {
    expiresIn: "60 minutes",
    algorithm: "RS256",
  });

  const refreshToken = await JWT.sign(payload, secretKey, {
    expiresIn: "30 days",
    algorithm: "RS256",
  });
  return { accessToken, refreshToken };
};

const authRefreshToken = async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Not Found Key Token");

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];

  if (!refreshToken) throw new AuthFailureError("Invalid Request");
  try {
    const decodeToken = JWT.verify(refreshToken, keyStore.publicKey);
    if (userId !== decodeToken.userId)
      throw new AuthFailureError("Invalid Token");
    req.keyStore = keyStore;
    req.userId = decodeToken.userId;
    req.refreshToken = refreshToken;
    return next();
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      throw new AuthFailureError("Token Expired");
    }
    throw new AuthFailureError("Invalid Token");
  }
};

const authentication = async (req, res, next) => {
  const userId = req.clientId;
  if (!userId) throw new AuthFailureError("Invalid Request");
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found Key Token");
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  try {
    const decodeToken = JWT.verify(accessToken, keyStore.privateKey);
    if (userId !== decodeToken.userId)
      throw new AuthFailureError("Invalid Token");
    req.keyStore = keyStore;
    return next();
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      throw new AuthFailureError("Token Expired");
    }
    throw new AuthFailureError("Invalid Token");
  }
};

const JwtVerify = async (jwtToken, secretKey) => {
  return JWT.verify(jwtToken, secretKey);
};

module.exports = {
  createTokenPair,
  authentication,
  authRefreshToken,
  HEADER,
  JwtVerify,
};
