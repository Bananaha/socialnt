const express = require("express");
const Router = express.Router;

const loginService = require("../services/login.service");
const authentication = require("../services/token.service").authentication;
const router = new Router();

const logUser = (req, res) => {
  loginService
    .logIn(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(401).json({
        alert:
          error && error.alert
            ? error.alert
            : "Impossible de se connecter pour le moment. Contactez un administrateur"
      });
    });
};

const signUser = (req, res) => {
  loginService
    .signIn(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(401).json({
        alert:
          error && error.alert
            ? error.alert
            : "Le processus d'inscription n'a pu aboutir. Contactez un administrateur"
      });
    });
};

router.route("/").post(logUser);
router.route("/newUser").post(signUser);

module.exports = router;
