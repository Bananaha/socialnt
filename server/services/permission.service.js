"use strict";

const dbService = require("./db.service");
const ObjectId = require("mongodb").ObjectID;

const viewProfil = (currentUser, targetUser) => {
  let permissionGranted = false;
  if (targetUser === currentUser) {
    permissionGranted = true;
  }

  if (currentUser === "member") {
    return dbService
      .getOne("users", { _id: req.__user })
      .then(user => {
        if (user) {
          userFriends = user.friends;
          userFriends.forEach(friend => {
            if (targetUser === friend) {
              permissionGranted = true;
            } else {
              permissionGranted = false;
            }
          });
        }
      })
      .catch(error => {
        console.log("PERMISSION VIEW PROFIL => DB ERROR ==== ", error);
        permissionGranted = false;
      });
  } else {
    return false;
  }
};

const sendMessage = (currentUser, targetUser) => {
  let permissionGranted = false;
  if (targetUser === currentUser) {
    permissionGranted = true;
  } else {
    dbService
      .getOne("users", { _id: currentUser })
      .then(user => {
        if (user) {
          userFriends = user.friends;
          userFriends.forEach(friend => {
            if (targetUser === friend) {
              permissionGranted = true;
            } else {
              permissionGranted = false;
            }
          });
        }
      })
      .catch(error => {
        console.log("PERMISSION SEND MESSAGE => DB ERROR ==== ", error);
        permissionGranted = false;
      });
  }
  return permissionGranted;
};

const can = {
  viewProfil: "viewProfil",
  sendMessage: "sendMessage"
};

const permissionDispatcher = request => {
  return (req, res, next) => {
    const currentUser = req.__user;
    const targetUser = req.body;
    console.log(targetUser, currentUser);
    if (req.__profil) {
      const userProfil = req.__profil;
      switch (userProfil) {
        case "admin":
          next();
          break;
        case "member":
          if (request) {
            for (let key in can) {
              if (key === request) {
                console.log("key", key);
              }
              switch (key) {
                case "viewProfil":
                  return viewProfil(currentUser, targetUser);
                  break;
                case "sendMessage":
                  return sendMessage(currentUser, targetUser);
                  break;
                default:
                  break;
              }
            }
          } else {
            next();
          }
          break;
        case "visitor":
          res.status(403).json({
            alert: "Vous devez être authentifier pour accéder à ce contenu."
          });
          break;
        default:
          res.status(403).json({
            alert: "Vous devez être authentifier pour accéder à ce contenu."
          });
          break;
      }
    } else {
    }
  };
};

module.exports = {
  permissionDispatcher
};
