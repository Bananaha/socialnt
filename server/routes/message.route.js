const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const messageService = require("../services/message.service");
const socketService = require("../services/socket/socket.service");
const router = new Router();

const sendMessage = (req, res) => {
  messageService
    .save(req.body, req.__user)
    .then(() => {
      res
        .status(200)
        .json({ message: "Votre message a été posté avec succès." });
    })
    .catch(error => {
      console.error("ERROR => MESSAGE SERVICES save ", error);
      res
        .status(502)
        .json({ message: "Le message n'a pas pu être enregistré." });
    });
};

const countAllMessages = (req, res) => {
  return messageService
    .countMessages()
    .then(messages => {
      const nbUsers = socketService.nbConnectedUsers();

      res.status(200).json({ nbConnectedUsers: nbUsers, nbMessages: messages });
    })

    .catch(error => console.log(error));
};

router.route("/newMessage").post(permission("sendMessage"), sendMessage);
router.route("/deleteMessage").delete(messageService.suppress);
router.route("/:id/:page").get(messageService.find);
router.route("/").get(countAllMessages);

module.exports = router;
