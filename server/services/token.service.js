const jwt = require("jsonwebtoken");
const dbService = require("./db.service");
const ObjectId = require("mongodb").ObjectID;
const path = require("path");

const SECRET = process.env.JWT_SECRET;

const signJwt = data => jwt.sign(data, SECRET, { expiresIn: "1 days" });

const verifyJwt = (token, onSuccess, onError) =>
  jwt.verify(token, SECRET, (error, decoded) => {
    if (error) {
      return onError(error);
    }
    onSuccess(decoded);
  });

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
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
        resolve({
          profile: "visitor"
        });
      } else {
        console.log("not error");
        clientId = decoded.data;
        console.log(clientId, typeof clientId);
        dbService
          .getOne("users", { _id: ObjectId(clientId) })
          .then(user => {
            console.log("USER in verify User", user);
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
  verifyToken,
  signJwt
};
