const mailService = require("../services/mail.service");
const dbService = require("./db.service");

const COLLECTION_NAME = "users";

const signIn = (userInformations, token) => {
  return new Promise((resolve, reject) => {
    userInformations.profile = "member";
    dbService
      .getOne(COLLECTION_NAME, { pseudo: userInformations.pseudo })
      .then(user => {
        if (user) {
          reject({ alert: "pseudonyme utilisé par un autre utilisateur" });
        } else {
          userInformations.avatar = "default_avatar.png";
          dbService
            .create(COLLECTION_NAME, userInformations)
            .then(result => {
              const user = result.ops[0];
              mailService.welcome(user);

              resolve({
                token: token,
                pseudo: user._id.toString(),
                alert: "Bravo, vous êtes maintenant inscrit sur Cumulus."
              });
            })
            .catch(error => {
              console.log(
                "ERROR => IN LOGIN SERVICE_SIGNIN USER NOT CREATE",
                error
              );
              reject({
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
        reject({
          alert:
            "Le processus d'inscription n'a pu aboutir. Contactez un administrateur"
        });
      });
  });
};

const logIn = (userInformations, token) => {
  return new Promise((resolve, reject) => {
    dbService
      .getOne(COLLECTION_NAME, { pseudo: userInformations.pseudo })
      .then(user => {
        if (user && userInformations.password === user.password) {
          resolve({
            token: token,
            id: user._id.toString()
          });
        }
        if (user && userInformations.password !== user.password) {
          reject({
            alert: "mauvais pseudo ou mot de passe/utilisateur introuvable"
          });
        }
        if (!user) {
          reject({ alert: "l'utilisateur n'existe pas." });
        }
      })
      .catch(error => {
        console.log("ici");
        console.log(
          "ERROR => IN LOGIN SERVICE_LOGIN CANNOT PROCEED IN USER PSEUDO SEARCH",
          error
        );
        reject({
          alert:
            "Impossible de se connecter pour le moment. Contactez un administrateur"
        });
      });
  });
};

module.exports = {
  signIn,
  logIn
};
