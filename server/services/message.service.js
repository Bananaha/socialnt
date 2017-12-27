"use strict";

const moment = require("moment");
const async = require("async");
const dbService = require("../services/db.service");
const ObjectId = require("mongodb").ObjectID;

const COLLECTION_NAME = "messages";

const save = (req, res) => {
  return dbService
    .getOne("users", { pseudo: req.body.autorPseudo })
    .then(user => {
      const autor = user._id;
      let status = "public";
      let dest = "none";

      dbService
        .create(COLLECTION_NAME, {
          date: moment().format("YYYY-MM-DD hh:MM"),
          content: req.body.message,
          attachment: req.body.attachment,
          autor: autor,
          dest: dest,
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
    })
    .catch(error => {
      console.log(error);
    });
};

const find = (req, res) => {
  console.log(req.params);
  return dbService
    .getOne("users", req.params)
    .then(user => {
      if (user) {
        console.log("USER FOUND", user);
        return dbService
          .getAll(COLLECTION_NAME, {
            $or: [{ autor: user._id }, { dest: user._id }]
          })
          .then(messages => {
            console.log("MESSAGES FOUND");
            async.each(messages, (message, msgcb) => {
              const autorId = message.autor.toString();
              const destId = message.dest.toString();
              const userId = user._id.toString();

              if (autorId === userId) {
                console.log(message.autor, " === ", user._id);
                console.log("message.autor === user._id");
                message.autor = user.pseudo;
                msgcb();
              } else if (autorId !== userId) {
                console.log(message.autor, " !== ", user._id);
                console.log("message.autor !== user._id");
                return dbService
                  .getAll("users", { _id: message.autor })
                  .then(autor => {
                    message.autor = autor.pseudo;
                    msgcb();
                  })
                  .catch(error => {
                    msgcb("autor not found", error);
                  });
              } else if (destId === userId) {
                console.log(destId, " === ", userId);
                console.log("destId === userId");
              } else if (destId !== userId) {
                console.log(destId, " !== ", userId);
                console.log("destId !== userId");
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

            res.status(200).json({ messages: messages });
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
