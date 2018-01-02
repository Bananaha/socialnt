const dbService = require("./db.service");
const ObjectId = require("mongodb").ObjectID;

const permission = profiles => {
  return (req, res, next) => {
    if (req.__user) {
      return dbService
        .getOne("users", { _id: ObjectId(req.__user) })
        .then(user => {
          if (user) {
            let permissionGranted = false;

            if (Array.isArray(profiles)) {
              for (let i = 0, ln = profiles.length; i < ln; i++) {
                if (user.profil === profiles[i]) {
                  permissionGranted = true;
                  break;
                }
              }
            } else {
              if (profiles === user.profil) {
                permissionGranted = true;
              }
            }

            if (permissionGranted) {
              next();
            } else {
              res.status(403).json({
                alert: "Vous n'êtes pas autorisé à consulter ce contenu"
              });
            }
          }
        })
        .catch(error => {
          res.status(500).json({ alert: "L'utilisateur est introuvable" });
        });
    } else {
      res.status(403).json({
        alert:
          "Vous n'êtes pas autorisé à consulter ce contenu, veuillez vous connecter"
      });
    }
  };
};

module.exports = {
  permission
};
