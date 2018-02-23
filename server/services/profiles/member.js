const dbService = require("../db.service");
const helper = require("./helper");
const ObjectId = require("mongodb").ObjectID;
const postService = require("../post.service");

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

const canEditComment = req =>
  new Promise((resolve, reject) => {
    const currentUser = req.__user;
    console.log(req.params);
    return false;
  });

const canSeePost = req =>
  postService.getUsersFromPost(req.params.id).then(users => {
    const currentUserId = req.__user.toString();
    return users.some(user => {
      return (
        user.friends &&
        user.friends.some(friend => friend.toString() === currentUserId)
      );
    });
  });

const canGetMails = helper.isSameUser;

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
  canDeleteAllProfils,
  canEditComment,
  canSeePost,
  canGetMails
};
