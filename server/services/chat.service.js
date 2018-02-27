const ObjectId = require("mongodb").ObjectID;

const dbService = require("./db.service");

const populateChatMessagesWithUsers = (users, messages) => {
  const usersDictionnary = users.reduce((acc, user) => {
    const userIdStringify = user._id.toString();
    acc[userIdStringify] = {
      _id: userIdStringify,
      pseudo: user.pseudo
    };
    return acc;
  }, {});

  messages.forEach(message => {
    if (
      message.author.toString() &&
      usersDictionnary[message.author.toString()]
    ) {
      message.author = usersDictionnary[message.author.toString()];
    }
  });
  return messages;
};

const addMessage = (conversationId, message, user) => {
  const createdMessage = {
    text: message,
    author: user._id,
    date: Date.now()
  };

  return dbService
    .updateAndReturn(
      "chatConversations",
      { _id: ObjectId(conversationId) },
      {
        $push: {
          messages: createdMessage
        }
      }
    )
    .then(res => ({
      message: createdMessage,
      users: res.value.users
    }))
    .catch(error => {
      console.log("add Message error", error);
    });
};

const createConversation = (friendId, userId) => {
  return dbService
    .create("chatConversations", {
      users: [ObjectId(friendId), userId]
    })
    .then(conversation => conversation.ops[0])
    .catch(error => {
      console.log("new conversation error", error);
    });
};

const getOrCreateByUsers = (friendId, userId) => {
  return dbService
    .getOne("chatConversations", {
      users: { $all: [userId, ObjectId(friendId)] }
    })
    .then(conversation => {
      return conversation || createConversation(friendId, userId);
    })
    .then(conversation => getWithAggregatedUsers(conversation._id));
};

const getWithAggregatedUsers = conversationId => {
  const othersCollections = [
    {
      collectionName: "users",
      collectionField: "_id",
      collectionAlias: "users"
    }
  ];
  return dbService
    .aggregate(
      "chatConversations",
      "users",
      {
        _id: conversationId
      },
      othersCollections
    )
    .then(conversations => {
      if (conversations[0].messages && conversations[0].messages.length > 0) {
        conversations[0].messages = populateChatMessagesWithUsers(
          conversations[0].users,
          conversations[0].messages
        );
      }

      return conversations[0];
    })
    .catch(error => console.log(error));
};

module.exports = {
  getOrCreateByUsers,
  addMessage
};
