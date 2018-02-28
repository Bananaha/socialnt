require("dotenv").config();
const nodemailer = require("nodemailer");

const mailConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.PORT,
  tls: {
    rejectUnauthorized: false
  }
};

const { SMTP_AUTH_PASS, SMTP_AUTH_USER } = process.env;
if (SMTP_AUTH_PASS && SMTP_AUTH_USER) {
  mailConfig.auth = {
    user: SMTP_AUTH_USER,
    pass: SMTP_AUTH_PASS
  };
}

const transporter = nodemailer.createTransport(mailConfig);

const user = {
  email: "poxaes@gmail.com",
  pseudo: "pseudo",
  link: "link"
};

const mailOptions = {
  from: '"Claire" <claire.poyo@gmail.com>',
  to: user.email,
  subject: "Reinitialisation de votre mot de passe",
  text: `Pas de soucis, ça nous arrive d'oublier aussi. Bonjour ${
    user.pseudo
  } ,Vous avez récemment demandé de réinitialiser le mot de passe du compte Unicorn's Corner de : ${
    user.email
  }
          Pour mettre à jour votre mot de passe, cliquez sur le bouton ci-dessous. ${
            user.link
          } Modifier votre mot de passe A plus tard. :) Unicorn's Corner`,
  html: `<div style="margin: 20px; padding: 20px; font-size:16px;">
        <div style="background-color: #6900CD; color: white;padding: 20px; font-size:16px;">
            <h1>Pas de soucis, ça nous arrive d'oublier aussi.</h1>
            <p>Bonjour  ${user.pseudo},</p>
            <p>Vous avez récemment demandé à réinitialiser le mot de passe du compte Unicorn's Corner de :</p>
            <p>${user.email}</p>
            <p>Pour mettre à jour votre mot de passe, cliquez sur le bouton ci-dessous.</p>
            <a href="${user.link}">
              <button>Modifier votre mot de passe</button>
            </a>
          </div>
          <div>
            <p>A plus tard. :)</p>
            <p>Unicorn's Corner</p>
          </div>
        </div>`
};
console.log("SEND MAIL");
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("TRANSPORTER MAIL ERROR RESET PASSWORD", error);
    return error;
  }
  console.log("Message sent: " + info.response);
  return info;
});
