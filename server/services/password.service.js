const moment = require("moment");
const uuidv4 = require("uuid/v4");

const createResetUrl = () => {
  console.log("coucou");
  const resetUrl = uuidv4();
  console.log(resetUrl);
  return resetUrl;
};

module.exports = createResetUrl;
