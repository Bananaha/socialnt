var dbService = require('../services/db.service');

var signIn = (req, res) => {
  var userInformations = req.body;

  return dbService
    .create('users', userInformations)
    .then(() => {
      console.log('create');
      res
        .status(200)
        .json({ token: req.__token, pseudo: userInformations.pseudo });
    })
    .catch(error => {
      console.log('erreur dans la création dun nouvel utilisateur', error);
    });
};

var logIn = (req, res) => {
  var userInformations = req.body;
  users.findOne(userInformations);
  res.status(200).json({ token: req.__token, pseudo: userInformations.pseudo });
};

module.exports = {
  signIn,
  logIn
};
