const emailService = require("./email.service");
const dbService = require("./db.service");
const tokenService = require("./token.service");
const socketService = require("./socket/socket.service");

const COLLECTION_NAME = "users";

const signIn = userInformations => {
  userInformations.profile = "member";
  userInformations.avatar = "der_oma.png";
  delete userInformations.emailConfirmation;
  return dbService
    .getOne(COLLECTION_NAME, { pseudo: userInformations.pseudo })
    .then(user => {
      if (user) {
        return Promise.reject({
          alert: "pseudonyme utilisé par un autre utilisateur"
        });
      }
      return dbService.create(COLLECTION_NAME, userInformations);
    })
    .then(result => {
      const user = result.ops[0];
      emailService.welcome(user);

      return {
        token: tokenService.signJwt({
          id: user._id.toString()
        }),
        id: user._id.toString(),
        pseudo: user._id.toString(),
        alert: "Bravo, vous êtes maintenant inscrit sur Unicorn's Corner."
      };
    });
};

const logIn = userInformations => {
  return dbService
    .getOne(COLLECTION_NAME, { pseudo: userInformations.pseudo })
    .then(user => {
      if (user && userInformations.password === user.password) {
        const token = tokenService.signJwt({
          id: user._id.toString()
        });

        return {
          token: token,
          id: user._id.toString()
        };
      }
      if (user && userInformations.password !== user.password) {
        return Promise.reject({
          alert: "Mauvais pseudo ou mot de passe/utilisateur introuvable"
        });
      }
      if (!user) {
        return Promise.reject({ alert: "L'utilisateur n'existe pas." });
      }
    });
};

module.exports = {
  signIn,
  logIn
};
