const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const chatService = require("../services/chat.service");

const router = new Router();

const getOneConversation = (req, res) => {
  chatService
    .getOrCreateByUsers(req.params.friendId, req.__user)
    .then(conversation => {
      console.log(conversation);
      res.status(200).json(conversation);
    })
    .catch(error => {
      console.log("getOneConversation chatRoute", error);
    });
};
router.route("/:friendId").get(getOneConversation);

module.exports = router;
