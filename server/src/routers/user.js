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
    const userEmail = request.params.email;
    if (!isEmailValid(userEmail)) {
      log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      log.warn(fileName, methodName, NOT_FOUND.message);
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
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
    const { email = null, password = null } = request.body;
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
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    if (!user.emailVerified) {
      const code = randomstring.generate(5);
      user.accessCode = code;
      await user.save();
      sendCreateAccountVerificationCode(email, code);
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
    const { email = null, password = null, fullName = null } = request.body;
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
    const userExists = await User.findOne({ email: request.body.email });
    if (userExists) {
      log.warn(fileName, methodName, CONFLICT.message);
      return response.status(CONFLICT.status).send(CONFLICT.message);
    }
    const user = new User(request.body);
    const token = await user.generateAuthToken();
    user.token = token;
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
    response.status(OK.status).send(request.user);
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
    const email = request.user.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    await user.remove();
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Router for knowing if a user exist for reseting password purpose.
router.patch("/api/user/reset", async (request, response) => {
  const methodName = "UserResetCodeAddRoute";
  const { email } = request.body;
  if (!email || !isEmailValid(email)) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(NOT_FOUND).send(NOT_FOUND.message);
    }
    const code = randomstring.generate(5);
    user.accessCode = code;
    await user.save();
    sendResetVerificationCode(email, code);
    response.status(OK.status).send(OK.message);
    //Using api to generatre passcode and then storing it on user database for verification
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

//Chaning the password by verifying the auth code from database
router.patch("/api/user/reset/password", async (request, response) => {
  const methodName = "UserPasswordResetRoute";
  const { email = null, authCode = null, password } = request.body;
  if (
    !email ||
    !isEmailValid(email) ||
    !authCode ||
    !password ||
    !isPasswordValid(password)
  ) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(NOT_FOUND).send(NOT_FOUND.message);
    }
    if (authCode !== user.accessCode) {
      user["accessCode"] = "";
      await user.save();
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    user["password"] = password;
    user["token"] = "null";
    await user.save();
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

module.exports = router;
