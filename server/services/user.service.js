"use strict";

const uuidv4 = require("uuid/v4");
const moment = require("moment");
const async = require("async");

const dbService = require("./db.service");
const emailService = require("../services/mail.service");
const ObjectId = require("mongodb").ObjectID;

const COLLECTION_NAME = "users";

const findById = id => {
  return dbService.getOne(COLLECTION_NAME, { _id: ObjectId(id) });
};

const findByIdWithFriends = id => {
  const othersCollections = [
    {
      collectionName: "users",
      collectionField: "friends",
      collectionAlias: "friends"
    }
  ];

  return dbService
    .aggregate(COLLECTION_NAME, "_id", { _id: id }, othersCollections)
    .then(users => users[0]);
};

const searchFriends = (targetUser, currentUser) => {
  console.log(targetUser, currentUser);
  if (!targetUser) {
    return Promise.reject();
  }

  const query = new RegExp(targetUser, "i");

  return dbService
    .getAll(
      COLLECTION_NAME,
      {
        $or: [{ firstName: query }, { lastName: query }, { pseudo: query }],
        friends: { $in: [currentUser] }
      },
      5
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
    .then(users => {
      if (users) {
        const currentUserId = req.__user.toString();
        users.forEach(user => {
          if (user.friends) {
            user.isFriend = user.friends.some(
              userId => userId.toString() === currentUserId
            );
          }
        });
        res.status(200).json(users);
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
    .updateAndReturn(
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

const find = filters => dbService.getAll(COLLECTION_NAME, filters || {});

module.exports = {
  find,
  findById,
  findByIdWithFriends,
  update,
  findMany,
  searchFriends,
  getFriends,
  deleteProfil,
  deleteAllProfils
};
