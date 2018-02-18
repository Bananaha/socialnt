const dbService = require("../db.service");
const helper = require("./helper");

const canViewProfil = (currentUser, targetUser) =>
  helper.isSameUser(currentUser, targetUser) ||
  helper.isFriend(currentUser, targetUser);

const canSendPost = (currentUser, targetUser) =>
  helper.isSameUser(currentUser, targetUser) ||
  helper.isFriend(currentUser, targetUser);

const canEditProfil = (currentUser, targetUser) =>
  helper.isSameUser(currentUser, targetUser) ||
  helper.isFriend(currentUser, targetUser);

const canFriendRequest = (currentUser, targetUser) =>
  !helper.isSameUser(currentUser, targetUser) ||
  !helper.isFriend(currentUser, targetUser);
const canSearchFriends = currentUser => true;
const canSearch = currentUser => true;
const canFindUserProfil = currentUser => true;
const canDeleteProfil = () => true;
const canDeleteAllProfils = () => false;

module.exports = {
  canViewProfil,
  canSendPost,
  canEditProfil,
  canSearch,
  canSearchFriends,
  canFriendRequest,
  canFindUserProfil,
  canDeleteProfil,
  canDeleteAllProfils
};
