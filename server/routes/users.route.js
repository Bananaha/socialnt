const express = require('express');
const Router = express.Router;

const loginService = require('../services/login.service');
const userService = require('../services/user.service');
const authentication = require('../services/token.service').authentication;

const router = new Router();

router.route('/:pseudo').get(authentication, userService.findOne);
router.route('/editProfil').post(authentication, userService.updateUserProfil);

module.exports = router;
