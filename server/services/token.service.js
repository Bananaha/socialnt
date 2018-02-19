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
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) {
        resolve({
          profile: "visitor"
        });
      } else {
        clientId = decoded.id;
        dbService
          .getOne("users", { _id: ObjectId(clientId) })
          .then(user => {
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
  checkProfil,
  verifyToken,
  signJwt
};
