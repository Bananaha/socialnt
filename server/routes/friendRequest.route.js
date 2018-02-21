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
      res.status(200).json({ requests: computedRequests });
    })
    .catch(error => {
      res.status(409).json(error);
    });
};

const ignoreRequest = (req, res) => {};
const acceptRequest = (req, res) => {};

router.route("/").post(permission("friendRequest"), requestFriendship);
router.route("/ignore").post(permission("answerRequest"), ignoreRequest);
router.route("/accept").post(permission("answerRequest"), acceptRequest);
router.route("/").get(permission("findFriendRequests"), findFriendRequests);

module.exports = router;
