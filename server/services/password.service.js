const uuidv4 = require("uuid/v4");
const moment = require("moment");
const dbService = require("./db.service");
const emailService = require("./email.service");

const COLLECTION_NAME = "users";

const createResetUrl = (req, res) => {
  const userMail = req.params;

  dbService
    .getOne(COLLECTION_NAME, userMail)
    .then(result => {
      if (result) {
        const uuid = uuidv4();
        const resetLink = `${process.env.SERVER_URL}/resetPassword/${uuid}`;
        const expirationDate = moment().add(1, "days");

        dbService
          .updateAndReturn(
            COLLECTION_NAME,
            { pseudo: result.pseudo },
            {
              $set: {
                resetPasswordLink: resetLink,
                resetPasswordLinkExpirationDate: expirationDate
              }
            }
          )
          .then(() => {
            const user = {
              pseudo: result.pseudo,
              email: result.email,
              link: resetLink
            };
            emailService.resetPassword(user, (error, mailSend) => {
              if (error) {
                res.status(500).json({
                  message:
                    "Le mail de réinitialisation de mot de passe n'a pas pu être envoyé."
                });
              }
            });
            res.status(200).json({ message: "mail send" });
          })
          .catch(error => {
            console.log(
              "userService => ERROR IN createResetUrl > update ====" + error
            );
            res.status(500).json({
              message:
                "La requête n'a pu aboutir, vous allez être redirigé vers la page de login"
            });
          });
      } else {
        res.status(500).json({ message: "Adresse mail inconnue" });
      }
    })
    .catch(error => {
      console.log(
        "userService => ERROR IN createResetUrl > getOne====" + error
      );
      res.status(500).json({
        message:
          "La requête n'a pu aboutir, vous allez être redirigé vers la page de login"
      });
    });
};

const checkResetUrl = (req, res) => {
  const token = decodeURIComponent(req.params.token);
  dbService
    .getOne(COLLECTION_NAME, { resetPasswordLink: token })
    .then(result => {
      if (result) {
        const expirationDate = moment(result.resetPasswordLinkExpirationDate);
        const dateDiff = expirationDate.diff(moment());
        if (dateDiff > 0) {
          console.log(
            "userService => SUCCESS IN checkResetUrl ==== ResetLink valid"
          );
          res.status(200);
        } else {
          console.log(
            "userService => SUCCESS IN checkResetUrl ==== ResetLink invalid"
          );
          res.status(500).json({ message: "Votre lien n'est plus valide" });
        }
      } else {
        res.status(500).json({
          message:
            "Votre lien n'est plus valide, vous allez être redirigé vers la page de login"
        });
      }
    })
    .catch(error => {
      console.log("userService => ERROR IN checkResetUrl ====" + error);
      res.status(500).json({
        message:
          "La requête n'a pu aboutir, vous allez être redirigé vers la page de login"
      });
    });
};

const setNewPassword = (req, res) => {
  dbService
    .updateAndReturn(
      COLLECTION_NAME,
      { resetPasswordLink: decodeURIComponent(req.body.url) },
      {
        $set: {
          password: req.body.password,
          resetPasswordLink: "",
          resetPasswordLinkExpirationDate: ""
        }
      }
    )
    .then(() => {
      console.log(
        "userService => SUCCESS IN setNewPassword ==== user password update"
      );
      res.status(200).json({
        message:
          "Votre mot de passe a été mis à jour, vous allez être redirigé vers la page de login"
      });
    })
    .catch(error => {
      console.log("userService => ERROR IN setNewPassword ====" + error);
      res.status(500).json({
        message:
          "La requête n'a pu aboutir, vous allez être redirigé vers la page de login"
      });
    });
};

module.exports = {
  createResetUrl,
  checkResetUrl,
  setNewPassword
};
