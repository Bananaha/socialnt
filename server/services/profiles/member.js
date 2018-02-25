const dbService = require("../db.service");
const helper = require("./helper");
const ObjectId = require("mongodb").ObjectID;
const postService = require("../post.service");

const canViewProfil = helper.isSameOrFriend;

const canSendPost = helper.isSameOrFriend;

const canEditProfil = helper.isSameOrFriend;

const canFriendRequest = helper.isSameOrFriend;

const canSearchFriends = () => true;
const canSearch = () => true;
const canFindUserProfil = () => true;
// TODO ==> securiser la supression du profil
const canDeleteProfil = () => true;
const canFindFriendRequests = () => true;
const canDeleteAllProfils = () => false;
const canAnswerRequest = () => true;
// TODO ==> canEditCOmment fini ?
const canEditComment = req =>
  new Promise((resolve, reject) => {
    const currentUser = req.__user;
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

const canGetMails = () => true;
const canCreateNewConversation = () => true;
const canDeleteOneMessage = req => {
  console.log(
    req.__user.toString() == req.body.authorId,
    typeof req.__user.toString(),
    typeof req.body.authorId,
    req.body.authorId,
    req.__user
  );
  return req.__user.toString() == req.body.authorId;
};
const canDeleteOneConversation = req => {
  console.log(
    req.__user.toString() == req.body.ownerId,
    typeof req.__user.toString(),
    typeof req.body.ownerId,
    req.body.ownerId,
    req.__user
  );
  return req.__user.toString() == req.body.ownerId;
};

const canReplyToConversation = req => {
  console.log(
    req.__user.toString() == req.body.ownerId,
    typeof req.__user.toString(),
    typeof req.body.ownerId,
    req.body.ownerId,
    req.__user
  );
  console.log(
    req.body.recipients.some(
      recipient => recipient._id === req.__user.toString()
    )
  );
  return req.body.recipients.some(
    recipient => recipient._id === req.__user.toString()
  );
};

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
  canGetMails,
  canCreateNewConversation,
  canDeleteOneMessage,
  canDeleteOneConversation,
  canReplyToConversation
};
