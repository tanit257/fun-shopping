"use strict";

const { model, Schema, Type } = require("mongoose");

const DOCUMENTNAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";

const apiKeySchema = new Schema(
  {
    key: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["READ", "WRITE", "DELETE"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expired: "30d",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENTNAME, apiKeySchema);
