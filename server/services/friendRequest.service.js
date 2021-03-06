"use strict";

const ObjectId = require("mongodb").ObjectID;
const async = require("async");

const socketService = require("./socket/socket.service");
const dbService = require("./db.service");
const emailService = require("./email.service");
const userService = require("../services/user.service");

const request = (targetUser, currentUser, requestRecipient) => {
  let requestAuthor = currentUser;
  if (requestRecipient) {
    requestAuthor = requestRecipient;
  }
  const othersCollections = [
    {
      collectionName: "friendRequests",
      collectionField: "recipient",
      collectionAlias: "requests"
    }
  ];
  const target = { _id: ObjectId(targetUser) };
  return dbService
    .aggregate("users", "_id", target, othersCollections)
    .then(user => {
      if (targetUser === requestRecipient) {
        Promise.reject({
          alert: "Vous ne pouvez pas recommander un utilisateur à lui même."
        });
      }

      if (user) {
        if (user.friends) {
          const areAlreadyFriends = user.friends.some(friend => {
            return friend === requestAuthor;
          });
          if (areAlreadyFriends) {
            return { alert: "Cet utilisateur fait déjà parti de vos amis." };
          }
        } else {
          const alreadyRequested = user[0].requests.some(request => {
            return request.author == requestAuthor.toString();
          });

          if (alreadyRequested) {
            return {
              alert:
                "Vous avez déjà envoyé une demande d'ajout à cet utilisateur."
            };
          } else {
            const requestPayload = {
              author: ObjectId(requestAuthor),
              recipient: ObjectId(targetUser),
              status: "pending",
              recommendedBy: null
            };
            let succesMessage = "Un membre veut vous ajouter à ses amis";
            if (requestRecipient) {
              requestPayload.recommendedBy = ObjectId(currentUser);
              succesMessage = "Un membre vous a recommandé un ami";
            }

            return dbService
              .create("friendRequests", requestPayload)
              .then(() => {
                socketService.emit(
                  "ON_FRIEND_REQUEST",
                  {
                    message: succesMessage
                  },
                  socket => {
                    return socket.user._id === targetUser;
                  }
                );

                emailService.friendRequest(user[0]);

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
    });
};

// get friendRequests and user invitations based on userId

const USER_KEYS = ["author", "recipient"];

const extractUsersFromRequests = requests => {
  return requests
    .reduce((users, request) => {
      USER_KEYS.forEach(key => {
        if (!request[key]) return;

        const id = request[key].toString();
        if (users.indexOf(id) === -1) {
          users.push(id);
        }
      });
      return users;
    }, [])
    .map(id => ObjectId(id));
};

const populateRequestsWithUsers = (requests, users) => {
  const usersDictionnary = users.reduce((acc, user) => {
    acc[user._id] = {
      _id: user._id,
      pseudo: user.pseudo
    };
    return acc;
  }, {});
  requests.forEach(request => {
    USER_KEYS.forEach(key => {
      if (request[key] && usersDictionnary[request[key]]) {
        request[key] = usersDictionnary[request[key]];
      }
    });
  });
  return requests;
};

const getAll = userId => {
  return dbService
    .getAll("friendRequests", {
      $or: [{ author: ObjectId(userId) }, { recipient: ObjectId(userId) }],
      status: "pending"
    })
    .then(requests => {
      const extractedUsers = extractUsersFromRequests(requests);

      return userService
        .find({
          _id: { $in: extractedUsers }
        })
        .then(users => ({
          requests: populateRequestsWithUsers(requests, users)
        }));
    });
};

const ignore = requestId => {
  return dbService
    .updateAndReturn(
      "friendRequests",
      { _id: ObjectId(requestId) },
      {
        $set: {
          status: "ignored"
        }
      }
    )
    .then(requestIgnored => {
      return;
    })
    .catch(error => {
      return error;
    });
};

const accept = requestId => {
  return dbService
    .updateAndReturn(
      "friendRequests",
      { _id: ObjectId(requestId) },
      {
        $set: {
          status: "accepted"
        }
      }
    )
    .then(requestAccepted => {
      const usersToUpdate = [
        requestAccepted.value.author,
        requestAccepted.value.recipient
      ];
      const updatePromises = [];
      usersToUpdate.forEach(userToUpdate => {
        const newFriend = usersToUpdate.find(
          user => user.toString() !== userToUpdate.toString()
        );

        const promise = new Promise((resolve, reject) => {
          return dbService
            .updateAndReturn(
              "users",
              { _id: userToUpdate },
              {
                $push: {
                  friends: newFriend
                }
              }
            )
            .then(result => {
              resolve();
            })
            .catch(error => {
              reject();
            });
        });
        updatePromises.push(promise);
      });

      return Promise.all(updatePromises)
        .then(() => {
          return;
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.error(error);
    });
};

const remove = (targetUser, currentUser) => {
  const usersToUpdate = [ObjectId(targetUser), currentUser];
  const removePromises = [];
  usersToUpdate.forEach(userToUpdate => {
    const userToRemove = usersToUpdate.find(
      user => user.toString() !== userToUpdate.toString()
    );

    const promise = new Promise((resolve, reject) => {
      return dbService
        .updateAndReturn(
          "users",
          { _id: userToUpdate },
          {
            $pull: {
              friends: userToRemove
            }
          }
        )
        .then(result => {
          resolve();
        })
        .catch(error => {
          reject();
        });
    });
    removePromises.push(promise);
  });

  return Promise.all(removePromises)
    .then(() => {
      return;
    })
    .catch(error => {
      return error;
    });
};

module.exports = { request, getAll, ignore, accept, remove };
