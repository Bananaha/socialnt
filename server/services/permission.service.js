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
  canViewProfil: "canViewProfil",
  canSendPost: "canSendPost",
  canEditProfil: "canEditProfil",
  canSearch: "canSearch",
  canSearchFriends: "canSearchFriends",
  canFriendRequest: "canFriendRequest",
  canFindFriendRequests: "canFindFriendRequests",
  canFindUserProfil: "canFindUserProfil",
  canDeleteProfil: "canDeleteProfil",
  canDeleteAllProfils: "canDeleteAllProfils",
  canAnswerRequest: "canAnswerRequest",
  canEditComment: "canEditComment",
  canSeePost: "canSeePost",
  canGetMails: "canGetMails",
  canCreateNewConversation: "canCreateNewConversation",
  canDeleteOneConversation: "canDeleteOneConversation",
  canDeleteOneMessage: "canDeleteOneMessage",
  canReplyToConversation: "canReplyToConversation",
  canGetFriends: "canGetFriends",
  canRecommendFriend: "canRecommendFriend",
  canRemoveFriend: "canRemoveFriend"
};

const permissionDispatcher = requestedAction => {
  return (req, res, next) => {
    console.log("**************REQ_PAYLOAD***************");
    console.log(req.body, req.params, req.query);
    console.log("**************USER && PROFILE***************");
    console.log(req.__user, req.__profile);
    console.log("**************REQUEST_ACTION***************");
    console.log(requestedAction);
    if (!req.__profile) {
      res.status(403).redirect(path.join("/"));
      return;
    }

    const currentUser = req.__user;
    const matchingProfile = profiles[req.__profile];
    const permissionCallback = PERMISSIONS_CALLBACKS[requestedAction];
    const canDoAction = matchingProfile[permissionCallback](req);
    handleRequestAnswer(canDoAction)
      .then(() => {
        console.log(
          `[ACCEPT] Requested action ${requestedAction} with ${
            req.__profile
          } profile is approved`
        );
        next();
      })
      .catch(error => {
        console.log(
          `[REJECT] Requested action ${requestedAction} with ${
            req.__profile
          } profile is rejected`,
          error
        );
        if (req.__profile === "visitor") {
          res
            .status(403)
            .redirect(path.join(__dirname + "/../../client/public/index.html"));
          return;
        }
        res.status(403).json({
          alert: "Vous n'êtes pas authorisé à effectuer cette action"
        });
      });
  };
};

module.exports = {
  permissionDispatcher
};
