const dbService = require("../services/db.service");
const COLLECTION_NAME = "users";
const request = (req, res) => {
  const targetUser = req.body.targetUser;
  console.log(targetUser);

  return dbService
    .getOne(COLLECTION_NAME, { pseudo: targetUser })
    .then(user => {
      if (user) {
        console.log(user);
        const targetUserId = user._id;
        const areAlreadyFriends = user.friends.some(friend => {
          return friend === req.__user;
        });
        if (areAlreadyFriends) {
          res
            .send(409)
            .json({ alert: "Cet utilisateur fait déjà parti de vos amis." });
        } else {
          return dbService
            .create("friendRequests", {
              author: req.__user,
              recipient: targetUserId
            })
            .then(() => {
              res
                .status(200)
                .json({ alert: "Votre demande d'ajout a bien été effectué" })
                .catch(error => {
                  console.log(error);
                  res
                    .status(404)
                    .json({ alert: "Votre demande d'ajout n'a pu aboutir" });
                });
            });
        }
      } else {
        res.status(404).json({ alert: "Utilisateur introuvable" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ alert: "Votre requête n'a pu aboutir." });
    });
};
