"use strict";

const { OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    const signUpResult = await AccessService.signUp(req.body);
    const successRequest = new OK("SignUp Success!", signUpResult);
    successRequest.send(res);
  };

  loginIn = async (req, res, next) => {
    const loginResult = await AccessService.login(req.body);
    const successRequest = new OK("Login Success!", loginResult);
    successRequest.send(res);
  }
}

module.exports = new AccessController();
