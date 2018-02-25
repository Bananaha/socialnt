const express = require("express");
const Router = express.Router;

const passwordService = require("../services/password.service");
const userService = require("../services/user.service");
const permission = require("../services/permission.service")
  .permissionDispatcher;
const tokenService = require("../services/token.service");

const upload = require("../services/uploadFile.service");

const router = new Router();

const findById = (req, res) => {
  userService
    .findById(req.params.targetUser)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log("ERROR => USER SERVICES FIND ONE", error);
      res.status(403).json({ error });
    });
};

const findFriends = (req, res) => {
  userService.searchFriends(req.params.values, req.__user).then(friends => {
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
  .post(permission("canEditProfil"), upload.single("file"), userService.update);

// SEARCH USERS OR FRIENDS
router
  .route("/search/:values")
  .get(permission("canSearch"), userService.findMany);

router
  .route("/search/friends/:values")
  .get(permission("canSearchFriends"), findFriends);

// LOST PASSWORD AND RECOVERY
router.route("/reset/:token").get(passwordService.checkResetUrl);

router.route("/reset").post(passwordService.createResetUrl);
router.route("/newPassword").post(passwordService.setNewPassword);

// DELETE USERS
router
  .route("/all")
  .delete(permission("canDeleteAllProfils"), deleteAllProfils);
module.exports = router;

router.route("/").delete(permission("canDeleteProfil"), deleteProfil);

router
  .route("/findUserProfil")
  .get(permission("canFindUserProfil"), findUserProfil);

router.route("/friends").get(permission("canGetFriends"), getFriends);

router.route("/:targetUser").get(permission("canViewProfil"), findById);
