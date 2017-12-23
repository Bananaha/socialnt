const express = require('express');
const Router = express.Router;


const loginService = require('../services/login.service');
const userService = require('../services/user.service');
const authentication = require('../services/token.service').authentication;

var upload = require('../services/uploadFile.service')

var router = new Router();


router.route('/:pseudo').get(authentication, userService.findOne);
router.route('/editProfil').post(authentication, upload.single('file'), userService.update);

router.route('/reset').post(userService.createResetUrl);
router.route('/reset/:token').get(userService.checkResetUrl);




module.exports = router;
