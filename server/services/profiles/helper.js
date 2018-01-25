const dbService = require("../db.service");

const isSameUser = (currentUser, targetUser) =>
  targetUser.toString() === currentUser.toString();

const isFriend = (currentUser, targetUser) =>
  new Promise((resolve, reject) => {
    dbService.getOne("users", { _id: currentUser }).then(user => {
      const hasFriend =
        user &&
        user.friends &&
        userFriends.some(friend => friend === targetUser);
      if (!hasFriend) {
        reject();
        return;
      }
      resolve();
    });
  });

module.exports = {
  isSameUser,
  isFriend
};
