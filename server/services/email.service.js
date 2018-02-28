const nodemailer = require("nodemailer");
const dbService = require("./db.service");

const ObjectId = require("mongodb").ObjectID;
const LINK = `${process.env.SERVER_URL}/`;

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
    subject: "Bienvenue sur Unicorn's Corner &#2728",
    text: `Bienvenue ${
      user.pseudo
    }! Vous venez de vous inscrire sur Unicorn's Corner et nous vous en remercions. N'hésitez pas à partager vos meilleurs moments avec la communauté Unicorn's Corner. A plus tard. :) Unicorn's Corner Team`,
    html: `<div style="margin: 20px; padding: 20px; font-size:16px;">
        
    <div style="background-color: #6900CD; color: white;padding: 20px; font-size:16px;">
      <h1 style="font-weight: bold;font-size:20px;">Bienvenue ${
        user.pseudo
      }!</h1>
      <p>Vous venez de vous inscrire sur Unicorn's Corner et c'est super !. N'hésitez pas à partager vos meilleurs moments avec la communauté Unicorn's Corner.</p>
    </div>
    <div style="color: #6900CD; font-weight: bold;padding: 20px; font-size:16px;">
      <p>A plus tard. :)</p><p>Unicorn's Corner</p>
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
    subject: "Unicorn's Corner, un membre veut vous ajouter à ses amis",
    text: `Hello  ${
      user.pseudo
    }! Un membre Unicorn's Corner souhaite vous ajouter à ses amis. Rendez vous sur Unicorn's Corner pour répondre à sa demande. A plus tard. :) Unicorn's Corner Team`,
    html: `<div style="margin: 20px; padding: 20px; font-size:16px;">
    <div style="background-color: #6900CD; color: white;padding: 20px; font-size:16px;">
    <h1 style="font-weight: bold;font-size:20px;">Hello ${user.pseudo}!</h1>
        <p>Un membre Unicorn's Corner souhaite vous ajouter à ses amis.</p>
        <a href=${LINK}>
          <button>Jeter un oeil</button>
        </a>
      </div>
      <div style="color: #6900CD; font-weight: bold;padding: 20px; font-size:16px;">
        <p> A plus tard. :) Unicorn's Corner Team</p>
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
        subject: "Unicorn's Corner | Nouveau post",
        text: `Hello  ${
          user.pseudo
        }! Un membre vient de publier un message sur votre profil. :) Unicorn's Corner Team`,
        html: `<div style="margin: 20px; padding: 20px; font-size:16px;">
        <div style="background-color: #6900CD; color: white;padding: 20px; font-size:16px;">
        <h1 style="font-weight: bold;font-size:20px;">Hello ${user.pseudo}!</h1>
            <p>Un membre vient de publier un message sur votre profil.</p>
            <a href=${LINK}>
              <button>Jeter un oeil</button>
            </a>
          </div>
          <div style="color: #6900CD; font-weight: bold;padding: 20px; font-size:16px;">
            <p> A plus tard. :) Unicorn's Corner Team</p>
            
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
        subject: "Unicorn's Corner | Recommandation d'ami",
        text: `Hello  ${
          user.pseudo
        }! Un membre vient de vous recommander un ami. A plus tard. :) Unicorn's Corner Team`,
        html: `<div style="margin: 20px; padding: 20px; font-size:16px;">
        <div style="background-color: #6900CD; color: white;padding: 20px; font-size:16px;">
        <h1 style="font-weight: bold;font-size:20px;">Hello ${user.pseudo}!</h1>
              <p>Un membre vient de vous recommander un ami.</p>
              <a href=${LINK}>
                <button>Jeter un oeil</button>
              </a>
            </div>
            <div style="color: #6900CD; font-weight: bold;padding: 20px; font-size:16px;">
              <p> A plus tard. :) Unicorn's Corner Team</p>
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
