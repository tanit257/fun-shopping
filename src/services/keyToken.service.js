const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

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

  static findByUserId = async (userId) => {
    console.log('userId', userId)
    const tokens = await keyTokenModel
      .findOne({ user: userId })
      .lean();
    return tokens;
  };

  static removeKeyById = async (keyStore) => {
    return await keyTokenModel.findOneAndDelete({_id: keyStore._id});
  };
}

module.exports = KeyTokenService;