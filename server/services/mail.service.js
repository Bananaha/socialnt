const nodemailer = require("nodemailer");

const mailConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "z4wgthl5vniwji2x@ethereal.email",
    pass: "Cp6U5RwJb9nrRSVm9v"
  }
};

const transporter = nodemailer.createTransport(mailConfig);

// send mail with defined transport object

const sendMail = user => {
  console.log("in sendMail", user.link);
  const mailOptions = {
    from: '"Claire" <claire.poyo@gmail.com>',
    to: user.email,
    subject: "Reinitialisation de votre mot de passe",
    text:
      "Pas de soucis, ça nous arrive d'oublier aussi. Bonjour " +
      user.pseudo +
      ",Vous avez récemment demandé de réinitialiser le mot de passe du compte Cumulus de : " +
      user.email +
      "Pour mettre à jour votre mot de passe, cliquez sur le bouton ci-dessous. " +
      user.link +
      " Modifier votre mot de passe A plus tard. :) Cumulus",
    html:
      "<h1>Pas de soucis, ça nous arrive d'oublier aussi.</h1><p>Bonjour " +
      user.pseudo +
      ",</p> <p>Vous avez récemment demandé de réinitialiser le mot de passe du compte Cumulus de :</p><p>" +
      user.email +
      '</p><p>Pour mettre à jour votre mot de passe, cliquez sur le bouton ci-dessous.</p><a href="' +
      user.link +
      '"><button>Modifier votre mot de passe</button></a><p>A plus tard. :)</p><p>Cumulus</p>'
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });
};

module.exports = {
  sendMail: sendMail
};
