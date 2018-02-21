const ObjectId = require("mongodb").ObjectID;
const async = require("async");

const socketService = require("./socket/socket.service");
const dbService = require("./db.service");
const mailService = require("./mail.service");
const COLLECTION_NAME = "users";

const request = (targetUser, currentUser) => {
  const othersCollections = [
    {
      collectionName: "friendRequests",
      collectionField: "recipient",
      collectionAlias: "requests"
    }
  ];
  const target = { _id: ObjectId(targetUser) };
  return dbService
    .aggregate(COLLECTION_NAME, "_id", target, othersCollections)
    .then(user => {
      // if user exists check if

      if (user) {
        if (user.friends) {
          const areAlreadyFriends = user.friends.some(friend => {
            return friend === currentUser;
          });
          if (areAlreadyFriends) {
            return { alert: "Cet utilisateur fait déjà parti de vos amis." };
          }
        } else {
          const alreadyRequested = user[0].requests.some(request => {
            return request.author == currentUser.toString();
          });

          if (alreadyRequested) {
            return {
              alert:
                "Vous avez déjà envoyé une demande d'ajout à cet utilisateur."
            };
          } else {
            return dbService
              .create("friendRequests", {
                author: ObjectId(currentUser),
                recipient: ObjectId(targetUser),
                status: "pending"
              })
              .then(() => {
                socketService.emit(
                  "ON_FRIEND_REQUEST",
                  {
                    message: "Un membre veut vous ajouter à ses amis"
                  },
                  socket => {
                    return socket.user._id === targetUser;
                  }
                );

                mailService.friendRequest(user[0]);

                return { alert: "Votre demande d'ajout a bien été effectué" };
              })
              .catch(error => {
                return { alert: "Votre demande d'ajout n'a pu aboutir" };
              });
          }
        }
      } else {
        return { alert: "Utilisateur inconnu" };
      }
    })
    .catch(error => {
      console.log("request firendRequestService 2", error);
      // res.status(500).json({ alert: "Votre requête n'a pu aboutir." });
    });
};

// get friendRequests
// parscours friendRequests, lister les users (author + recipient)
// -> tableau d'ids de users
// getUsers $in tableau de users

const getAll = currentUser => {
  return dbService
    .getAll(
      "friendRequests",
      {
        $or: [
          { author: ObjectId(currentUser) },
          { recipient: ObjectId(currentUser) }
        ],
        status: "pending"
      },
      0
    )
    .then(friendRequests => {
      if (!friendRequests || friendRequests.length === 0) {
        return;
      }
      return dbService
        .getOne("users", { _id: ObjectId(currentUser) })
        .then(currentUserData => {
          const promisesRequests = [];

          friendRequests.forEach((friendRequest, index) => {
            const request = new Promise((resolve, reject) => {
              const author = friendRequest.author.toString();
              const recipient = friendRequest.recipient.toString();

              if (author !== currentUserData._id.toString()) {
                return dbService
                  .getOne("users", { _id: ObjectId(author) })
                  .then(user => {
                    friendRequest.authorPseudo = user.pseudo;
                    friendRequest.recipientPseudo = currentUserData.pseudo;

                    resolve(friendRequest);
                  })
                  .catch(error => {
                    reject(error);
                  });
              } else {
                return dbService
                  .getOne("users", { _id: ObjectId(recipient) })
                  .then(user => {
                    friendRequest.recipientPseudo = user.pseudo;
                    friendRequest.authorPseudo = currentUserData.pseudo;

                    resolve(friendRequest);
                  })
                  .catch(error => {
                    reject(error);
                  });
              }
            });

            promisesRequests.push(request);
          });

          return Promise.all(promisesRequests)
            .then(computedFriendRequests => {
              return computedFriendRequests;
            })
            .catch(error => {
              return error;
            });
        })

        .catch(error => {
          return error;
        });
    })
    .catch(error => {
      console.log("[ERROR] getAll FriendRequest error", error);
      return { alert: "Votre demande d'ajout n'a pu aboutir" };
    });
};

module.exports = { request, getAll };
