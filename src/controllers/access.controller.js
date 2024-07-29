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
  };

  logout = async (req, res, next) => {
    const delKey = await AccessService.logout(req.keyStore);
    new OK("Logout Success!", req.keyStore).send(res);
  };

  refreshToken = async (req, res, next) => {
    new OK(
      "Refresh Token Success!",
      await AccessService.refreshToken({
        refreshToken: req.refreshToken,
        userId: req.userId,
        keyStore: req.keyStore,
      })
    ).send(res);
  };

  getList = async (req, res, next) => {
    const listShop = ["Shop 1", "Shop 2"];
    new OK("Get List Shop Success!", listShop).send(res);
  };
}

module.exports = new AccessController();
