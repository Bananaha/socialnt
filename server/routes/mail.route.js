const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const mailService = require("../services/mail.service");

const router = new Router();

const getUserMails = (req, res) => {
  mailService
    .getAllUserMail(req.__user, req.params.page)
    .then(mails => {
      res.status(200).json({
        conversations: mails.conversations,
        count: mails.count
      });
    })
    .catch(error => {
      res.status(503).json({
        alert:
          "Nous ne sommes pas parvenue à récupérer vos messages. Réessayez plus tard"
      });
    });
};

const createConversation = (req, res) => {
  mailService
    .createConversation(req.__user, req.body.recipients, req.body.text)
    .then(conversation => {
      res.status(200).json(conversation.ops[0]);
    })
    .catch(error => {
      res.status(404).end();
    });
};

const deleteOneConversation = (req, res) => {
  mailService
    .deleteOneConversation(req.body.conversationId, req.body.ownerId)
    .then(result => {
      res.status(200).json({ alert: "success" });
    })
    .catch(error => {
      res.status(404).end();
    });
};

const deleteOneMessage = (req, res) => {
  console.log(req.body);
  mailService
    .deleteOneMessage(req.body.messageId, req.body.conversationId)
    .then(() => {
      res.status(200).json({ alert: "success" });
    })
    .catch(error => {
      res.status(404).json({ alert: error });
    });
};

const addReply = (req, res) => {
  mailService
    .addReply(req.__user, req.body.conversationId, req.body.text)
    .then(() => {
      res.status(200).json({ alert: "success" });
    })
    .catch(error => {
      res.status(404).end();
    });
};

router
  .route("/newConversation")
  .post(permission("canCreateNewConversation"), createConversation);
router.route("/newReply").post(permission("canReplyToConversation"), addReply);
router
  .route("/deleteOneMessage")
  .post(permission("canDeleteOneMessage"), deleteOneMessage);
router
  .route("/deleteOneConversation")
  .post(permission("canDeleteOneConversation"), deleteOneConversation);
router.route("/:page").get(permission("canGetMails"), getUserMails);

module.exports = router;
