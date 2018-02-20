const express = require("express");
const Router = express.Router;

const passwordService = require("../services/password.service");
const userService = require("../services/user.service");
const permission = require("../services/permission.service")
  .permissionDispatcher;
const tokenService = require("../services/token.service");

const upload = require("../services/uploadFile.service");

const router = new Router();

const findFriends = (req, res) => {
  userService.findFriends(req.params.values, req.__user).then(friends => {
    res.status(200).json(friends);
  });
};

const findUserProfil = (req, res) => {
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
  userService
    .deleteAllProfils(req.__user)
    .then(result => {
      res.status(result.status).json(result.response);
    })
    .catch(error => {
      res.status(result.status).json(result.response);
    });
};

const getFriends = () => {
  console.log("getFriends");
};

// EDIT PROFIL
router
  .route("/editProfil")
  .post(permission("editProfil"), upload.single("file"), userService.update);

// SEARCH USERS OR FRIENDS
router.route("/search/:values").get(permission("search"), userService.findMany);

router
  .route("/search/friends/:values")
  .get(permission("searchFriends"), findFriends);

// LOST PASSWORD AND RECOVERY
router.route("/reset/:token").get(passwordService.checkResetUrl);

router.route("/reset").post(passwordService.createResetUrl);
router.route("/newPassword").post(passwordService.setNewPassword);

// DELETE USERS
router.route("/all").delete(permission("deleteAllProfils"), deleteAllProfils);
module.exports = router;

router.route("/").delete(permission("deleteProfil"), deleteProfil);

router
  .route("/findUserProfil")
  .get(permission("findUserProfil"), findUserProfil);

router.route("/friends").get(permission("getFriends"), getFriends);

router
  .route("/:targetUser")
  .get(permission("viewProfil"), userService.findById);
