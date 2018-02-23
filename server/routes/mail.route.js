const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const mailService = require("../services/mail.service");

const router = new Router();

const getUserMails = (req, res) => {
  mailService
    .getAllUserMail(req.__user)
    .then(mails => {
      res.status(200).json(mails);
    })
    .catch(error => {
      res.status(503).end();
    });
};

router.get("/", permission("getMails"), getUserMails);

module.exports = { router };
