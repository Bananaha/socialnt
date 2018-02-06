const ObjectId = require("mongodb").ObjectID;

const dbService = require("../services/db.service");
const COLLECTION_NAME = "users";

const request = (req, res) => {
  const targetUser = req.body.targetUser;
  console.log(targetUser);
  // check if the user exists
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
            return friend === req.__user;
          });
          if (areAlreadyFriends) {
            return res
              .status(409)
              .json({ alert: "Cet utilisateur fait déjà parti de vos amis." });
          }
        } else {
          const alreadyRequested = user[0].requests.some(request => {
            return request.author == req.__user.toString();
          });

          if (alreadyRequested) {
            return res.status(409).json({
              alert:
                "Vous avez déjà envoyé une demande d'ajout à cet utilisateur."
            });
          } else {
            return dbService
              .create("friendRequests", {
                author: req.__user,
                recipient: ObjectId(targetUser),
                status: "pending"
              })
              .then(() => {
                res
                  .status(200)
                  .json({ alert: "Votre demande d'ajout a bien été effectué" });
              })
              .catch(error => {
                res
                  .status(404)
                  .json({ alert: "Votre demande d'ajout n'a pu aboutir" });
              });
          }
        }
      } else {
        res.status(404).json({ alert: "Utilisateur inconnu" });
      }
    })
    .catch(error => {
      console.log(error);
      // res.status(500).json({ alert: "Votre requête n'a pu aboutir." });
    });
};

module.exports = { request };
