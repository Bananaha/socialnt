"use strict";

const uuidv4 = require("uuid/v4");
const moment = require("moment");
const async = require("async");

const dbService = require("./db.service");
const emailService = require("./email.service");
const ObjectId = require("mongodb").ObjectID;

const COLLECTION_NAME = "users";

const findMany = (values, currentUser) => {
  if (!values) {
    return Promise.reject();
  }
  let query;
  if (values) {
    query = new RegExp(values, "i");
  } else {
    query = "";
  }

  return dbService
    .getAll(
      COLLECTION_NAME,
      {
        $or: [{ firstName: query }, { lastName: query }, { pseudo: query }]
      },
      5
    )
    .then(users => {
      if (users) {
        return dbService
          .getAll("friendRequests", { author: currentUser })
          .then(friendRequests => {
            const currentUserId = currentUser.toString();

            users.forEach(user => {
              if (friendRequests && friendRequests.length > 0) {
                user.isInvited = friendRequests.some(
                  request =>
                    request.recipient.toString() === user._id.toString()
                );
              } else {
                user.isInvited = false;
              }

              if (user.friends) {
                user.isFriend = user.friends.some(
                  userId => userId.toString() === currentUserId
                );
              } else {
                user.isFriend = false;
              }
            });

            return users;
          })
          .catch(error => error);
      } else {
        return;
      }
    })
    .catch(error => {
      return { alert: error };
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
      res.status(403).json({ error });
    });
};

const update = (req, res) => {
  const updatePayload = req.body;
  const avatar = req.file
    ? (updatePayload.avatar = req.file.filename)
    : delete updatePayload.avatar;

  return dbService
    .updateAndReturn(
      COLLECTION_NAME,
      { pseudo: req.body.pseudo },
      {
        $set: updatePayload
      }
    )
    .then(() => {
      res.status(200).json({ message: "Votre profil a été mis à jour" });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

const deleteProfil = id => {
  return dbService
    .deleteOne(COLLECTION_NAME, { _id: ObjectId(id) })
    .then(result => {
      return dbService
        .deleteMany("friendRequests", {
          $or: [{ author: ObjectId(id) }, { recipient: ObjectId(id) }]
        })
        .then(result => {
          return dbService
            .updateMany("users", {}, { $pull: { friends: ObjectId(id) } })
            .then(() => {
              return "ok";
            })
            .catch(error => error);
        })
        .catch(error => error);
    })
    .catch(error => error);
};

const deleteAllProfils = () => {
  return dbService
    .deleteMany(COLLECTION_NAME, { profile: { $ne: "admin" } })
    .then(() => {
      dbService
        .find("users", {})
        .then(users => {
          users.map(user => {
            user = user._id.String();
          });
          dbService
            .deleteMany("friendRequests", {
              $or: [
                { author: { $nin: [users] } },
                { recipient: { $nin: [users] } }
              ]
            })
            .then(() => {
              dbService
                .updateMany(
                  "users",
                  {},
                  { $pull: { friends: { $nin: [users] } } }
                )
                .then(() => {
                  return "ok";
                })
                .catch(error => error);
            })
            .catch(error => error);
        })
        .catch(error => error);
    });
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
    .aggregate(COLLECTION_NAME, "_id", { _id: ObjectId(id) }, othersCollections)
    .then(users => {
      if (users.length === 0) {
        return;
      }
      return users[0];
    });
};

const searchFriends = (targetUser, currentUser) => {
  if (!targetUser) {
    return Promise.reject();
  }
  let query;
  if (targetUser) {
    query = new RegExp(targetUser, "i");
  } else {
    query = "";
  }

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
      return friends;
    })
    .catch(error => error);
};

module.exports = {
  find,
  findById,
  findByIdWithFriends,
  update,
  findMany,
  searchFriends,
  deleteProfil,
  deleteAllProfils
};
