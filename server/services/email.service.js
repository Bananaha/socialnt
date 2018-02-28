const nodemailer = require("nodemailer");
const dbService = require("./db.service");

const ObjectId = require("mongodb").ObjectID;
const LINK = `${process.env.SERVER_URL}/`;

const mailConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "z4wgthl5vniwji2x@ethereal.email",
    pass: "Cp6U5RwJb9nrRSVm9v"
  }
};

const gifDictionnaire = {
  welcome: "https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/giphy.gif",
  thumbUp: "https://media.giphy.com/media/l41lUjUgLLwWrz20w/giphy.gif"
};

const transporter = nodemailer.createTransport(mailConfig);

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
    html: `<div>
      <div>
        <h1>Pas de soucis, ça nous arrive d'oublier aussi.</h1>
        <p>Bonjour  ${user.pseudo},</p>
        <p>Vous avez récemment demandé à réinitialiser le mot de passe du compte Cumulus de :</p>
        <p>${user.email}</p>
        <p>Pour mettre à jour votre mot de passe, cliquez sur le bouton ci-dessous.</p>
        <a href="${user.link}">
          <button>Modifier votre mot de passe</button>
        </a>
      </div>
      <div>
        <p>A plus tard. :)</p>
        <p>Cumulus</p>
      </div>
    </div>`
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
  const mailOptions = {
    from: '"Claire" <claire.poyo@gmail.com>',
    to: user.email,
    subject: "Bienvenue sur Cumulus &#2728",
    text: `Bienvenue ${
      user.pseudo
    }! Vous venez de vous inscrire sur Cumulus et nous vous en remercions. N'hésitez pas à partager vos meilleurs moments avec la communauté Cumulus. A plus tard. :) Cumulus Team`,
    html: `<div>
      <div>
        <img src=${
          gifDictionnaire.welcome
        } width="100" height="100" alt="GIF with a hard G" border="0">
      </div>
      <div>
        <h1>Bienvenue ${user.pseudo}!</h1>
        <p>Vous venez de vous inscrire sur Cumulus et c'est super !. N'hésitez pas à partager vos meilleurs moments avec la communauté Cumulus.</p>
      </div>
      <div>
        <p>A plus tard. :)</p><p>Cumulus</p>
      </div>
    </div>`
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
  const mailOptions = {
    from: '"Claire" <claire.poyo@gmail.com>',
    to: user.email,
    subject: "Cumulus, un membre veut vous ajouter à ses amis",
    text: `Hello  ${
      user.pseudo
    }! Un membre Cumulus souhaite vous ajouter à ses amis. Rendez vous sur Cumulus pour répondre à sa demande. A plus tard. :) Cumulus Team`,
    html: `<div>
      <div>
        <h1>Hello ${user.pseudo}!</h1>
        <p>Un membre Cumulus souhaite vous ajouter à ses amis.</p>
        <a href=${LINK}>
          <button>Jeter un oeil</button>
        </a>
      </div>
      <div>
        <p> A plus tard. :) Cumulus Team</p>
      </div>
    </div>`
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

const postNotification = id => {
  const userId = typeof id === "string" ? id : id.toString();
  return dbService
    .getOne("users", { _id: ObjectId(id) })
    .then(user => {
      const mailOptions = {
        from: '"Claire" <claire.poyo@gmail.com>',
        to: user.email,
        subject: "Cumulus | Nouveau post",
        text: `Hello  ${
          user.pseudo
        }! Un membre vient de publier un message sur votre profil. :) Cumulus Team`,
        html: `<div>
          <div>
            <h1>Hello ${user.pseudo}!</h1>
            <p>Un membre vient de publier un message sur votre profil.</p>
            <a href=${LINK}>
              <button>Jeter un oeil</button>
            </a>
          </div>
          <div>
            <p> A plus tard. :) Cumulus Team</p>
            <img src=${
              gifDictionnaire.thumbUp
            } width="100" height="100" alt="ThumbUp" border="0">
          </div>
        </div>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("TRANSPORTER MAIL ERROR > FRIEND_REQUEST", error);
          return error;
        }
        console.log("Message sent: " + info.response);
        return info;
      });
    })
    .catch(error => `Error in postNotification from emailService : ${error}`);
};

const recommendationNotification = id => {
  const userId = typeof id === "string" ? id : id.toString();
  return dbService
    .getOne("users", { _id: ObjectId(id) })
    .then(user => {
      const mailOptions = {
        from: '"Claire" <claire.poyo@gmail.com>',
        to: user.email,
        subject: "Cumulus | Recommandation d'ami",
        text: `Hello  ${
          user.pseudo
        }! Un membre vient de vous recommander un ami. A plus tard. :) Cumulus Team`,
        html: `<div>
            <div>
              <h1>Hello ${user.pseudo}!</h1>
              <p>Un membre vient de vous recommander un ami.</p>
              <a href=${LINK}>
                <button>Jeter un oeil</button>
              </a>
            </div>
            <div>
              <p> A plus tard. :) Cumulus Team</p>
            </div>
          </div>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("TRANSPORTER MAIL ERROR > FRIEND_REQUEST", error);
          return error;
        }
        console.log("Message sent: " + info.response);
        return info;
      });
    })
    .catch(error => `Error in postNotification from emailService : ${error}`);
};

module.exports = {
  resetPassword,
  welcome,
  friendRequest,
  postNotification
};
