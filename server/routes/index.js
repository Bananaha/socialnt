const express = require("express");
const Router = express.Router;

const login = require("./login.route");
const users = require("./users.route");
const post = require("./post.route");
const friendRequest = require("./friendRequest.route");
const chat = require("./chat.route");

const routes = new Router();

routes.use("/users", users);
routes.use("/login", login);
routes.use("/post", post);
routes.use("/friendRequest", friendRequest);
routes.use("/chat", chat);

module.exports = routes;
