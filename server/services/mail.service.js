const dbService = require("./db.service");
const ObjectId = require("mongodb").ObjectID;
const crypto = require("crypto");

const userService = require("./user.service");
const CONVERSATIONS_COUNT_PER_PAGE = 10;
const populateConversationsWithUsers = (conversations, users) => {
  const usersDictionnary = users.reduce((acc, user) => {
    acc[user._id.toString()] = {
      _id: user._id,
      pseudo: user.pseudo
    };
    return acc;
  }, {});

  return conversations.forEach(conversation => {
    conversation.recipients.map(recipient => {
      const recipientStringify = recipient.toString();

      if (
        recipientStringify ===
        usersDictionnary[recipientStringify]._id.toString()
      ) {
        console.log(usersDictionnary[recipientStringify]);
        return (recipient = usersDictionnary[recipientStringify]);
      }
    });
  });
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
      const users = conversations.map(conversation => conversation.recipients);
      const userLists = [].concat.apply([], users);
      return userService
        .find({
          _id: { $in: userLists }
        })
        .then(users => ({
          conversations: populateConversationsWithUsers(conversations, users),
          count
        }));
      // conversations.map(conversation => {
      //   conversation.messages = sortAsc(conversation.messages, "date");
      // });
    })
    .catch(error => {
      console.log(error);
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
    _id: crypto.randomBytes(16).toString("hex"),
    author: currentUserId,
    text: text,
    date: Date.now()
  };
};

const computedRecipientsList = (currentUserId, recipients) => {
  recipients.push(currentUserId);
  return recipients.map(recipient => (recipient = ObjectId(recipient)));
};

module.exports = { getAllUserMail, createConversation };
