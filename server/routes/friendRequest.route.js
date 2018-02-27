const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const friendRequestService = require("../services/friendRequest.service");

const router = new Router();

const requestFriendship = (req, res) => {
  friendRequestService
    .request(req.body.targetUser, req.__user)
    .then(result => res.status(200).json({ friends: result }))
    .catch(error => {
      res.status(409).json({ error });
    });
};
const recommendFriend = (req, res) => {
  friendRequestService
    .request(req.body.targetUser, req.__user, req.body.requestRecipient)
    .then(result => res.status(200).json({ friends: result }))
    .catch(error => {
      res.status(409).json({ error });
    });
};

const findFriendRequests = (req, res) => {
  friendRequestService
    .getAll(req.__user)
    .then(computedRequests => res.status(200).json(computedRequests))
    .catch(error => res.status(409).json(error));
};

const ignore = (req, res) => {
  friendRequestService
    .ignore(req.body.requestId)
    .then(requestUpdated => res.status(200).json({ alert: "success" }))
    .catch(error => res.status(503).json(error));
};

const accept = (req, res) => {
  friendRequestService
    .accept(req.body.requestId)
    .then(requestUpdated => res.status(200).json({ alert: "succes" }))
    .catch(error => res.status(503).json(error));
};

const removeFriend = (req, res) => {
  friendRequestService
    .remove(req.body.targetUser, req.__user)
    .then(() => res.status(200).json({ alert: "succes" }))
    .catch(error => res.status(503).json(error));
};

router.route("/").post(permission("canFriendRequest"), requestFriendship);
router.route("/ignore").post(permission("canAnswerRequest"), ignore);
router.route("/accept").post(permission("canAnswerRequest"), accept);
router.route("/").get(permission("canFindFriendRequests"), findFriendRequests);
router.route("/remove").post(permission("canRemoveFriend"), removeFriend);
router
  .route("/recommendation")
  .post(permission("canRecommendFriend"), recommendFriend);

module.exports = router;
