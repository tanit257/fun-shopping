"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//signUP

router.post("/shop/signup", asyncHandler(accessController.signUp));

router.post("/shop/login", asyncHandler(accessController.loginIn));

router.use(asyncHandler(authentication));

router.post ("/shop/logout", asyncHandler(accessController.logout));

module.exports = router;
