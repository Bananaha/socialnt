const jwt = require("jsonwebtoken");
const dbService = require("../services/db.service");

const secret = "hushHush";
const tokenDelay = { expiresIn: "1 days" };

const authentication = (req, res, next) => {
  const clientToken = req.headers["x-csrf-token"];
  console.log(clientToken);
  if (clientToken !== "null") {
    jwt.verify(clientToken, secret, (error, decoded) => {
      console.log("TOKEN IS VERIFY");
      if (error) {
        console.log("ERROR IN VERIFY");
        res.redirect("/login");
      } else {
        console.log("TOKEN VERIFICATION SUCCECCFULL");
        req.__token = clientToken;
        console.log("req.__token", req.__token);
        req.__user = decoded.data;
        next();
      }
    });
  } else {
    console.log("NO TOKEN FOUND");
    dbService
      .getOne("users", { pseudo: req.body.pseudo })
      .then(user => {
        userId = user._id.toString();
        token = jwt.sign(
          {
            data: userId
          },
          secret,
          tokenDelay
        );
        req.__token = token;
        console.log(req.__token);
        req.__user = userId;
        next();
      })
      .catch(error => {
        console.log(error);
        return res.redirect("/login");
      });
  }
};

module.exports = {
  authentication
};
