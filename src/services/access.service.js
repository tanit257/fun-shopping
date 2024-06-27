"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
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
        publicKey,
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
      publicKey,
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

  static refreshToken = async ({ refreshToken }, clientId) => {
    if (!clientId) {
      throw new BadRequestError("Not found Client Id");
    }
    const keyStore = await KeyTokenService.findByUserId(clientId);
    if (!keyStore) {
      throw new BadRequestError("RefreshToken is not found");
    }
    try {
      JWT.verify(refreshToken, keyStore.publicKey, { algorithms: ["RS256"] });
    } catch (err) {
      console.log(err);
      throw new AuthFailureError("RefreshToken is invalid");
    }
    const { refreshTokenUsed } = keyStore;

    if (refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeKeyById(keyStore._id);
      throw new BadRequestError(
        "We found your refreshToken is used by another person."
      );
      //remove token
    }
    const newRefreshTokenUsed = [...refreshTokenUsed, refreshToken];

    const { privateKey: newPrivateKey, publicKey: newPublicKey } =
      crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await createTokenPair(
        { userId: keyStore.user },
        newPublicKey,
        newPrivateKey
      );

    await KeyTokenService.updateOneKeyToken({
      userId: keyStore.user,
      newPublicKey,
      newPrivateKey,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      refreshTokenUsed: newRefreshTokenUsed,
    });

    return {
      newAccessToken,
      newRefreshToken,
    };
  };
}

module.exports = AccessService;
