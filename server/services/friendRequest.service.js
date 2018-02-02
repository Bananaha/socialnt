const ObjectId = require("mongodb").ObjectID;

const dbService = require("../services/db.service");
const COLLECTION_NAME = "users";

const request = (req, res) => {
  const targetUser = req.body.targetUser;
  console.log(targetUser);
  // check if the user exists
  return dbService
    .getOne(COLLECTION_NAME, { _id: ObjectId(targetUser) })
    .then(user => {
      // if user exists check if
      if (user) {
        return dbService.getOne("");
        console.log(user);
        const targetUserId = user._id;
        if (user.friends) {
          const areAlreadyFriends = user.friends.some(friend => {
            return friend === req.__user;
          });
        }
        if (areAlreadyFriends) {
          res
            .send(409)
            .json({ alert: "Cet utilisateur fait déjà parti de vos amis." });
        } else {
          return dbService
            .create("friendRequests", {
              author: req.__user,
              recipient: targetUserId,
              status: "pending"
            })
            .then(() => {
              res
                .status(200)
                .json({ alert: "Votre demande d'ajout a bien été effectué" });
            })
            .catch(error => {
              console.log(error);
              res
                .status(404)
                .json({ alert: "Votre demande d'ajout n'a pu aboutir" });
            });
        }
      } else {
        res.status(404).json({ alert: "Utilisateur inconnu" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ alert: "Votre requête n'a pu aboutir." });
    });
};

module.exports = { request };
