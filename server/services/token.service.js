var jwt = require('jsonwebtoken');

var secret = 'hushHush';
var tokenDelay = { expiresIn: '1 days' };

var authentication = (req, res, next) => {
  var token = req.headers['X-CSRF-Token'];
  if (token) {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.__token = decoded;
        next();
      }
    });
  } else {
    token = jwt.sign(
      {
        data: req.body.pseudo
      },
      secret,
      tokenDelay
    );
    req.__token = token;
    next();
  }
};

module.exports = {
  authentication
};
