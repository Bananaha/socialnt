"use strict";

const uuidv4 = require("uuid/v4");
const moment = require("moment");
const async = require("async");

const dbService = require("./db.service");
const mailService = require("../services/mail.service");
const ObjectId = require("mongodb").ObjectID;

const COLLECTION_NAME = "users";

const findById = id => {
  return dbService.getOne(COLLECTION_NAME, { _id: ObjectId(id) });
};

const findFriends = (targetUser, currentUser) => {
  console.log(targetUser, currentUser);
  if (!targetUser) {
    return Promise.reject();
  }

  const query = new RegExp(targetUser, "i");

  return dbService
    .getAll(
      COLLECTION_NAME,
      {
        $or: [{ firstName: query }, { lastName: query }, { seudo: query }],
        friends: { $in: [currentUser] }
      },
      10
    )
    .then(friends => {
      console.log(friends);
      return friends;
    })
    .catch(error => {
      console.error("findFriends userService", error);
    });
};

const findMany = (req, res) => {
  const queries = req.params.values;
  return dbService
    .getAll(COLLECTION_NAME, { $text: { $search: queries } }, 5)
    .then(results => {
      if (results) {
        console.log(results);
        res.status(200).json(results);
      } else {
        res.status(404);
      }
    })
    .catch(error => {
      console.log("SEARCH ERROR", error);
      res.status(500).json({ alert: error });
    });
};

const findProfil = (req, res) => {
  const payload = req.params;
  return dbService
    .getOne(COLLECTION_NAME, { _id: ObjectId(req.__user) })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log("ERROR => USER SERVICES FIND ONE", error);
      res.status(403).json({ error });
    });
};

const update = (req, res) => {
  const avatar = req.file ? req.file.filename : "";
  return dbService
    .update(
      COLLECTION_NAME,
      { pseudo: req.body.pseudo },
      {
        $set: {
          sex: req.body.sexe,
          birthDate: req.body.birthDate,
          city: req.body.city,
          pseudo: req.body.pseudo,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          avatar
        }
      }
    )
    .then(() => {
      console.log("success");
      res.status(200).json({ message: "Votre profil a été mis à jour" });
    })
    .catch(error => {
      console.log("USERS.ROUTE => update user profile ERROR", error);
      res.status(500).json({ error });
    });
};

const getFriends = () => {
  console.log("getFriends");
};

const deleteProfil = id => {
  return dbService
    .deleteOne(COLLECTION_NAME, id)
    .then(result => console.log("delete profil___userService", result))
    .catch(error => console.log("delete profil error", error));
};

const deleteAllProfils = id => {
  return dbService
    .deleteMany(COLLECTION_NAME)
    .then(result => console.log("delete all profils", result))
    .catch(error => console.log("delete all profils", error));
};

const create = newUser =>
  dbService.create(
    COLLECTION_NAME,
    Object.assign(newUser, {
      profile: "member",
      avatar: "default_avatar.png"
    })
  );

module.exports = {
  findById,
  update,
  findMany,
  findFriends,
  getFriends,
  deleteProfil,
  deleteAllProfils
};
