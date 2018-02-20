const dbService = require("../db.service");
const helper = require("./helper");

const canViewProfil = helper.isSameOrFriend;

const canSendPost = helper.isSameOrFriend;

const canEditProfil = helper.isSameOrFriend;

const canFriendRequest = helper.isSameOrFriend;

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
