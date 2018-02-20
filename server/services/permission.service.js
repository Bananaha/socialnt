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
  sendPost: "canSendPost",
  editProfil: "canEditProfil",
  search: "canSearch",
  searchFriends: "canSearchFriends",
  friendRequest: "canFriendRequest",
  findUserProfil: "canFindUserProfil",
  deleteProfil: "canDeleteProfil",
  deleteAllProfils: "canDeleteAllProfils"
};

const permissionDispatcher = requestedAction => {
  return (req, res, next) => {
    // no profile => redirect + error
    if (!req.__profile) {
      res.status(403).redirect(path.join("/"));
      return;
    }

    const currentUser = req.__user;
    const matchingProfile = profiles[req.__profile];
    const permissionCallback = PERMISSIONS_CALLBACKS[requestedAction];

    console.log("____ permissionDispatcher, requestedAction", requestedAction);

    const canDoAction = matchingProfile[permissionCallback](req);
    handleRequestAnswer(canDoAction)
      .then(() => {
        console.log(`[INFO] Requested action ${requestedAction} approved`);
        next();
      })
      .catch(error => {
        console.log(
          `[INFO] Requested action ${requestedAction} rejected`,
          error
        );
        if (req.__profile === "visitor") {
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
