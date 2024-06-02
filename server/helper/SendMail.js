const nodemailer = require("nodemailer");

const sendMail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    service: "Gmail",
    auth: {
      user: "leaveease.info@gmail.com",
      pass: "ivokdaxqactvrmey",
    },
  });

  const message = {
    from: "CÔNG TY  LEAVEEASE",
    to: email,
    subject: subject,
    html: html,
  };
  const result = await transporter.sendMail(message);
  return result;
};

module.exports = sendMail;
