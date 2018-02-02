const dbService = require("../db.service");
const helper = require("./helper");

const canViewProfil = (currentUser, targetUser) =>
  helper.isSameUser(currentUser, targetUser) ||
  helper.isFriend(currentUser, targetUser);

const canSendMessage = (currentUser, targetUser) =>
  helper.isSameUser(currentUser, targetUser) ||
  helper.isFriend(currentUser, targetUser);

const canEditProfil = (currentUser, targetUser) =>
  helper.isSameUser(currentUser, targetUser) ||
  helper.isFriend(currentUser, targetUser);

const canSearch = currentUser => true;
const canFriendRequest = (currentUser, targetUser) =>
  !helper.isSameUser(currentUser, targetUser) ||
  !helper.isFriend(currentUser, targetUser);

module.exports = {
  canViewProfil,
  canSendMessage,
  canEditProfil,
  canSearch,
  canFriendRequest
};
