const express = require('express');
const Router = express.Router;

const login = require('./login.route');
const users = require('./users.route');

const routes = new Router();

routes.use('/users', users);
routes.use('/login', login);

module.exports = routes;
