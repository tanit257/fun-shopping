const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const COLLECTION_NAME = "KeyTokens";
const DOCUMENTNAME = "KeyToken";

// Declare the Schema of the Mongo model

const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      required: true,
      default: [],
    },
    ref,
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENTNAME, keyTokenSchema);
