"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair, JwtVerify } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const KeyTokenService = require("./keyToken.service");
const SALT_ROUNDS = 10;
const JWT = require("jsonwebtoken");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // step1 : check email exists??
    // lean query nhanh -> return pure short object js
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Shop is already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: RoleShop.SHOP,
    });
    if (newShop) {
      //create privateKey, PublicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

      const { accessToken, refreshToken } = await createTokenPair(
        { userId: newShop._id },
        privateKey
      );

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        accessToken,
        refreshToken,
      };
    }
  };

  static login = async ({ email, password }) => {
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError("Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new BadRequestError("Authentication Error");
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const { accessToken, refreshToken } = await createTokenPair(
      { userId: foundShop._id },
      privateKey
    );

    await KeyTokenService.createOrUpdateOneKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      accessToken,
      refreshToken,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static refreshToken = async ({ refreshToken, userId, keyStore }) => {
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeKeyById(keyStore._id);
      throw new BadRequestError("Something wrong happend, please re-login");
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    
    if (!holderToken) {
      throw new BadRequestError("Shop is not register");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await createTokenPair({ userId }, keyStore.privateKey);

    await holderToken.updateOne({
      $set: {
        refreshToken: newRefreshToken,
      },
      $addToSet: {
        refreshTokenUsed: newRefreshToken,
      },
    });

    return {
      newAccessToken,
      newRefreshToken,
    };
  };
}

module.exports = AccessService;
