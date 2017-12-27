const express = require("express");
const Router = express.Router;

const login = require("./login.route");
const users = require("./users.route");
const message = require("./message.route");

const routes = new Router();

routes.use("/users", users);
routes.use("/login", login);
routes.use("/message", message);

module.exports = routes;
