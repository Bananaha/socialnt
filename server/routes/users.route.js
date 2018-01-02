const express = require("express");
const Router = express.Router;

const loginService = require("../services/login.service");
const passwordService = require("../services/password.service");
const userService = require("../services/user.service");
const authentication = require("../services/token.service").authentication;
const permission = require("../services/permission.service.js").permission;

const upload = require("../services/uploadFile.service");

const router = new Router();

router
  .route("/:pseudo")
  .get(authentication, permission(["admin", "member"]), userService.findOne);
router
  .route("/editProfil")
  .post(
    authentication,
    permission(["admin", "member"]),
    upload.single("file"),
    userService.update
  );

router.route("/reset/:token").get(passwordService.checkResetUrl);
router.route("/reset").post(passwordService.createResetUrl);
router.route("/newPassword").post(passwordService.setNewPassword);

module.exports = router;
