const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const checkProfil = require("./services/token.service").checkProfil;
require("dotenv").config();

const routes = require("./routes");

const dbService = require("./services/db.service");

const URL = "mongodb://localhost:27017/socialNetwork";
const app = express();

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5000"],
      allowHeader: ["Content-Type"]
    })
  )
  .use(checkProfil, routes)
  .use("/images", express.static(__dirname + "/images"));

const server = app.listen(5000);
const io = require("socket.io")(server);
const socketServer = require("./services/socket/socket.service")(io);

io.set("origins", "http://localhost:3000");

dbService.connect(URL, (error, db) => {
  if (error) {
    console.log("impossible de se connecter à la base de donnée", error);
  } else {
    console.log("connecté à la base de donnée mongo");
  }
});
