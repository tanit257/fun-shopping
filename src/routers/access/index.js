"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { NotFoundError } = require("../../core/error.response");
const router = express.Router();

//signUP

router.post("/shop/signup", asyncHandler(accessController.signUp));

router.post("/shop/login", asyncHandler(accessController.loginIn));

module.exports = router;
