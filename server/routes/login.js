const express = require('express');
const router = express.Router();
const login = require('../services/login.service');

router.post('/', (req, res) => {
  console.log(req.body);
  const userInformations = req.body;
  const token = login.authentication(userInformations.pseudo);

  res.status(200).send({ token: token, pseudo: userInformations.pseudo });
});

module.exports = router;
