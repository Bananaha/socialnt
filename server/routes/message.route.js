const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const messageService = require("../services/message.service");
const router = new Router();

router
  .route("/newMessage")
  .post(permission("sendMessage"), messageService.save);
router.route("/deleteMessage").delete(messageService.suppress);
router.route("/:id/:page").get(messageService.find);

module.exports = router;
