"use strict";

const { permission } = require("process");
const { findById } = require("../services/apiKey.service");
const { ForbiddenError } = require("../core/error.response");

const { HEADER } = require("../auth/authUtils");

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    throw new ForbiddenError();
  }
  const objKey = await findById(key);
  if (!objKey) {
    throw new ForbiddenError();
  }
  req.objKey = objKey;
  return next();
};

const clientId = async (req, res, next) => {
  const clientId = req.headers[HEADER.CLIENT_ID]?.toString()
    ? req.headers[HEADER.CLIENT_ID]?.toString()
    : null;
  req.clientId = clientId;
  console.log("Qua day rooi", req.clientId);

  return next();
};

const checkPermission = (permission) => {
  // closure => return function that can use variable of parent function
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new ForbiddenError();
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new ForbiddenError();
    }
    return next();
  };
};

module.exports = { apiKey, checkPermission, clientId };
