const uuidv4 = require("uuid/v4");
const moment = require("moment");
const dbService = require("../services/db.service");
const mailService = require("../services/mail.service");

const COLLECTION_NAME = "users";

const findOne = (req, res) => {
  const payload = req.params;
  return dbService
    .getOne(COLLECTION_NAME, payload)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log("ERROR => USER SERVICES FIND ONE", error);
      res.status(403).json({ error });
    });
};

const update = (req, res) => {
  const avatar = req.file ? req.file.filename : "";
  return dbService
    .update(
      COLLECTION_NAME,
      { pseudo: req.body.pseudo },
      {
        $set: {
          sex: req.body.sexe,
          birthDate: req.body.birthDate,
          city: req.body.city,
          pseudo: req.body.pseudo,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          avatar
        }
      }
    )
    .then(() => {
      console.log("success");
      res.status(200).json({ message: "Votre profil a été mis à jour" });
    })
    .catch(error => {
      console.log("USERS.ROUTE => update user profil ERROR", error);
      res.status(500).json({ error });
    });
};

const createResetUrl = (req, res) => {
  const userMail = req.params;

  dbService
    .getOne(COLLECTION_NAME, userMail)
    .then(result => {
      if (result) {
        const uuid = uuidv4();
        const resetLink = "http://localhost:3000/resetPassword/" + uuid;
        const expirationDate = moment().add(1, "days");

        dbService
          .update(
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
            mailService.sendMail(user, (error, mailSend) => {
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
        res.status(500).json({ message: "Adresse mail introuvable" });
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
    .update(
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
  findOne,
  update,
  createResetUrl,
  checkResetUrl,
  setNewPassword
};
