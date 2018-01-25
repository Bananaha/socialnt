const express = require("express");
const Router = express.Router;

const loginService = require("../services/login.service");
const passwordService = require("../services/password.service");
const userService = require("../services/user.service");
const permission = require("../services/permission.service")
  .permissionDispatcher;

const upload = require("../services/uploadFile.service");

const router = new Router();

router
  .route("/:targetUser")
  .get(permission("viewProfil"), userService.findById);
router
  .route("/editProfil")
  .post(permission("editProfil"), upload.single("file"), userService.update);
router.route("/search/:value").get(permission("search"), userService.findMany);

router.route("/reset/:token").get(passwordService.checkResetUrl);
router.route("/reset").post(passwordService.createResetUrl);
router.route("/newPassword").post(passwordService.setNewPassword);

module.exports = router;
