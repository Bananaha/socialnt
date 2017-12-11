const dbService = require('../services/db.service');
const uploadFile = require('../services/uploadFile.service');

const collectionName = 'users';

const findOne = (req, res) => {
  var payload = req.params;
  return dbService
    .getOne(collectionName, payload)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log('ERROR => USER SERVICES FIND ONE', error);
      return error;
    });
};

const updateUserProfil = (req, res) => {
  console.log(req.body);
  return dbService
    .update(
      collectionName,
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
          photo: req.body.photo
        }
      }
    )
    .then(() => {
      uploadFile.upload();
      console.log('success');
      res.status(200);
    })
    .catch(error => {
      console.log('USERS.ROUTE => update user profil ERROR', error);
      res.status(500).send(error);
    });
};

module.exports = {
  findOne,
  updateUserProfil
};
