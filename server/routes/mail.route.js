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
      console.log(error);
      res.status(503).json({
        alert:
          "Nous ne sommes pas parvenue à récupérer vos messages. Réessayez plus tard"
      });
    });
};

const createConversation = (req, res) => {
  console.log(req.body);
  mailService
    .createConversation(req.__user, req.body.recipients, req.body.text)
    .then(conversation => {
      console.log("newconversation", conversation.ops[0]);
      return conversation.ops[0];
    })
    .catch(error => {
      console.log(error);
    });
};

router.route("/:page").get(permission("getMails"), getUserMails);
router
  .route("/newConversation")
  .post(permission("createNewConversation"), createConversation);

module.exports = router;
