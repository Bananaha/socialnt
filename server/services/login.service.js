const jwt = require('jsonwebtoken');

const authentication = payload => {
  const token = jwt.sign(
    {
      data: payload
    },
    'secret',
    { expiresIn: '1 days' }
  );
  return JSON.stringify(token);
};

module.exports = {
  authentication
};
