require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const checkProfil = require("./services/token.service").checkProfil;
const compression = require("compression");
const routes = require("./routes");
const html5middleware = require("./html5middleware");
const dbService = require("./services/db.service");

const app = express();

app.use(html5middleware);
app.use(express.static("static/"));
app.use(compression());
app.use("/static", express.static("static/"));
app.use("/images", express.static(__dirname + "/images"));

app.use(
  "/api",
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  cors({
    origin:
      process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.length
        ? process.env.CORS_ORIGINS
        : undefined,
    allowHeader: ["Content-Type"]
  }),
  checkProfil,
  routes
);

const server = app.listen(process.env.SERVER_PORT);
const io = require("socket.io")(server);
const socketServer = require("./services/socket/socket.service").onConnection(
  io
);

dbService.connect((error, db) => {
  if (error) {
    console.log("impossible de se connecter à la base de donnée", error);
  } else {
    console.log("connecté à la base de donnée mongo");
  }
});
