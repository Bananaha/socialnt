"use strict";

const moment = require("moment");
const async = require("async");
const _ = require("lodash");

const dbService = require("../services/db.service");
const ObjectId = require("mongodb").ObjectID;

moment.locale("fr");
const COLLECTION_NAME = "messages";

const save = (req, res) => {
  return dbService
    .getOne("users", { _id: ObjectId(req.__user) })
    .then(user => {
      if (user) {
        console.log(user);
        const autor = user._id;
        let status = "public";

        dbService
          .create(COLLECTION_NAME, {
            date: new Date(),
            content: req.body.message,
            attachment: req.body.attachment,
            autor: autor,
            status: status
          })
          .then(result => {
            res
              .status(200)
              .json({ message: "Votre message a été posté avec succès." });
          })
          .catch(error => {
            console.log("ERROR => MESSAGE SERVICES save ", error);
            res
              .status(500)
              .json({ message: "Le message n'a pas pu être enregistré." });
          });
      } else {
        console.log("ERROR => MESSAGE SERVICES save ");
        res
          .status(500)
          .json({ message: "Le message n'a pas pu être enregistré." });
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const find = (req, res) => {
  console.log("findMessage", req.params);
  const PER_PAGE = 10;
  const page = req.params.page || 1;
  return dbService
    .getOne("users", { _id: ObjectId(req.params.id) })
    .then(user => {
      if (user) {
        return dbService
          .findAndCount(
            COLLECTION_NAME,
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
            console.log("messages", messages);
            console.log("nbMessages", nbMessages);
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

module.exports = {
  save,
  find,
  suppress
};
