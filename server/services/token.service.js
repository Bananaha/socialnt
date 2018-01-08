const jwt = require("jsonwebtoken");
const dbService = require("../services/db.service");
const ObjectId = require("mongodb").ObjectID;

const SECRET = "hushHush";
const TOKEN_DELAY = { expiresIn: "1 days" };

const authentication = (req, res, next) => {
  console.log("authenticate");
  const clientToken = req.headers["x-csrf-token"];
  if (clientToken !== "undefined") {
    jwt.verify(clientToken, SECRET, (error, decoded) => {
      if (error) {
        console.log("error", error);
        if (req.body.pseudo) {
          dbService
            .getOne("users", { pseudo: req.body.pseudo })
            .then(user => {
              userId = user._id.toString();
              token = jwt.sign(
                {
                  data: userId
                },
                SECRET,
                TOKEN_DELAY
              );
              req.__token = token;
              req.__user = userId;
              console.log("USER", req.__user, userId);

              next();
            })
            .catch(error => {
              console.log(error);
              return res.redirect("/login");
            });
        } else {
          res.redirect("/login");
        }
      } else {
        req.__token = clientToken;
        req.__user = decoded.data;
        console.log("USER", req.__user);
        next();
      }
    });
  } else {
    if (req.body.pseudo) {
      dbService
        .getOne("users", { pseudo: req.body.pseudo })
        .then(user => {
          userId = user._id.toString();
          token = jwt.sign(
            {
              data: userId
            },
            SECRET,
            TOKEN_DELAY
          );
          req.__token = token;
          req.__user = userId;
          console.log("USER", req.__user, userId);

          next();
        })
        .catch(error => {
          console.log(error);
          return res.redirect("/login");
        });
    } else {
      res.redirect("/login");
    }
  }
};

const checkProfil = (req, res, next) => {
  console.log("checkToken");
  const clientToken = req.headers["x-csrf-token"];

  if (clientToken !== "undefined") {
    jwt.verify(clientToken, SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
        req.__profil = "visitor";
        next();
      } else {
        clientId = decoded.data;
        console.log(clientId);
        dbService
          .getOne("users", { _id: ObjectId(clientId) })
          .then(user => {
            console.log();
            if (user) {
              req.__profil = user.profil;
              req.__user = user._id;
              next();
            } else {
              req.__profil = "visitor";
              next();
            }
          })
          .catch(error => {
            console.log(
              "ERROR IN CHECK TOKEN, TOKEN FOUND BUT ENABLE TO REQUEST INFORMATION IN DB IN ORDER TO SET PROFIL",
              error
            );
            res.status(500);
          });
      }
    });
  } else {
    req.__profil = "visitor";
    next();
  }
};

module.exports = {
  authentication,
  checkProfil
};
