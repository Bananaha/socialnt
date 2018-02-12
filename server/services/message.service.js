"use strict";

const moment = require("moment");
const async = require("async");
const _ = require("lodash");

const dbService = require("./db.service");
const socketService = require("./socket/socket.service");
const ObjectId = require("mongodb").ObjectID;

moment.locale("fr");

// EX ICI
// const broadcastRefreshStats = () => {
//   countMessages().then(result => {
//     socketService.emit("REFRESH_STATS", { result });
//   });
// };

const save = (body, userId) => {
  const autor = userId;
  let status = "public";

  return dbService
    .create("messages", {
      date: new Date(),
      content: body.message,
      attachment: body.attachment,
      autor: autor,
      status: status
    })
    .then(result => {
      countMessages()
        .then(messagesCounts => {
          socketService.emit("ON_MESSAGE_PUBLISH", { messagesCounts });
        })
        .catch(error => {
          console.error("Error while counting messages", error);
        });
    });
};

const find = (req, res) => {
  console.log(req.params);
  const PER_PAGE = 10;
  let page;
  if (req.params.page === "undefined") {
    page = 1;
  } else {
    page = req.params.page;
  }
  return dbService
    .getOne("users", { _id: ObjectId(req.params.id) })
    .then(user => {
      if (user) {
        return dbService
          .findAndCount(
            "messages",
            {
              $or: [{ autor: user._id }, { dest: user._id }]
            },
            { date: -1 },
            PER_PAGE * page - PER_PAGE,
            PER_PAGE
          )
          .then(results => {
            const messages = results[0];
            const nbMessages = results[1];
            async.each(messages, (message, msgcb) => {
              const autorId = message.autor.toString();
              const userId = user._id.toString();
              let destId;
              if (message.dest) {
                destId = message.dest.toString();
              }
              message.date = moment(message.date).format("LLLL");
              if (autorId === userId) {
                message.autor = user.pseudo;
                msgcb();
              } else if (autorId !== userId) {
                return dbService
                  .getAll("users", { _id: message.autor })
                  .then(autor => {
                    message.autor = autor.pseudo;
                    msgcb();
                  })
                  .catch(error => {
                    msgcb("autor not found", error);
                  });
              } else if (destId && destId === userId) {
                message.dest = user.pseudo;
                msgcb();
              } else if (destId && destId !== userId) {
                return dbService
                  .getAll("users", { _id: message.dest })
                  .then(dest => {
                    message.dest = dest.pseudo;
                    msgcb();
                  })
                  .catch(error => {
                    msgcb("dest not found", error);
                  });
                msgcb("error: messages non attribué à" + req.params.pseudo);
              }
            }),
              error => {
                if (error) {
                  console.log("finish with error");
                  res.status(500).json({ alert: error });
                } else {
                  console.log("finish w/o error");
                }
              };
            const sortedMessages = _.orderBy(messages, ["date"], ["desc"]);
            res
              .status(200)
              .json({ messages: messages, nbMessages: nbMessages });
          })
          .catch(error => {
            console.log("message not found", error);
            res.status(500).json({ alert: "no message" });
          });
      }
    })
    .catch(error => {
      console.log("USER NOT FOUND", error);
      res.status(500).json({ alert: "no user" });
    });
};

const suppress = (req, res) => {
  console.log(req);
};

const countMessages = () => {
  console.log("countMessage");
  return dbService
    .count("messages", {}, 0)
    .then(nbMessages => {
      console.log("COUNTMESSAGE OK", nbMessages);
      return nbMessages;
    })
    .catch(error => {
      console.log("COUNTMESSAGE CATCH", error);
    });
};

module.exports = {
  save,
  find,
  suppress,
  countMessages
};
