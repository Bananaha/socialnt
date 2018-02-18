const express = require("express");
const Router = express.Router;

const loginService = require("../services/login.service");
const passwordService = require("../services/password.service");
const userService = require("../services/user.service");
const permission = require("../services/permission.service")
  .permissionDispatcher;
const tokenService = require("../services/token.service");

const upload = require("../services/uploadFile.service");

const router = new Router();

const getFriends = (req, res) => {
  console.log("getFriends", req.__user);
  userService.getFriends(req.params.values, req.__user).then(friends => {
    console.log("==============", friends);
    res.status(200).json(friends);
  });
};

const findUserProfil = (req, res) => {
  console.log("findUserProfil", req.__user);
  const clientToken = req.headers["x-csrf-token"];
  tokenService
    .verifyToken(clientToken)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(504).json(error);
    });
};

const deleteProfil = (req, res) => {
  console.log(req);
  userService
    .deleteProfil(req.__user)
    .then(result => {
      res.status(result.status).json(result.response);
    })
    .catch(error => {
      res.status(result.status).json(result.response);
    });
};
const deleteAllProfils = (req, res) => {
  console.log(req);
  userService
    .deleteAllProfils(req.__user)
    .then(result => {
      res.status(result.status).json(result.response);
    })
    .catch(error => {
      res.status(result.status).json(result.response);
    });
};

router
  .route("/editProfil")
  .post(permission("editProfil"), upload.single("file"), userService.update);

router.route("/search/:values").get(permission("search"), userService.findMany);
router
  .route("/search/friends/:values")
  .get(permission("searchFriends"), getFriends);
router
  .route("/findUserProfil")
  .get(permission("findUserProfil"), findUserProfil);

router.route("/reset/:token").get(passwordService.checkResetUrl);
router.route("/reset").post(passwordService.createResetUrl);
router.route("/newPassword").post(passwordService.setNewPassword);
router
  .route("/:targetUser")
  .get(permission("viewProfil"), userService.findById);
router.route("/").delete(permission("deleteProfil"), deleteProfil);
router.route("/all").delete(permission("deleteAllProfils"), deleteAllProfils);
module.exports = router;
