const express = require("express");
const Router = express.Router;

const passwordService = require("../services/password.service");
const userService = require("../services/user.service");
const permission = require("../services/permission.service")
  .permissionDispatcher;
const tokenService = require("../services/token.service");

const upload = require("../services/uploadFile.service");

const router = new Router();

const withoutPassword = user => {
  delete user.password;
  return user;
};

const findById = (req, res) => {
  userService
    .findById(req.params.targetUser)
    .then(user => {
      res.status(200).json(withoutPassword(user));
    })
    .catch(error => {
      console.log("ERROR => USER SERVICES FIND ONE", error);
      res.status(403).json({ error });
    });
};

const findFriends = (req, res) => {
  if (req.__profile === "admin") {
    userService
      .findMany(req.params.values, req.__user)
      .then(users => res.status(200).json(users.map(withoutPassword)))
      .catch(error => res.status(409).json(error));
  } else {
    userService.searchFriends(req.params.values, req.__user).then(friends => {
      res.status(200).json(friends);
    });
  }
};

const findManyUsers = (req, res) => {
  userService
    .findMany(req.params.values, req.__user)
    .then(users => res.status(200).json(users.map(withoutPassword)))
    .catch(error => res.status(409).json(error));
};

const findUserProfil = (req, res) => {
  const clientToken = req.headers["x-csrf-token"];

  tokenService
    .verifyToken(clientToken)
    .then(user => {
      res.status(200).json(user.map(withoutPassword));
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

const deleteProfil = (req, res) => {
  userService
    .deleteProfil(req.body._id)
    .then(result => {
      res.status(200).json({ alert: "utilisateur supprimé" });
    })
    .catch(error => {
      res.status(500).json({
        alert:
          "La suppression de l'utilisateur ne s'est pas déroulé comme prévu",
        error: error
      });
    });
};
const deleteAllProfils = (req, res) => {
  userService
    .deleteAllProfils()
    .then(result => {
      res.status(200).json(result.response);
    })
    .catch(error => {
      res.status(500).json(result.response);
    });
};

const getFriends = (req, res) => {
  userService
    .findByIdWithFriends(req.params.targetUser)
    .then(userWithFriends => {
      if (userWithFriends) {
        res.status(200).json({ friends: userWithFriends.friends });
        return;
      }
      res.status(200).json({ friends: [] });
    })
    .catch(error => res.status(500).json({ alert: error }));
};

// EDIT PROFIL
router
  .route("/editProfil/:targetUser")
  .post(permission("canEditProfil"), upload.single("file"), userService.update);

// SEARCH USERS OR FRIENDS
router.route("/search/:values").get(permission("canSearch"), findManyUsers);

router
  .route("/search/friends/:values")
  .get(permission("canSearchFriends"), findFriends);

// LOST PASSWORD AND RECOVERY
router.route("/reset/:token").get(passwordService.checkResetUrl);

router.route("/reset").post(passwordService.createResetUrl);
router.route("/newPassword").post(passwordService.setNewPassword);

// DELETE USERS
router
  .route("/deleteAll")
  .delete(permission("canDeleteAllProfils"), deleteAllProfils);
module.exports = router;

router.route("/deleteOne").post(permission("canDeleteProfil"), deleteProfil);

router
  .route("/findUserProfil")
  .get(permission("canFindUserProfil"), findUserProfil);

router
  .route("/friends/:targetUser")
  .get(permission("canGetFriends"), getFriends);

router.route("/:targetUser").get(permission("canViewProfil"), findById);
