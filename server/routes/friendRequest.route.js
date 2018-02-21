const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const friendRequestService = require("../services/friendRequest.service");

const router = new Router();

const requestFriendship = (req, res) => {
  friendRequestService
    .request(req.body.targetUser, req.__user)
    .then(result => {
      res.status(200).json({ friends: result });
    })
    .catch(error => {
      res.status(409).json({ error });
    });
};

const findFriendRequests = (req, res) => {
  friendRequestService
    .getAll(req.__user)
    .then(computedRequests => {
      res.status(200).json(computedRequests);
    })
    .catch(error => {
      res.status(409).json(error);
    });
};

const ignore = (req, res) => {
  friendRequestService
    .ignore(req.body.requestId)
    .then(requestUpdated => {
      res.status(200).end();
    })
    .catch(error => {
      res
        .status(503)
        .json({ alert: "Votre requête n'a pu aboutir. Réessayer plus tard." });
    });
};

const accept = (req, res) => {
  friendRequestService
    .accept(req.body.requestId)
    .then(requestUpdated => {
      res.status(200).end();
    })
    .catch(error => {
      res
        .status(503)
        .json({ alert: "Votre requête n'a pu aboutir. Réessayer plus tard." });
    });
};

router.route("/").post(permission("friendRequest"), requestFriendship);
router.route("/ignore").post(permission("answerRequest"), ignore);
router.route("/accept").post(permission("answerRequest"), accept);
router.route("/").get(permission("findFriendRequests"), findFriendRequests);

module.exports = router;
