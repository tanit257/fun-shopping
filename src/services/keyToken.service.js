const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createOrUpdateOneKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
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
  };

  static updateOneKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
    refreshTokenUsed,
  }) => {
    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshTokenUsed,
      refreshToken,
    };
    const tokens = await keyTokenModel.updateOne(filter, update);

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (keyStore) => {
    return await keyTokenModel.findOneAndDelete({ _id: keyStore._id });
  };

  static removeKeyByUserId = async (userId) => {
    return await keyTokenModel.findOneAndDelete({ user: userId })
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken })
  };

  static findByTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  } 

}

module.exports = KeyTokenService;
