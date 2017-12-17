const uuidv4 = require('uuid/v4')


const dbService = require('../services/db.service');
const collection = 'users';

const signIn = (req, res) => {
  const userInformations = req.body;
  userInformations.id = uuidv4();

  dbService
    .getOne(collection, { pseudo: userInformations.pseudo })
    .then(user => {
      console.log(user);
      if (user) {
        res
          .status(403)
          .json({ message: 'pseudonyme utilisé par un autre utilisateur' });
      } else {
        dbService
          .create(collection, userInformations)
          .then(() => {
            res
              .status(200)
              .json({ token: req.__token, pseudo: userInformations.pseudo });
          })
          .catch(error => {
            console.log('ERROR => IN LOGIN SERVICE_SIGNIN USER NOT CREATE', error);
            res.status(500).json({ error: error });
          });
      }
    })
    .catch(error => {
      console.log('ERROR => IN LOGIN SERVICE_SIGNIN CANNOT PROCEED IN USER PSEUDO SEARCH', error);
      res.status(500).json({ error: error });
    });
};

const logIn = (req, res) => {
  const userInformations = req.body;
  dbService
    .getOne(collection, userInformations)
    .then(user => {
      if (user && userInformations.password === user.password) {
        res
          .status(200)
          .json({ token: req.__token, pseudo: userInformations.pseudo });
      }
      if (user && userInformations.password !== user.password) {
        res
          .status(403)
          .json({ error: 'mauvais pseudo ou mot de passe/utilisateur introuvable' })
      }
      if (!user) {
        res.status(404).json({ error: 'l\'utilisateur n\'existe pas.' })
      }
    })
    .catch(error => {
      console.log('ERROR => IN LOGIN SERVICE_LOGIN CANNOT PROCEED IN USER PSEUDO SEARCH', error)
      res.status(500).json({ error: error });
    });
};

module.exports = {
  signIn,
  logIn
};
