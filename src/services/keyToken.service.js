const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = KeyTokenService;

//Normal

// 1. Store privatekey in Env
// 2. Use private key to generate public key (Access token)
// 3. Send accesss key to client

// ??? Why we have to store Private and Public key in DB.
// Does it have to generate a lot of keys for each user?

/*
  cách 1 có lưu private key ở .env => trường hợp bị lộ là có
  
  cách 2: gen đại 1 cặp key sau đó không cần lưu private key
  chỉ lưu public key ở db, khi cần verify thì dùng public key để verify
  => không cần lưu private key
  Trường hợp hết hạn thì gen lại cặp key mới


*/
