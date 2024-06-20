"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const SALT_ROUNDS = 10;

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      console.log("Go here");
      // step1 : check email exists??
      // lean query nhanh -> return pure short object js
      const holderShop = await shopModel.findOne({ email }).lean();
      console.log({ holderShop });
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered",
          status: "error",
        };
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      console.log("HERRE", {
        name,
        email,
        hashedPassword,
        roles: RoleShop.SHOP,
      });

      const newShop = await shopModel.create({
        name,
        email,
        hashedPassword,
        roles: RoleShop.SHOP,
      });
      console.log("Hhhhhhhhhhh");
      console.log("NEWW SHOP", newShop);
      if (newShop) {
        //create privateKey, PublicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 2048,
          publicKeyEncoding: { type: "spki", format: "pem" },
          privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });
        console.log({ privateKey, publicKey }); //save collection KEYSTORE
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
