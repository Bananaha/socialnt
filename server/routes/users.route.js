const express = require("express");
const Router = express.Router;

const loginService = require("../services/login.service");
const userService = require("../services/user.service");
const authentication = require("../services/token.service").authentication;

const upload = require("../services/uploadFile.service");

const router = new Router();

router.route("/:pseudo").get(authentication, userService.findOne);
router
  .route("/editProfil")
  .post(authentication, upload.single("file"), userService.update);

router.route("/reset/:token").get(userService.checkResetUrl);
router.route("/reset").post(userService.createResetUrl);
router.route("/newPassword").post(userService.setNewPassword);

module.exports = router;
