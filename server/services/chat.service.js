const ObjectId = require("mongodb").ObjectID;

const dbService = require("./db.service");

const createConversation = (friendId, userId) => {
  return dbService
    .create("chatConversations", {
      friends: [ObjectId(friendId), userId]
    })
    .then(conversation => conversation.ops[0])
    .catch(error => {
      console.log("new conversation error", error);
    });
};

const getOneConversation = (friendId, userId) => {
  console.log(friendId);
  return dbService
    .getOne("chatConversations", {
      friends: { $all: [userId, ObjectId(friendId)] }
    })
    .then(conversation => {
      if (conversation) {
        return conversation;
      } else {
        return createConversation(friendId, userId);
      }
    });
};

module.exports = {
  getOneConversation
};
