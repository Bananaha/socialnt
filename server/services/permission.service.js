"use strict";

const dbService = require("./db.service");
const ObjectId = require("mongodb").ObjectID;

const viewProfil = (currentUser, targetUser) => {
  console.log("++++", targetUser, currentUser);
  if (targetUser.toString() === currentUser.toString()) {
    console.log("same user");
    return true;
  } else {
    console.log("different user");
    return dbService
      .getOne("users", { _id: currentUser })
      .then(user => {
        if (user) {
          const userFriends = user.friends;
          console.log(userFriends);
          userFriends.forEach(friend => {
            if (targetUser === friend) {
              return true;
            } else {
              return false;
            }
          });
        }
      })
      .catch(error => {
        console.log("PERMISSION VIEW PROFIL => DB ERROR ==== ", error);
        return false;
      });
  }
};

const sendMessage = (currentUser, targetUser) => {
  console.log("++++", targetUser, currentUser);
  if (targetUser.toString() === currentUser.toString()) {
    console.log("same user");
    return true;
  } else {
    console.log("different user");
    dbService
      .getOne("users", { _id: currentUser })
      .then(user => {
        if (user) {
          const userFriends = user.friends;
          if (userFriends) {
            userFriends.forEach(friend => {
              if (targetUser === friend) {
                return true;
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        }
      })
      .catch(error => {
        console.log("PERMISSION SEND MESSAGE => DB ERROR ==== ", error);
        return false;
      });
  }
};

const can = {
  viewProfil: "viewProfil",
  sendMessage: "sendMessage"
};

const permissionDispatcher = request => {
  return (req, res, next) => {
    const currentUser = req.__user;
    const targetUser = req.body.targetUser || req.params.targetUser;
    console.log(targetUser, currentUser);
    if (req.__profil) {
      switch (req.__profil) {
        case "admin":
          next();
          break;
        case "member":
          if (request) {
            console.log(request);
            let permissionGranted;
            switch (request) {
              case "viewProfil":
                permissionGranted = viewProfil(currentUser, targetUser);
                break;
              case "sendMessage":
                permissionGranted = sendMessage(currentUser, targetUser);
                break;
              default:
                break;
            }
            if (permissionGranted) {
              next();
            } else {
              res.status(403).json({
                alert: "Vous n'êtes pas autorisé à effectuer cette action"
              });
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
