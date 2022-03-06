//Module to send email for password reset
const fileName = "sendmail.js";
const log = require("../services/logger");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetVerificationCode = async (email, code) => {
  const methodName = "sendResetVerificationCode";
  const message = {
    to: email,
    from: "islingtoncollege.verifty@gmail.com",
    subject: "Password Reset Request",
    html: `<p>Your password reset code is: <h1>${code}</h1></p>
            <br/>
            <p>Please enter this code in the app to reset your password.</p>
    `,
  };
  try {
    await sgMail.send(message);
    log.info(fileName, methodName, "Password reset email successfully sent.");
  } catch (error) {
    log.error(fileName, methodName, error);
  }
};

const sendCreateAccountVerificationCode = async (email, code) => {
  const methodName = "sendCreateAccountVerificationCode";
  const message = {
    to: email,
    from: "islingtoncollege.verifty@gmail.com",
    subject: "Welcome to Islington UniExplorer App",
    html: `<p>Your activation code is: <h1>${code}</h1></p>
            <br/>
            <p>Please enter this code in the app to activate your account.</p>
    `,
  };
  try {
    await sgMail.send(message);
    log.info(fileName, methodName, "Activation email successfully sent.");
  } catch (error) {
    log.error(fileName, methodName, error);
  }
};

module.exports = {
  sendResetVerificationCode,
  sendCreateAccountVerificationCode,
};
