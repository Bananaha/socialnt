"use strict";
const dbService = require("../db.service");

const isSameUser = (currentUser, targetUser) => {
  console.log(currentUser, targetUser);
  return targetUser.toString() === currentUser.toString();
};

const isFriend = (currentUser, targetUser, requestRecipient) => {
  return dbService.getOne("users", { _id: currentUser }).then(user => {
    if (!user.friends) {
      return Promise.resolve();
    }
    console.log("========================");
    console.log(user.friends, requestRecipient);
    console.log("========================");
    let hasFriend =
      user &&
      user.friends &&
      user.friends.length > 0 &&
      user.friends.some(friend => friend.toString() === targetUser.toString());

    if (requestRecipient) {
      hasFriend =
        user &&
        user.friends &&
        user.friends.length > 0 &&
        user.friends.some(
          friend => friend.toString() === targetUser.toString()
        ) &&
        user.friends.some(
          friend => friend.toString() === requestRecipient.toString()
        );
    }
    if (!hasFriend) {
      return Promise.reject();
    }
    return Promise.resolve();
  });
};

const isNotFriend = (currentUser, targetUser) => {
  return dbService.getOne("users", { _id: currentUser }).then(user => {
    if (!user.friends) {
      return Promise.reject();
    }
    let hasFriend =
      user &&
      user.friends &&
      user.friends.some(friend => friend.toString() === targetUser.toString());

    if (hasFriend) {
      return Promise.reject();
    }
    return Promise.resolve();
  });
};

const isSameOrFriend = req =>
  new Promise((resolve, reject) => {
    const currentUser = req.__user;
    const targetUser = req.body.targetUser || req.params.targetUser;

    if (isSameUser(currentUser, targetUser)) {
      resolve(true);
      return;
    }

    isFriend(currentUser, targetUser)
      .then(resolve)
      .catch(reject);
  });

const isNotSameAndNotFriend = req =>
  new Promise((resolve, reject) => {
    const currentUser = req.__user;
    const targetUser = req.body.targetUser || req.params.targetUser;

    if (isSameUser(currentUser, targetUser)) {
      reject(false);
      return;
    }

    isNotFriend(currentUser, targetUser)
      .then(resolve)
      .catch(reject);
  });

module.exports = {
  isSameUser,
  isFriend,
  isSameOrFriend,
  isNotSameAndNotFriend
};
