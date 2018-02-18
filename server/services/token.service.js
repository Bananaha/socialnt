const jwt = require("jsonwebtoken");
const dbService = require("./db.service");
const ObjectId = require("mongodb").ObjectID;
const path = require("path");
const CONSTANTS = require("../CONSTANTS").token;
console.log("CONSTANTs", CONSTANTS.SECRET);
const authentication = (req, res, next) => {
  console.log("authentication");
  return dbService
    .getOne("users", { pseudo: req.body.pseudo })
    .then(user => {
      if (!user) {
        res.status(403).json({ response: "utilisateur introuvable" });
        return;
      }
      const clientToken = req.headers["x-csrf-token"];
      if (clientToken) {
        jwt.verify(clientToken, CONSTANTS.SECRET, (error, decoded) => {
          if (error || decoded.data != user._id.toString()) {
            const token = jwt.sign(
              {
                data: user._id.toString()
              },
              CONSTANTS.SECRET,
              CONSTANTS.TOKEN_DELAY
            );
            req.__token = token;
            req.__user = user._id;
            next();
          } else {
            req.__token = clientToken;
            req.__user = decoded.data;
            next();
          }
        });
      } else {
        const token = jwt.sign(
          {
            data: user._id
          },
          CONSTANTS.SECRET,
          CONSTANTS.TOKEN_DELAY
        );
        req.__token = token;
        req.__user = user._id;

        next();
      }
    })
    .catch(error => {
      console.error(error);
      res.status(403).redirect(path.join("/"));
      return;
    });
};

const checkProfil = (req, res, next) => {
  console.log("checkToken");
  const clientToken = req.headers["x-csrf-token"];
  if (clientToken) {
    verifyToken(clientToken)
      .then(result => {
        req.__profile = result.profile;
        req.__user = result.user;
        next();
      })
      .catch(() => {
        req.__profile = "visitor";
        next();
      });
  } else {
    req.__profile = "visitor";
    next();
  }
};

const verifyToken = token => {
  console.log("verifyToken token", token);
  return new Promise((resolve, reject) => {
    jwt.verify(token, CONSTANTS.SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
        resolve({
          profile: "visitor"
        });
      } else {
        clientId = decoded.data;
        dbService
          .getOne("users", { _id: ObjectId(clientId) })
          .then(user => {
            console.log("USER", user);
            if (user) {
              resolve({
                profile: user.profile,
                user: user._id
              });
            } else {
              resolve({
                profile: "visitor"
              });
            }
          })
          .catch(error => {
            console.log(
              "ERROR IN CHECK TOKEN, TOKEN FOUND BUT ENABLE TO REQUEST INFORMATION IN DB IN ORDER TO SET PROFIL",
              error
            );
            reject(error);
          });
      }
    });
  });
};

module.exports = {
  authentication,
  checkProfil,
  verifyToken
};
