"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authRefreshToken } = require("../../auth/authUtils");
const router = express.Router();

//signUP

router.use(asyncHandler(authentication));

router.post("/product", asyncHandler(productController.create));

module.exports = router;
