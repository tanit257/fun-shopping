"use strict";

const { OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp:`, req.body);
    const signUpResult = await AccessService.signUp(req.body);
    const successRequest = new OK("SignUp Success!", signUpResult);
    successRequest.send(res);
  };
}

module.exports = new AccessController();
