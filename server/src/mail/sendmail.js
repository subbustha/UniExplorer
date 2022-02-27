//Module to send email for password reset
const fileName = "sendmail.js";
const log = require("../services/logger");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetVerificationCode = async (email, code) => {
  const methodName = "sendResetVerificationCode";
  const message = {
    to: email,
    from: "np01cp4a190391@islingtoncollege.edu.np",
    subject: "Password Reset Request",
    text: `Hello, Your Password Reset Code is: ${code}`,
  };
  try {
    console.log(process.env.SENDGRID_API_KEY);
    await sgMail.send(message);
  } catch (error) {
    log.error(fileName, methodName, error);
  }
};

const sendCreateAccountVerificationCode = async (email, code) => {
  const methodName = "sendCreateAccountVerificationCode";
  const message = {
    to: "shresthasuraj62@gmail.com",
    from: "np01cp4a190391@islingtoncollege.edu.np",
    subject: "Welcome to UniExplorer App",
    text: `Your activation code is: ${code}`,
  };
  try {
    console.log(process.env.SENDGRID_API_KEY);
    await sgMail.send(message);
  } catch (error) {
    log.error(fileName, methodName, error);
  }
};

module.exports = {
  sendResetVerificationCode,
  sendCreateAccountVerificationCode,
};
