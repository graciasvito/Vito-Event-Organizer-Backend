const nodemailer = require("nodemailer");
const mustache = require("mustache");
const fs = require("fs");
const path = require("path");
const gmail = require("../config/gmail");

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "vitoristo1@gmail.com",
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
          accessToken: gmail.accessToken,
        },
      });

      const filePath = path.join(
        __dirname,
        `../templates/email/${data.template}`
      );
      const fileTemplate = fs.readFileSync(filePath, "utf8");

      // const fileTemplate = fs.readFileSync(
      //   `src/templates/email/${data.template}`,
      //   "utf8"
      // );

      const mailOptions = {
        from: '"Event Organizing" <arkawebdev1@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }),
};

// const nodemailer = require("nodemailer");
// const mustache = require("mustache");
// const fs = require("fs");
// const path = require("path");

// const accessToken = require("../config/gmail");

// require("dotenv").config();

// const sendMail = async (data) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     secure: true,
//     port: 465,
//     auth: {
//       type: "OAuth2",
//       user: "vitoristo1@gmail.com",
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//       accessToken,
//     },
//   });

//   const filePath = path.join(
//     __dirname,
//     `../../src/templates/email/${data.template}`
//   );

//   const fileTemplate = fs.readFileSync(filePath, "utf8");

//   const mailOptions = {
//     from: '"Event Organizing" <arkawebdev1@gmail.com>',
//     to: data.to,
//     subject: data.subject,
//     html: mustache.render(fileTemplate, { ...data }),
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = { sendMail };
