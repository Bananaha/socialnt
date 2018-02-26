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

const resetPassword = user => {
  const mailOptions = {
    from: '"Claire" <claire.poyo@gmail.com>',
    to: user.email,
    subject: "Reinitialisation de votre mot de passe",
    text: `Pas de soucis, ça nous arrive d'oublier aussi. Bonjour ${
      user.pseudo
    } ,Vous avez récemment demandé de réinitialiser le mot de passe du compte Cumulus de : ${
      user.email
    }
      Pour mettre à jour votre mot de passe, cliquez sur le bouton ci-dessous. ${
        user.link
      } Modifier votre mot de passe A plus tard. :) Cumulus`,
    html: `<h1>Pas de soucis, ça nous arrive d'oublier aussi.</h1><p>Bonjour  ${
      user.pseudo
    },</p> <p>Vous avez récemment demandé de réinitialiser le mot de passe du compte Cumulus de :</p><p>${
      user.email
    }</p><p>Pour mettre à jour votre mot de passe, cliquez sur le bouton ci-dessous.</p><a href="${
      user.link
    }"><button>Modifier votre mot de passe</button></a><p>A plus tard. :)</p><p>Cumulus</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("TRANSPORTER MAIL ERROR RESET PASSWORD", error);
      return error;
    }
    console.log("Message sent: " + info.response);
    return info;
  });
};

const welcome = user => {
  console.log("in welcomeMail");
  const mailOptions = {
    from: '"Claire" <claire.poyo@gmail.com>',
    to: user.email,
    subject: "Bienvenue sur Cumulus",
    text: `Bienvenue ${
      user.pseudo
    }! Vous venez de vous inscrire sur Cumulus et nous vous en remercions. N'hésitez pas à partager vos meilleurs moments avec la communauté Cumulus. A plus tard. :) Cumulus Team`,
    html: `<h1>Bienvenue ${
      user.pseudo
    }!</h1><p>Vous venez de vous inscrire sur Cumulus et nous vous en remercions. N'hésitez pas à partager vos meilleurs moments avec la communauté Cumulus.</p><p>A plus tard. :)</p><p>Cumulus</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("TRANSPORTER MAIL ERROR > WELCOME", error);
      return error;
    }
    console.log("Message sent: " + info.response);
    return info;
  });
};

const friendRequest = user => {
  console.log("in friendRequest", user.email, user.pseudo);
  const mailOptions = {
    from: '"Claire" <claire.poyo@gmail.com>',
    to: user.email,
    subject: "Cumulus, un membre veut vous ajouter à ses amis",
    text: `Hello  ${
      user.pseudo
    }! Un membre Cumulus souhaite vous ajouter à ses amis. Rendez vous sur Cumulus pour répondre à sa demande. A plus tard. :) Cumulus Team`,
    html: `<h1>Hello  ${
      user.pseudo
    }!</h1><p>Un membre Cumulus souhaite vous ajouter à ses amis. Rendez vous sur Cumulus pour répondre à sa demande.</p><p> A plus tard. :) Cumulus Team</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("TRANSPORTER MAIL ERROR > FRIEND_REQUEST", error);
      return error;
    }
    console.log("Message sent: " + info.response);
    return info;
  });
};

module.exports = {
  resetPassword,
  welcome,
  friendRequest
};
