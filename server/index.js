const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const checkProfil = require("./services/token.service").checkProfil;
require("dotenv").config();

const routes = require("./routes");

const dbService = require("./services/db.service");

const app = express();

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(
    cors({
      origin: process.env.CORS_ORIGINS,
      allowHeader: ["Content-Type"]
    })
  )
  .use(checkProfil, routes)
  .use("/images", express.static(__dirname + "/images"));

const server = app.listen(5000);
const io = require("socket.io")(server);
const socketServer = require("./services/socket/socket.service").onConnection(
  io
);

io.set("origins", process.env.CORS_ORIGINS);

dbService.connect((error, db) => {
  if (error) {
    console.log("impossible de se connecter à la base de donnée", error);
  } else {
    console.log("connecté à la base de donnée mongo");
  }
});
