const dbService = require("../db.service");
const helper = require("./helper");
const ObjectId = require("mongodb").ObjectID;
const postService = require("../post.service");

const canViewProfil = helper.isSameOrFriend;

const canSendPost = helper.isSameOrFriend;

const canEditProfil = helper.isSameOrFriend;
const canFriendRequest = helper.isNotSameAndNotFriend;

const canSearchFriends = () => true;
const canSearch = () => true;
const canFindUserProfil = () => true;
// TODO ==> securiser la supression du profil
const canDeleteProfil = () => true;
const canFindFriendRequests = () => true;
const canDeleteAllProfils = () => false;
const canAnswerRequest = () => true;
const canGetFriends = helper.isSameOrFriend;

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
const canDeleteOneMessage = req => req.__user.toString() == req.body.authorId;

const canDeleteOneConversation = req =>
  req.__user.toString() == req.body.ownerId;

const canReplyToConversation = req =>
  req.body.recipients.some(
    recipient => recipient._id === req.__user.toString()
  );
const canRecommendFriend = req => {
  console.log(req.body, req.params, req.query);
  return helper.isFriend(
    req.__user,
    req.query.targetUser,
    req.query.requestRecipient
  );
};

const canRemoveFriend = req => helper.isFriend(req.__user, req.body.targetUser);

module.exports = {
  canAnswerRequest,
  canEditProfil,
  canFindFriendRequests,
  canFindUserProfil,
  canFriendRequest,
  canCreateNewConversation,
  canDeleteOneConversation,
  canDeleteOneMessage,
  canDeleteAllProfils,
  canDeleteProfil,
  canEditComment,
  canGetFriends,
  canGetMails,
  canRecommendFriend,
  canRemoveFriend,
  canReplyToConversation,
  canSearch,
  canSearchFriends,
  canSeePost,
  canSendPost,
  canViewProfil
};
