const express = require("express");
const Router = express.Router;

const loginService = require("../services/login.service");
const authentication = require("../services/token.service").authentication;
const router = new Router();

const logUser = (req, res) => {
  loginService
    .logIn(req.body, req.__token)
    .then(result => {
      console.log("=========", result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log("logUser loginRoute", error);
      res.status(409).json(error);
    });
};

const signUser = (req, res) => {
  loginService
    .signIn(req.body, req.__token)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => res.status(504).json(error));
};

router.route("/").post(authentication, logUser);
router.route("/newUser").post(signUser);

module.exports = router;
