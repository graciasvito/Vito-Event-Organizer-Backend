const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
// const gmail = require("../config/gmail");
require("dotenv").config();

const sendMail = (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const fileTemplate = fs.readFileSync(
    `src/templates/email/${data.template}`,
    "utf8"
  );

  const mailOptions = {
    from: '"Event Organizing" <vitoristo1@gmail.com>',
    to: data.to,
    subject: data.subject,
    html: mustache.render(fileTemplate, { ...data }),
  };
  transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
