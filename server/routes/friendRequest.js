const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const friendRequestService = require("../services/friendRequest.service");

const router = new Router();

router
  .route("/")
  .post(permission("friendRequest"), friendRequestService.request);
