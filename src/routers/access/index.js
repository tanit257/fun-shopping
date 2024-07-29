"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authRefreshToken } = require("../../auth/authUtils");
const router = express.Router();

//signUP

router.post("/shop/signup", asyncHandler(accessController.signUp));

router.post("/shop/login", asyncHandler(accessController.loginIn));

router.post(
  "/shop/refresh-token",
  asyncHandler(authRefreshToken),
  asyncHandler(accessController.refreshToken)
);

router.use(asyncHandler(authentication));

router.get("/shop/get-list", asyncHandler(accessController.getList));

router.post("/shop/logout", asyncHandler(accessController.logout));

module.exports = router;
