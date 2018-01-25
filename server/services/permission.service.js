"use strict";

const path = require("path");
const profiles = require("./profiles");

const handleRequestAnswer = canDoAction => {
  if (typeof canDoAction === "boolean") {
    return new Promise((resolve, reject) => {
      return canDoAction ? resolve() : reject();
    });
  }
  return canDoAction;
};

const PERMISSIONS_CALLBACKS = {
  viewProfil: "canViewProfil",
  sendMessage: "canSendMessage",
  editProfil: "canEditProfil",
  search: "canSearch"
};

const permissionDispatcher = request => {
  return (req, res, next) => {
    // no profile => redirect + error
    if (!req.__profil) {
      res.status(403).redirect(path.join("/"));
      return;
    }

    const currentUser = req.__user;
    const targetUser = req.body.targetUser || req.params.targetUser;

    const matchingProfile = profiles[req.__profil];
    const permissionCallback = PERMISSIONS_CALLBACKS[request];
    const canDoAction = matchingProfile[permissionCallback](
      currentUser,
      targetUser
    );

    handleRequestAnswer(canDoAction)
      .then(() => {
        console.log("approuved");
        next();
      })
      .catch(() => {
        console.log("reject");
        if (req.__profil === "visitor") {
          res
            .status(403)
            .redirect(path.join(__dirname + "/../../client/public/index.html"));
          return;
        }
        res.status(403).json({
          alert: "Vous n'êtes pas autorisé à effectuer cette action"
        });
      });
  };
};

module.exports = {
  permissionDispatcher
};
