const express = require("express");
const Router = express.Router;

const authentication = require("../services/token.service").authentication;
const messageService = require("../services/message.service");
const router = new Router();

router.route("/newMessage").post(authentication, messageService.save);
router.route("/deleteMessage").delete(authentication, messageService.suppress);
router.route("/:pseudo").get(authentication, messageService.find);

module.exports = router;
