const uuidv4 = require("uuid/v4");

const mailService = require("../services/mail.service");
const authentication = require("../services/token.service");
const dbService = require("./db.service");

const COLLECTION_NAME = "users";

const signIn = (req, res) => {
  const userInformations = req.body;
  userInformations.profile = "member";
  dbService
    .getOne(COLLECTION_NAME, { pseudo: userInformations.pseudo })
    .then(user => {
      if (user) {
        res
          .status(403)
          .json({ alert: "pseudonyme utilisé par un autre utilisateur" });
      } else {
        userInformations.avatar = "default_avatar.png";
        dbService
          .create(COLLECTION_NAME, userInformations)
          .then(result => {
            const user = result.ops[0];
            mailService.welcome(user);

            res.status(200).json({
              token: req.__token,
              pseudo: user._id.toString(),
              alert: "Bravo, vous êtes maintenant inscrit sur Cumulus."
            });
          })
          .catch(error => {
            console.log(
              "ERROR => IN LOGIN SERVICE_SIGNIN USER NOT CREATE",
              error
            );
            res.status(500).json({
              alert:
                "Le processus d'inscription n'a pu aboutir. Contactez un administrateur"
            });
          });
      }
    })
    .catch(error => {
      console.log(
        "ERROR => IN LOGIN SERVICE_SIGNIN CANNOT PROCEED IN USER PSEUDO SEARCH",
        error
      );
      res.status(500).json({
        alert:
          "Le processus d'inscription n'a pu aboutir. Contactez un administrateur"
      });
    });
};

const logIn = (req, res) => {
  const userInformations = req.body;
  dbService
    .getOne(COLLECTION_NAME, { pseudo: userInformations.pseudo })
    .then(user => {
      if (user && userInformations.password === user.password) {
        res.status(200).json({
          token: req.__token,
          id: user._id.toString()
        });
      }
      if (user && userInformations.password !== user.password) {
        res.status(403).json({
          alert: "mauvais pseudo ou mot de passe/utilisateur introuvable"
        });
      }
      if (!user) {
        res.status(404).json({ alert: "l'utilisateur n'existe pas." });
      }
    })
    .catch(error => {
      console.log(
        "ERROR => IN LOGIN SERVICE_LOGIN CANNOT PROCEED IN USER PSEUDO SEARCH",
        error
      );
      res.status(500).json({
        alert:
          "Impossible de se connecter pour le moment. Contactez un administrateur"
      });
    });
};

module.exports = {
  signIn,
  logIn
};
