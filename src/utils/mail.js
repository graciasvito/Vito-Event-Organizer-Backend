const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
const gmail = require("../config/gmail");

module.exports = {
  sendMail: async (data) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        type: "OAuth2",
        user: "vitoristo1@gmail.com",
        clientId: gmail.clientId,
        clientSecret: gmail.clientSecret,
        refreshToken: gmail.refreshToken,
        accessToken: gmail.accessToken,
      },
    });

    const fileTemplate = fs.readFileSync(
      `src/templates/email/${data.template}`,
      "utf8"
    );

    const mailOptions = {
      from: '"Event Organizing" <arkawebdev1@gmail.com>',
      to: data.to,
      subject: data.subject,
      html: mustache.render(fileTemplate, { ...data }),
    };

    await transporter.sendMail(mailOptions);
  },
};
