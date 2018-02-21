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
const canFindFriendRequests = () => true;
const canDeleteAllProfils = () => false;
const canAnswerRequest = () => true;

module.exports = {
  canSendPost,
  canSearch,
  canSearchFriends,
  canFriendRequest,
  canFindFriendRequests,
  canAnswerRequest,
  canEditProfil,
  canViewProfil,
  canFindUserProfil,
  canDeleteProfil,
  canDeleteAllProfils
};
