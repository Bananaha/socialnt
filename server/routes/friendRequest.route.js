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
    .then(friendRequests => {
      res.status(200).json(friendRequests);
    })
    .catch(error => {
      res.status(409).json(error);
    });
};

router.route("/").post(permission("friendRequest"), requestFriendship);
router.route("/").get(permission("findFriendRequests"), findFriendRequests);

module.exports = router;
