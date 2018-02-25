const dbService = require("../db.service");
const helper = require("./helper");
const ObjectId = require("mongodb").ObjectID;
const postService = require("../post.service");

// TODO => quand l'utilsiateur clique sur le lien vers son profil dans la nav, il est redirigé vers le login
const canViewProfil = helper.isSameOrFriend;

const canSendPost = helper.isSameOrFriend;

const canEditProfil = helper.isSameOrFriend;
// TODO completer la fonction pour prendre en compte les friendRequest si une invitation a déjà été envoyé, le bouton d'invitation ne doit pas apparaitre.
const canFriendRequest = helper.isSameOrFriend;

const canSearchFriends = () => true;
const canSearch = () => true;
const canFindUserProfil = () => true;
// TODO ==> securiser la supression du profil
const canDeleteProfil = () => true;
const canFindFriendRequests = () => true;
const canDeleteAllProfils = () => false;
const canAnswerRequest = () => true;
const canGetFriends = () => true;
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
const canDeleteOneMessage = req => req.__user.toString() == req.body.authorId;

const canDeleteOneConversation = req =>
  req.__user.toString() == req.body.ownerId;

const canReplyToConversation = req =>
  req.body.recipients.some(
    recipient => recipient._id === req.__user.toString()
  );

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
  canReplyToConversation,
  canGetFriends
};
