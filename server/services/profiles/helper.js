const dbService = require("../db.service");

const isSameUser = (currentUser, targetUser) => {
  console.log(currentUser, targetUser);
  return targetUser.toString() === currentUser.toString();
};

const isFriend = (currentUser, targetUser) =>
  dbService.getOne("users", { _id: currentUser }).then(user => {
    if (!user.friends) {
      return Promise.resolve();
    }
    const hasFriend =
      user &&
      user.friends &&
      user.friends.some(friend => friend.toString() === targetUser.toString());

    if (!hasFriend) {
      return Promise.reject();
    }
    return Promise.resolve();
  });

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

module.exports = {
  isSameUser,
  isFriend,
  isSameOrFriend
};
