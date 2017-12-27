const express = require("express");
const Router = express.Router;

const loginService = require("../services/login.service");
const authentication = require("../services/token.service").authentication;

const router = new Router();

router.route("/").post(authentication, loginService.logIn);
router.route("/newUser").post(authentication, loginService.signIn);

module.exports = router;
