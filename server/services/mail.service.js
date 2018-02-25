const ObjectId = require("mongodb").ObjectID;

const dbService = require("./db.service");
const userService = require("./user.service");

const CONVERSATIONS_COUNT_PER_PAGE = 10;

const extractUsersFromConversations = conversations => {
  return conversations
    .map(conversation => (conversation = conversation.recipients))
    .reduce((acc, currentValue) => acc.concat(currentValue), [])
    .reduce((users, recipient) => {
      const id = recipient.toString();
      if (users.indexOf(id) === -1) {
        users.push(id);
      }
      return users;
    }, [])
    .map(id => ObjectId(id));
};

const populateConversationsWithUsers = (conversations, users) => {
  const usersDictionnary = users.reduce((acc, user) => {
    acc[user._id] = {
      _id: user._id,
      pseudo: user.pseudo
    };
    return acc;
  }, {});

  conversations.forEach(conversation => {
    conversation.computedRecipients = [];
    const ownerStringified = conversation.owner.toString();
    if (
      ownerStringified === usersDictionnary[ownerStringified]._id.toString()
    ) {
      conversation.owner = usersDictionnary[ownerStringified];
    }
    conversation.recipients.forEach(recipient => {
      const recipientStringified = recipient.toString();
      if (
        recipientStringified ===
        usersDictionnary[recipientStringified]._id.toString()
      ) {
        conversation.computedRecipients.push(
          usersDictionnary[recipientStringified]
        );
      }
    });
    conversation.messages.forEach(message => {
      const authorStringified = message.author.toString();
      if (
        authorStringified === usersDictionnary[authorStringified]._id.toString()
      ) {
        message.author = usersDictionnary[authorStringified];
      }
    });

    conversation.recipients = conversation.computedRecipients;
    delete conversation.computedRecipients;
  });
  return conversations;
};

const getAllUserMail = (currentUserId, page) => {
  return dbService
    .findAndCount(
      "mails",
      {
        $or: [
          { owner: ObjectId(currentUserId) },
          { recipients: { $in: [ObjectId(currentUserId)] } }
        ]
      },
      { lastUpdate: -1 },
      CONVERSATIONS_COUNT_PER_PAGE * page - CONVERSATIONS_COUNT_PER_PAGE,
      CONVERSATIONS_COUNT_PER_PAGE
    )
    .then(result => {
      const conversations = result[0];
      const count = result[1];
      const extractedUsers = extractUsersFromConversations(conversations);
      return userService
        .find({
          _id: { $in: extractedUsers }
        })
        .then(users => {
          return {
            conversations: populateConversationsWithUsers(conversations, users),
            count
          };
        });
    })
    .catch(error => {
      return error;
    });
};

// insert new conversation in data base
// @params currentUser 'string' id of conversation creator
// @params recipients 'array' id of conversation recipients
// @params text 'string'

const createConversation = (currentUserId, recipients, text) => {
  computedMailContent = computeNewMessage(text, currentUserId);
  const mailModel = {
    owner: ObjectId(currentUserId),
    recipients: computedRecipientsList(currentUserId, recipients),
    messages: [computedMailContent],
    status: "active",
    lastUpdate: Date.now()
  };

  return dbService
    .create("mails", mailModel)
    .then(newConversation => {
      return newConversation;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
};

const sortAsc = (object, key) => object.sort((a, b) => b[key] - a[key]);

const computeNewMessage = (text, currentUserId) => {
  return {
    _id: ObjectId(),
    author: currentUserId,
    text: text,
    date: Date.now()
  };
};

const computedRecipientsList = (currentUserId, recipients) => {
  recipients.push(currentUserId);
  return recipients.map(recipient => (recipient = ObjectId(recipient)));
};

const deleteOneConversation = (conversationId, ownerId) => {
  console.log(conversationId, typeof conversationId, ownerId, typeof ownerId);
  return dbService
    .deleteOne("mails", {
      _id: ObjectId(conversationId),
      owner: ObjectId(ownerId)
    })
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(error => {
      console.log("service", error);
      return error;
    });
};

const deleteOneMessage = (messageId, conversationId) => {
  return dbService
    .updateAndReturn(
      "mail",
      { _id: ObjectId(conversationId) },
      { $pull: { messages: { _id: { $in: [messageId] } } } }
    )
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
};

const addReply = (currentUserId, conversationId, text) => {
  return dbService
    .updateAndReturn(
      "mails",
      { _id: ObjectId(conversationId) },
      {
        $push: {
          messages: {
            id: ObjectId(),
            date: Date.now(),
            text,
            author: currentUserId
          }
        },
        $set: {
          lastUpdate: Date.now()
        }
      }
    )
    .then(conversation => {
      console.log(conversation);
      return conversation;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
};

module.exports = {
  getAllUserMail,
  createConversation,
  deleteOneConversation,
  deleteOneMessage,
  addReply
};
