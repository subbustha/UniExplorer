const { Router } = require("express");
const router = new Router();
const User = require("../models/userModal");
const authUser = require("../middleware/authUser");
const {
  sendResetVerificationCode,
  sendCreateAccountVerificationCode,
} = require("../mail/sendmail");
const randomstring = require("randomstring");
const log = require("../services/logger");
const {
  INVALID_DATA_PROVIDED,
  INTERNAL_SERVER_ERROR,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  CREATED,
  CONFLICT,
} = require("../services/http-response");
const {
  isEmailValid,
  isPasswordValid,
  isNameValid,
} = require("../services/validator");
const fileName = "user.js";

//Router for user lookup
router.get("/api/user/:email", async (request, response) => {
  const methodName = "UserEmailValidationRoute";
  try {
    let userEmail = request.params.email;
    if (!userEmail || !isEmailValid(userEmail)) {
      log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    userEmail = userEmail.toLowerCase();
    const userFound = await User.findByEmail(userEmail);
    if (!userFound) {
      log.warn(fileName, methodName, NOT_FOUND.message);
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    if (userFound && !userFound.emailVerified) {
      log.warn(fileName, methodName, CONFLICT.message);
      return response.status(CONFLICT.status).send(CONFLICT.message);
    }
    log.info(fileName, methodName, OK.message);
    return response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router for user login
router.post("/api/user/login", async (request, response) => {
  const methodName = "UserLoginRoute";
  try {
    let { email = null, password = null } = request.body;
    if (
      !email ||
      !password ||
      !isEmailValid(email) ||
      !isPasswordValid(password)
    ) {
      log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    email = email.toLowerCase();
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    if (!user.emailVerified) {
      return response.status(CONFLICT.status).send(CONFLICT.message);
    }
    const token = await user.generateAuthToken();
    user.token = token;
    await user.save();
    response.status(OK.status).send(user);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
//Router for user logout
router.post("/api/user/logout", authUser, async (request, response) => {
  const methodName = "UserLogoutRoute";
  try {
    request.user.token = "null";
    await request.user.save();
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router for creating a new user
router.post("/api/user/create", async (request, response) => {
  const methodName = "UserCreateRoute";
  try {
    let { email = null, password = null, fullName = null } = request.body;
    if (
      !email ||
      !password ||
      !fullName ||
      !isEmailValid(email) ||
      !isPasswordValid(password) ||
      !isNameValid(fullName)
    ) {
      log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    email = email.toLowerCase();
    const userExists = await User.findByEmail(email);
    if (userExists) {
      log.warn(fileName, methodName, CONFLICT.message);
      return response.status(CONFLICT.status).send(CONFLICT.message);
    }
    const user = new User({ email, password, fullName });
    await user.save();
    response.status(CREATED.status).send(CREATED.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router for getting user data
router.get("/api/user", authUser, (request, response) => {
  const methodName = "UserTokenCheckRoute";
  try {
    log.info(fileName, methodName, OK.message);
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router for deleting user data
router.delete("/api/user", authUser, async (request, response) => {
  const methodName = "UserDeleteRoute";
  try {
    const email = request.user.email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    await user.remove();
    log.info(fileName, methodName, OK.message);
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router for knowing if a user exist for activating account purpose.
router.patch("/api/user/send/activation", async (request, response) => {
  const methodName = "UserActivationCodeAddRoute";
  let { email } = request.body;
  if (!email || !isEmailValid(email)) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  try {
    email = email.toLowerCase();
    const user = await User.findByEmail(email);
    if (!user) {
      log.warn(fileName, methodName, NOT_FOUND.message);
      return response.status(NOT_FOUND).send(NOT_FOUND.message);
    }
    const code = randomstring.generate(5);
    user.accessCode = code;
    await user.save();
    sendCreateAccountVerificationCode(email, code);
    response.status(OK.status).send(OK.message);
    //Using api to generatre passcode and then storing it on user database for verification
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router from activating the user account after getting the code.
router.patch("/api/user/activate", async (request, response) => {
  const methodName = "UserAccountActivationRoute";
  try {
    let { email = null, accessCode = null } = request.body;
    if (
      !email ||
      !accessCode ||
      !isEmailValid(email) ||
      accessCode.length !== 5
    ) {
      log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    email = email.toLowerCase();
    const user = await User.findByEmail(email);
    if (!user) {
      log.warn(fileName, methodName, NOT_FOUND.message);
      return response.status(NOT_FOUND).send(NOT_FOUND.message);
    }
    if (user.accessCode === accessCode) {
      log.info(fileName, methodName, OK.message);
      user.emailVerified = true;
      user.accessCode = "";
      await user.save();
      return response.status(OK.status).send(OK.message);
    } else {
      log.warn(fileName, methodName, UNAUTHORIZED.message);
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
  } catch (error) {
    log.error(fileName, methodName, error);
    return response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router for knowing if a user exist for reseting password purpose.
router.patch("/api/user/send/reset", async (request, response) => {
  const methodName = "UserResetCodeAddRoute";
  let { email = null } = request.body;
  if (!email || !isEmailValid(email)) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  try {
    email = email.toLowerCase();
    const user = await User.findByEmail(email);
    if (!user) {
      return response.status(NOT_FOUND).send(NOT_FOUND.message);
    }
    if (!user.emailVerified) {
      log.warn(fileName, methodName, CONFLICT.message);
      return response.status(CONFLICT.status).send(CONFLICT.message);
    }
    const code = randomstring.generate(5);
    user.accessCode = code;
    await user.save();
    sendResetVerificationCode(email, code);
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Chaning the password by verifying the auth code from database
router.patch("/api/user/reset", async (request, response) => {
  const methodName = "UserPasswordResetRoute";
  let { email = null, accessCode = null, password = null } = request.body;
  console.log(email, password, accessCode);
  if (
    !email ||
    !isEmailValid(email) ||
    !accessCode ||
    accessCode.length !== 5 ||
    !password ||
    !isPasswordValid(password)
  ) {
    log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  try {
    email = email.toLowerCase();
    const user = await User.findByEmail(email);
    if (!user) {
      log.warn(fileName, methodName, NOT_FOUND.message);
      return response.status(NOT_FOUND).send(NOT_FOUND.message);
    }
    if (accessCode !== user.accessCode) {
      log.warn(fileName, methodName, UNAUTHORIZED.message);
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    user.password = password;
    await user.save();
    log.info(fileName, methodName, OK.message);
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

module.exports = router;
